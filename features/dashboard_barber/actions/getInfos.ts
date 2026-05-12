"use server";

import { endOfDay, startOfDay, subDays } from "date-fns";
import { getBookingsBarber } from "@/features/booking/functions/get-bookings";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";
import { convertBRL } from "@/utils/convertBRL";

export const getBarberDashboardInfos = actionClient.action(async () => {
  try {
    const session = await verifySession();

    if (!session || session.role !== "BARBER") {
      throw new Error("Unauthorized");
    }

    const barberId = session.barberId as string;

    // Variaveis de busca
    const now = new Date();
    const startOfDayDate = startOfDay(now);
    const yesterday = subDays(now, 1);
    const endOfDayDate = endOfDay(now);

    const [
      nextBookings,
      bookings,
      graphBookings,
      disponibility,
      totalBookingsToday,
    ] = await Promise.all([
      // Próximos agendamentos
      getBookingsBarber(barberId, now, 5, true),

      // Faturamento e atendimentos realizados ONTEM e HOJE
      prisma.booking.findMany({
        where: {
          barberId: barberId,
          date: {
            gte: startOfDay(yesterday),
            lte: endOfDayDate,
          },
        },
      }),

      // Dados de faturamento semanal
      prisma.booking.findMany({
        where: {
          barberId,
          status: "COMPLETED",
          date: {
            gte: subDays(now, 6),
            lte: endOfDayDate,
          },
        },
        select: {
          date: true,
          priceInCents: true,
        },
      }),

      prisma.disponibility.findMany({
        where: { barberId },
        select: { dayOfWeek: true },
      }) ?? [],

      prisma.booking.count({
        where: {
          barberId,
          date: {
            gte: startOfDayDate,
            lte: endOfDayDate,
          },
        },
      }),
    ]);

    const todayBookings = bookings.filter(booking => {
      return booking.date >= startOfDayDate && booking.date <= endOfDayDate;
    });

    /** Agendamentos completos */
    const todayCompleted = todayBookings.filter(b => b.status === "COMPLETED");
    /** Agendamentos com status SCHEDULED */
    const todayScheduled = todayBookings.filter(b => b.status === "SCHEDULED");

    const yesterdayBookings = bookings.filter(booking => {
      return (
        booking.date >= startOfDay(yesterday) &&
        booking.date <= endOfDay(yesterday)
      );
    });

    /**
     * Faturamento total do dia atual e quantidade de serviços realizados. Se houver um erro na consulta, retorna 0 para ambos os valores.
     */
    const todayBillingAgg = todayCompleted.reduce(
      (acc, booking) => {
        return {
          priceInCents: acc.priceInCents + (booking.priceInCents ?? 0),
        };
      },
      { priceInCents: 0 },
    );

    /**
     * Faturamento total do dia anterior e quantidade de serviços realizados. Se houver um erro na consulta, retorna 0 para ambos os valores.
     */
    const yesterdayBillingAgg = yesterdayBookings.reduce(
      (acc, booking) => {
        return {
          priceInCents: acc.priceInCents + (booking.priceInCents ?? 0),
        };
      },
      { priceInCents: 0 },
    );

    const totalScheduledToday = todayScheduled.length;

    /**
     * Total do faturamento do dia atual, convertido para BRL. Se houver um erro na consulta, retorna "R$ 0,00".
     */
    const todayBilling = convertBRL(todayBillingAgg.priceInCents ?? 0);

    /**
     * Total do faturamento do dia anterior, convertido para BRL. Se houver um erro na consulta, retorna "R$ 0,00".
     */
    const yesterdayBilling = convertBRL(yesterdayBillingAgg.priceInCents ?? 0);

    /**
     * Total de serviços realizados no dia atual. Se houver um erro na consulta, retorna 0.
     */
    const bookingsPerformed = todayCompleted.length;

    /**
     * Total de serviços realizados no dia anterior. Se houver um erro na consulta, retorna 0.
     */
    const bookingsPerformedYesterday = yesterdayBookings.filter(
      booking => booking.status === "COMPLETED",
    ).length;

    /**
     * Total de agendamentos para o dia atual que ainda não foram confirmados (status "SCHEDULED" e data menor ou igual à data atual). Se houver um erro na consulta, retorna 0.
     */
    const bookingsNotConfirmedToday = todayScheduled.length;

    const weekMap = new Map<number, number>();

    // inicia com 0
    for (let i = 0; i < 7; i++) {
      weekMap.set(i, 0);
    }

    const availableDays = new Set(disponibility.map(d => d.dayOfWeek));

    graphBookings.forEach(b => {
      const day = b.date.getDay();
      // biome-ignore lint/style/noNonNullAssertion: <Tá dboa>
      weekMap.set(day, weekMap.get(day)! + b.priceInCents);
    });

    const today = new Date().getDay();

    const ordered = Array.from(weekMap.entries()).sort(
      ([a], [b]) => ((today - b + 7) % 7) - ((today - a + 7) % 7),
    );

    const daysOfWeekMap = {
      0: "Domingo",
      1: "Segunda-feira",
      2: "Terça-feira",
      3: "Quarta-feira",
      4: "Quinta-feira",
      5: "Sexta-feira",
      6: "Sábado",
    };

    const weeklyBillingData = ordered
      .filter(([day]) => availableDays.has(day))
      .map(([day, value]) => {
        const dayMap = daysOfWeekMap[day as keyof typeof daysOfWeekMap];
        return {
          day: day === today ? `${dayMap} (Hoje)` : dayMap,
          saldoEmReais: value / 100,
        };
      });

    /**
     * Porcentagem de crescimento ou queda no faturamento em relação ao dia anterior. Se o faturamento do dia anterior for 0, retorna null para evitar divisão por zero.
     */
    const todayTotal = todayBillingAgg.priceInCents ?? 0;
    const yesterdayTotal = yesterdayBillingAgg.priceInCents ?? 0;

    const growthPercentage =
      yesterdayTotal === 0
        ? 0
        : ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100;

    /** Progresso dos agendamentos */
    const progressBookings =
      totalBookingsToday === 0
        ? 0
        : ((totalScheduledToday - bookingsNotConfirmedToday) /
            totalBookingsToday) *
          100;

    /** Informações consolidadas sobre agendamentos do dia atual */
    const bookingsData = {
      /** Próximos 5 agendamentos programados para o barbeiro a partir do momento atual */
      next: nextBookings,
      /** Todos os agendamentos do dia atual, independentemente do status */
      totalBookingsToday,
      /** Total de agendamentos marcados para hoje */
      totalScheduledToday: totalScheduledToday,
      /** Quantidade de agendamentos não confirmados até o horário atual */
      pendingConfirmationToday: bookingsNotConfirmedToday,
      /** Diferença entre pendentes e já realizados para visualizar progresso em porcentagem */
      progressToday: progressBookings,
    };

    /** Dados financeiros e operacionais do dia atual */
    const todayData = {
      billing: {
        /** Valor formatado em BRL (ex: "R$ 1.250,00") */
        formatted: todayBilling,
        /** Valor bruto em centavos para cálculos mais precisos */
        rawInCents: todayTotal,
      },
      /** Total de agendamentos realizados hoje */
      bookingsPerformed,
    };

    /** Dados do dia anterior para comparação */
    const yesterdayData = {
      billing: {
        /** Valor formatado em BRL do dia anterior */
        formatted: yesterdayBilling,
        /** Valor bruto em centavos do dia anterior */
        rawInCents: yesterdayTotal,
        /** Agregação completa do Prisma do dia anterior */
        aggregate: yesterdayBillingAgg,
      },
      /** Total de agendamentos realizados no dia anterior */
      bookingsPerformed: bookingsPerformedYesterday,
    };

    /** Métricas de crescimento e variação entre períodos */
    const comparisonsData = {
      /** Percentual de crescimento/queda no faturamento em relação ao dia anterior. Positivo = crescimento, negativo = redução */
      billingGrowthPercentage: growthPercentage,
    };

    /** Dados agregados para análises e gráficos */
    const analyticsData = {
      /** Array com faturamento por dia da semana para visualização em gráficos */
      weeklyBillingData,
    };

    return {
      /** ID único do barbeiro */
      barberId,
      bookingsData,
      todayData,
      yesterdayData,
      comparisonsData,
      analyticsData,
    };
  } catch (error) {
    console.error("Error fetching barber dashboard infos:", error);
    throw error;
  }
});

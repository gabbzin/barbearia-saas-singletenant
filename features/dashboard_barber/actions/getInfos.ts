"use server";

import { endOfDay, startOfDay, subDays } from "date-fns";
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

    const requests = Promise.allSettled([
      // Próximos agendamentos - 0
      prisma.booking.findMany({
        where: {
          barberId: barberId,
          date: {
            gte: startOfDayDate,
            lte: endOfDayDate,
          },
          status: "SCHEDULED",
        },
        include: {
          service: true,
          user: true,
        },
        orderBy: {
          date: "asc",
        },
        take: 5,
      }),

      // Faturamento e atendimentos realizados hoje - 1
      prisma.booking.aggregate({
        _sum: {
          priceInCents: true,
        },
        _count: {
          id: true,
        },
        where: {
          barberId: barberId,
          date: {
            gte: startOfDayDate,
            lte: endOfDayDate,
          },
          status: "COMPLETED",
        },
      }),

      // Faturamento total do dia anterior e atendimentos realizados - 2
      prisma.booking.aggregate({
        _sum: {
          priceInCents: true,
        },
        _count: {
          id: true,
        },
        where: {
          barberId: barberId,
          date: {
            gte: startOfDay(yesterday),
            lte: endOfDay(yesterday),
          },
          status: "COMPLETED",
        },
      }),

      // Agendamentos para hoje - 3
      prisma.booking.count({
        where: {
          barberId: barberId,
          date: {
            gte: startOfDayDate,
          },
          status: "SCHEDULED",
        },
      }),

      // Agendamentos não confirmados de hoje - 4
      prisma.booking.count({
        where: {
          barberId: barberId,
          date: {
            gte: startOfDayDate,
            lte: now,
          },
          status: "SCHEDULED",
        },
      }),

      // Dados de faturamento semanal - 5 (Com exceção dos dias que não tem disponibilidade cadastrada, para evitar erros na consulta)
      prisma.$queryRaw`
        WITH current_day AS (
          SELECT EXTRACT(DOW FROM NOW())::int AS today
        )

        SELECT 
          CASE 
            WHEN d.dayOfWeek = cd.today 
            THEN CONCAT('Dia ', d.dayOfWeek, ' (Hoje)')
            ELSE CONCAT('Dia ', d.dayOfWeek)
          END AS day,
          
          COALESCE(SUM(b."priceInCents"), 0) AS saldo

        FROM 
          (VALUES (0), (1), (2), (3), (4), (5), (6)) AS d(dayOfWeek)

        CROSS JOIN current_day cd

        INNER JOIN 
          "Disponibility" dis 
            ON dis."dayOfWeek" = d.dayOfWeek 
            AND dis."barberId" = ${barberId}

        LEFT JOIN 
          "Booking" b 
            ON b."barberId" = ${barberId}
            AND EXTRACT(DOW FROM b."date") = d.dayOfWeek
            AND b."status" = 'COMPLETED'
            AND b."date" >= ${subDays(now, 6)}
            AND b."date" <= ${endOfDayDate}

        GROUP BY 
          d.dayOfWeek, cd.today

        ORDER BY 
          (d.dayOfWeek - cd.today + 6) % 7;
      `,
    ]);

    const results = await requests;

    /**
     * Próximo agendamento para o dia atual. Se houver um erro na consulta, retorna null.
     */
    const nextBookings =
      results[0].status === "fulfilled" ? results[0].value : null;

    /**
     * Faturamento total do dia atual e quantidade de serviços realizados. Se houver um erro na consulta, retorna 0 para ambos os valores.
     */
    const billing =
      results[1].status === "fulfilled"
        ? results[1].value
        : { _sum: { priceInCents: 0 }, _count: { id: 0 } };

    /**
     * Total de agendamentos para o dia anterior. Se houver um erro na consulta, retorna 0.
     */
    const yesterdayBillingAgg =
      results[2].status === "fulfilled"
        ? results[2].value
        : { _sum: { priceInCents: 0 }, _count: { id: 0 } };

    /**
     * Total de agendamentos para o dia atual. Se houver um erro na consulta, retorna 0.
     */
    const totalSchedules =
      results[3].status === "fulfilled" ? results[3].value : 0;

    /**
     * Total do faturamento do dia atual, convertido para BRL. Se houver um erro na consulta, retorna "R$ 0,00".
     */
    const todayBilling = convertBRL(billing._sum.priceInCents ?? 0);

    /**
     * Total do faturamento do dia anterior, convertido para BRL. Se houver um erro na consulta, retorna "R$ 0,00".
     */
    const yesterdayBilling = convertBRL(
      yesterdayBillingAgg._sum.priceInCents ?? 0,
    );

    /**
     * Total de serviços realizados no dia atual. Se houver um erro na consulta, retorna 0.
     */
    const servicesPerformed = billing._count.id ?? 0;

    /**
     * Total de serviços realizados no dia anterior. Se houver um erro na consulta, retorna 0.
     */
    const yesterdayServicesPerformed = yesterdayBillingAgg._count.id ?? 0;

    /**
     * Total de agendamentos para o dia atual que ainda não foram confirmados (status "SCHEDULED" e data menor ou igual à data atual). Se houver um erro na consulta, retorna 0.
     */
    const bookingsNotConfirmedToday =
      results[4].status === "fulfilled" ? results[4].value : 0;

    const weeklyBillingBrut = (
      results[5].status === "fulfilled" ? results[5].value : []
    ) as [{ day: string; saldo: bigint }];

    const daysOfWeekMap: Record<number, string> = {
      0: "Domingo",
      1: "Segunda-feira",
      2: "Terça-feira",
      3: "Quarta-feira",
      4: "Quinta-feira",
      5: "Sexta-feira",
      6: "Sábado",
    };

    const weeklyBillingData = weeklyBillingBrut.map(item => {
      return {
        day: daysOfWeekMap[Number(item.day.split(" ")[1])],
        saldoEmReais: Number(item.saldo) / 100,
      };
    });

    console.log(nextBookings);

    /**
     * Porcentagem de crescimento ou queda no faturamento em relação ao dia anterior. Se o faturamento do dia anterior for 0, retorna null para evitar divisão por zero.
     */
    const growthPercentage = Number(
      yesterdayBillingAgg._sum.priceInCents && billing._sum.priceInCents
        ? (
            ((billing._sum.priceInCents -
              yesterdayBillingAgg._sum.priceInCents) /
              yesterdayBillingAgg._sum.priceInCents) *
            100
          ).toFixed(2)
        : 0,
    );

    return {
      barberId,
      nextBookings,
      billing,
      todayBilling,
      totalSchedules,
      servicesPerformed,
      yesterdayBillingAgg,
      yesterdayBilling,
      yesterdayServicesPerformed,
      growthPercentage,
      bookingsNotConfirmedToday,
      weeklyBillingData,
    };
  } catch (error) {
    console.error("Error fetching barber dashboard infos:", error);
    throw error;
  }
});

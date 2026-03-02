"use server";

import { endOfDay, startOfDay, subDays } from "date-fns";
import z from "zod";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";
import { convertBRL } from "@/utils/convertBRL";

const inputSchema = z.object({
  barberId: z.string(),
});

export const getBarberDashboardInfos = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barberId } }) => {
    try {
      const now = new Date();
      const startOfDayDate = startOfDay(now);
      const yesterday = subDays(now, 1);
      const endOfDayDate = endOfDay(now);

      const requests = Promise.allSettled([
        // Próximo agendamento
        prisma.booking.findFirst({
          where: {
            barberId: barberId,
            date: {
              gte: startOfDayDate,
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
        }),

        // Faturamento e atendimentos realizados hoje
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

        // Faturamento total do dia anterior
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

        // Agendamentos para hoje
        prisma.booking.count({
          where: {
            barberId: barberId,
            date: {
              gte: startOfDayDate,
            },
            status: "SCHEDULED",
          },
        }),
      ]);

      const results = await requests;

      /**
       * Próximo agendamento para o dia atual. Se houver um erro na consulta, retorna null.
       */
      const nextBooking =
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
        nextBooking,
        billing,
        todayBilling,
        totalSchedules,
        servicesPerformed,
        yesterdayBillingAgg,
        yesterdayBilling,
        yesterdayServicesPerformed,
        growthPercentage,
      };
    } catch (error) {
      console.error("Error fetching barber dashboard infos:", error);
      throw error;
    }
  });

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

      // Agendamentos para hoje (Não confirmados)
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
    ]);

    const results = await requests;

    const nextBooking =
      results[0].status === "fulfilled" ? results[0].value : null;

    const billing =
      results[1].status === "fulfilled"
        ? results[1].value
        : { _sum: { priceInCents: 0 }, _count: { id: 0 } };

    const yesterdayBillingAgg =
      results[2].status === "fulfilled"
        ? results[2].value
        : { _sum: { priceInCents: 0 }, _count: { id: 0 } };

    const totalSchedules =
      results[3].status === "fulfilled" ? results[3].value : 0;

    const todayBilling = convertBRL(billing._sum.priceInCents ?? 0);

    const yesterdayBilling = convertBRL(
      yesterdayBillingAgg._sum.priceInCents ?? 0,
    );

    const servicesPerformed = billing._count.id ?? 0;

    const yesterdayServicesPerformed = yesterdayBillingAgg._count.id ?? 0;

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

"use server";

import { endOfDay, startOfDay } from "date-fns";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";
import { convertBRL } from "@/utils/convertBRL";

export const getBarberDashboardInfos = actionClient.action(async () => {
  const session = await verifySession();

  if (!session?.barberId) {
    throw new Error("Não autorizado.");
  }

  const barberId = session.barberId;

  try {
    const now = new Date();
    const startOfDayDate = startOfDay(now);
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

    const nextBooking =
      results[0].status === "fulfilled" ? results[0].value : null;

    const billing =
      results[1].status === "fulfilled"
        ? results[1].value
        : { _sum: { priceInCents: 0 }, _count: { id: 0 } };

    const totalSchedules =
      results[2].status === "fulfilled" ? results[2].value : 0;

    const todayBilling = convertBRL(billing._sum.priceInCents ?? 0);
    const servicesPerformed = billing._count.id ?? 0;

    return {
      nextBooking,
      billing,
      todayBilling,
      totalSchedules,
      servicesPerformed,
    };
  } catch (error) {
    console.error("Error fetching barber dashboard infos:", error);
    throw error;
  }
});

export const getBarberDefaultTimes = actionClient.action(async () => {
  const session = await verifySession();

  if (!session?.barberId) {
    throw new Error("Não autorizado.");
  }

  const disponibilities = await prisma.disponibility.findMany({
    where: { barberId: session.barberId },
  });

  if (!disponibilities || disponibilities.length === 0) {
    return { defaultTimes: null };
  }

  const activeDays = new Set(disponibilities.map(disp => disp.dayOfWeek));
  const first = disponibilities[0];

  return {
    defaultTimes: {
      horario_abertura: first.startTime,
      horario_fechamento: first.endTime,
      0: activeDays.has(0),
      1: activeDays.has(1),
      2: activeDays.has(2),
      3: activeDays.has(3),
      4: activeDays.has(4),
      5: activeDays.has(5),
      6: activeDays.has(6),
    },
  };
});

"use server";

import { endOfMonth, startOfMonth } from "date-fns";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

export const getAdminDashboardInfos = actionClient.action(async () => {
  try {
    const user = await verifySession();

    if (!user || user.role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const now = new Date();
    const startOfMonthDate = startOfMonth(now);
    const endOfMonthDate = endOfMonth(now);

    const startOfLastMonthDate = startOfMonth(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );
    const endOfLastMonthDate = endOfMonth(
      new Date(now.getFullYear(), now.getMonth() - 1, 1),
    );

    const requests = Promise.allSettled([
      // Dados do mês atual
      await prisma.booking.aggregate({
        _sum: {
          priceInCents: true,
        },
        _count: {
          id: true,
        },
        where: {
          date: {
            gte: startOfMonthDate,
            lte: endOfMonthDate,
          },
          status: "COMPLETED",
        },
      }),

      // Dados do mês anterior
      await prisma.booking.aggregate({
        _sum: {
          priceInCents: true,
        },
        _count: {
          id: true,
        },
        where: {
          date: {
            gte: startOfLastMonthDate,
            lte: endOfLastMonthDate,
          },
          status: "COMPLETED",
        },
      }),

      await prisma.barber.count(),
    ]);

    const results = await requests;

    // Dados do mês atual
    const monthlyEarningsResult = results[0];
    // Dados do mês anterior
    const lastMonthlyEarningsResult = results[1];

    // Contagem de barbeiros
    const barbersCountResult = results[2];

    // Processar resultados, tratando possíveis falhas
    const monthlyEarnings =
      monthlyEarningsResult.status === "fulfilled"
        ? monthlyEarningsResult.value
        : { _sum: { priceInCents: 0 }, _count: { id: 0 } };

    const lastMonthlyEarnings =
      lastMonthlyEarningsResult.status === "fulfilled"
        ? lastMonthlyEarningsResult.value
        : { _sum: { priceInCents: 0 }, _count: { id: 0 } };

    const barbersCount =
      barbersCountResult.status === "fulfilled" ? barbersCountResult.value : 0;

    const monthlyEarningsDifference =
      lastMonthlyEarnings._sum.priceInCents && monthlyEarnings._sum.priceInCents
        ? monthlyEarnings._sum.priceInCents -
          lastMonthlyEarnings._sum.priceInCents
        : 0;

    const monthlyEarningsPercentageChange =
      lastMonthlyEarnings._sum.priceInCents &&
      lastMonthlyEarnings._sum.priceInCents !== 0
        ? (monthlyEarningsDifference / lastMonthlyEarnings._sum.priceInCents) *
          100
        : 0;

    const monthlyEarningsDifferenceCount =
      lastMonthlyEarnings._count.id && monthlyEarnings._count.id
        ? monthlyEarnings._count.id - lastMonthlyEarnings._count.id
        : 0;

    return {
      monthlyEarnings,
      barbersCount,
      monthlyEarningsPercentageChange,
      monthlyEarningsDifferenceCount,
      monthlyEarningsDifference,
    };
  } catch (error) {
    console.error("Error fetching barber dashboard infos:", error);
    throw error;
  }
});

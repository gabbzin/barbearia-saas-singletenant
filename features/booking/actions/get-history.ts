"use server";

import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

export const getHistory = actionClient.action(async () => {
  const session = await verifySession();

  if (!session) {
    throw new Error("Usuário não autenticado.");
  }

  const userId = session.id;

  const history = await prisma.booking.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
    include: {
      service: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!history) {
    return { history: null };
  }

  return { history };
});

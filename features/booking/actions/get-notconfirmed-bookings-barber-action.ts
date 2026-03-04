import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

export const getNotConfirmedBookings = actionClient.action(async () => {
  const session = await verifySession();
  const now = new Date();

  if (!session || session.role !== "BARBER" || !session.barberId) {
    throw new Error("Usuário não autorizado.");
  }

  const barberId = session.barberId;

  const notConfirmedBookings = await prisma.booking.findMany({
    where: {
      barberId: barberId,
      status: "SCHEDULED",
      date: {
        lt: now,
      }
    },
    include: {
      service: true,
      user: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return { notConfirmedBookings };
});
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getBarbers = cache(async () => {
  return await prisma.barber.findMany({
    include: {
      user: true,
    },
    orderBy: {
      user: {
        name: "asc",
      },
    },
  });
});

export const getBarberById = cache(async (barberId: string) => {
  return await prisma.barber.findUnique({
    where: {
      id: barberId,
    },
    include: {
      user: true,
    },
  });
});

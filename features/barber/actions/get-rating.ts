import { prisma } from "@/lib/prisma";


export function getRating(barberId: string) {
  return prisma.rating.findMany({
    where: {
      barberId
    },
  })
}
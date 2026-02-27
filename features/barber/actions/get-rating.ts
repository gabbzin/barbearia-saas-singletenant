import { prisma } from "@/lib/prisma";

export async function getRating(barberId: string) {
  const ratings = await prisma.rating.aggregate({
    where: {
      barberId,
    },
    _avg: {
      ratingValue: true,
    },
    _count: {
      ratingValue: true,
    },
  });

  if (!ratings) {
    return {
      average: 0,
      count: 0,
    };
  }

  const soma = ratings._avg.ratingValue
    ? ratings._avg.ratingValue
    : 0;

  return {
    average: soma / ratings._count.ratingValue,
    count: ratings._count.ratingValue,
  };
}

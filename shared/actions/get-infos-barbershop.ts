"use server";

import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getInfosBarbershop = cache(async () => {
  try {
    const barbershop = await prisma.barbershop.findFirst({
      select: {
        name: true,
        address: true,
        storageUrl: true,
        imageUrl: true,
      },
    });

    if (!barbershop) throw new Error("Barbershop not found");

    return barbershop;
  } catch (error: unknown) {
    console.error(error);
    return null;
  }
});

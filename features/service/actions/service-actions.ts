"use server";

import { z } from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "../schema/serviceSchema";

const barberIdSchema = z.object({ barberId: z.string() });
const serviceIdSchema = z.object({ serviceId: z.string() });

export const getServicesByBarberIdAction = actionClient
  .inputSchema(barberIdSchema)
  .action(async ({ parsedInput: { barberId } }) => {
    const services = await prisma.barberService.findMany({
      where: { barberId },
    });
    return { services };
  });

export const createServiceAction = actionClient
  .inputSchema(serviceSchema.extend({ barberId: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await verifySession();
    if (!session) throw new Error("Não autorizado.");

    const service = await prisma.barberService.create({
      data: {
        name: parsedInput.name,
        description: parsedInput.description,
        priceInCents: Math.round(parsedInput.price * 100),
        imageUrl:
          parsedInput.imageUrl ||
          "https://utfs.io/f/0ddfbd26-a424-43a0-aaf3-c3f1dc6be6d1-1kgxo7.png",
        barberId: parsedInput.barberId,
      },
    });

    return { service };
  });

export const patchServiceAction = actionClient
  .inputSchema(serviceSchema.extend({ serviceId: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await verifySession();
    if (!session) throw new Error("Não autorizado.");

    const service = await prisma.barberService.update({
      where: { id: parsedInput.serviceId },
      data: {
        name: parsedInput.name,
        description: parsedInput.description,
        priceInCents: Math.round(parsedInput.price * 100),
      },
    });

    return { service };
  });

export const deleteServiceAction = actionClient
  .inputSchema(serviceIdSchema)
  .action(async ({ parsedInput: { serviceId } }) => {
    const session = await verifySession();
    if (!session) throw new Error("Não autorizado.");

    await prisma.barberService.delete({ where: { id: serviceId } });
    return { serviceId };
  });


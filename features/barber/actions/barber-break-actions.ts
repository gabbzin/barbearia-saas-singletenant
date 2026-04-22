"use server";

import { z } from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";
import { timeStringToDate } from "@/utils/convertTimes";

const barberIdSchema = z.object({ barberId: z.string() });
const barberBreakIdSchema = z.object({ barberBreakId: z.string() });

const barberBreakSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string(),
  endTime: z.string(),
  motivo: z.string().optional(),
});

export const getBarberBreaksByBarberIdAction = actionClient
  .inputSchema(barberIdSchema)
  .action(async ({ parsedInput: { barberId } }) => {
    const barberBreaks = await prisma.barberBreak.findMany({
      where: { barberId },
    });
    return { barberBreaks };
  });

export const createBarberBreakAction = actionClient
  .inputSchema(barberBreakSchema.extend({ barberId: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await verifySession();
    if (!session) throw new Error("Não autorizado.");

    const barberBreak = await prisma.barberBreak.create({
      data: {
        barberId: parsedInput.barberId,
        dayOfWeek: parsedInput.dayOfWeek,
        startTime: timeStringToDate(parsedInput.startTime),
        endTime: timeStringToDate(parsedInput.endTime),
        motivo: parsedInput.motivo,
      },
    });

    return { barberBreak };
  });

export const patchBarberBreakAction = actionClient
  .inputSchema(barberBreakSchema.extend({ barberBreakId: z.string() }))
  .action(async ({ parsedInput }) => {
    const session = await verifySession();
    if (!session) throw new Error("Não autorizado.");

    const barberBreak = await prisma.barberBreak.update({
      where: { id: parsedInput.barberBreakId },
      data: {
        dayOfWeek: parsedInput.dayOfWeek,
        startTime: timeStringToDate(parsedInput.startTime),
        endTime: timeStringToDate(parsedInput.endTime),
        motivo: parsedInput.motivo,
      },
    });

    return { barberBreak };
  });

export const deleteBarberBreakAction = actionClient
  .inputSchema(barberBreakIdSchema)
  .action(async ({ parsedInput: { barberBreakId } }) => {
    const session = await verifySession();
    if (!session) throw new Error("Não autorizado.");

    await prisma.barberBreak.delete({ where: { id: barberBreakId } });
    return { barberBreakId };
  });

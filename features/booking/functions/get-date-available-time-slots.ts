"use server";

import { endOfDay, format, isToday, startOfDay } from "date-fns";
import { returnValidationErrors } from "next-safe-action";
// import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
// import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  barberId: z.string(),
  serviceId: z.string(),
  date: z.date(),
});

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

// Função para converter minutos de volta para "HH:mm"
const minutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
};

export const getDateAvailableTimeSlots = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { barberId, serviceId, date } }) => {
    const session = await verifySession();

    if (!session) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Unauthorized"],
      });
    }

    const service = await prisma.barberService.findUnique({
      where: {
        id: serviceId,
      },
      select: {
        durationInMinutes: true,
      },
    });

    if (!service) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Serviço não encontrado"],
      });
    }

    const serviceDuration = service.durationInMinutes;

    const bookings = await prisma.booking.findMany({
      where: {
        service: {
          barberId: barberId,
        },
        date: {
          gte: startOfDay(date),
          lte: endOfDay(date),
        },
        status: { not: "CANCELLED" },
      },
      select: {
        date: true,
        service: {
          select: {
            durationInMinutes: true,
          },
        },
      },
    });

    const day = date.getDay(); // 0 (Domingo) a 6 (Sábado)

    const availability = await prisma.disponibility.findFirst({
      where: {
        barberId,
        dayOfWeek: day,
      },
      select: {
        dayOfWeek: true,
        startTime: true,
        endTime: true,
      },
    });

    if (!availability) {
      return [];
    }
    if (availability.dayOfWeek !== day) {
      return [];
    }

    const shiftStart = timeToMinutes(availability?.startTime);
    const shiftEnd = timeToMinutes(availability?.endTime);

    // Gerar os horários disponíveis com base na disponibilidade do barbeiro e nos agendamentos existentes
    const occupiedRanges = bookings.map(booking => {
      const startMin = timeToMinutes(format(booking.date, "HH:mm"));
      const endMin = startMin + booking.service.durationInMinutes;

      return { start: startMin, end: endMin };
    });

    const dynamicSlots: string[] = [];
    const interval = 15;
    // Lógica para bloquear horários que já passaram hoje
    const now = new Date();
    const isQueryingToday = isToday(date);
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // Tempo de antecedência mínima para agendar (30 minutos)
    const bookingBuffer = 30;

    for (
      let time = shiftStart;
      time + serviceDuration <= shiftEnd;
      time += interval
    ) {
      if (isQueryingToday && time < currentMinutes + bookingBuffer) {
        continue; // Pula horários que já passaram ou estão muito próximos
      }

      const proposedStart = time;
      const proposedEnd = time + serviceDuration;

      const hasConflict = occupiedRanges.some(range => {
        return proposedStart < range.end && proposedEnd > range.start;
      })

      if (!hasConflict) {
        dynamicSlots.push(minutesToTime(proposedStart));
      }
    }
    
    return dynamicSlots;
  });

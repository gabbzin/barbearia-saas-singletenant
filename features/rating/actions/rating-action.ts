import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";

const inputSchema = z.object({
  ratingValue: z.number().min(1).max(5),
  comment: z.string().optional(),
  bookingId: z.string(),
});

export const RatingAction = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { ratingValue, comment, bookingId } }) => {
    const session = await verifySession();

    if (!session || session.role !== "USER") {
      return returnValidationErrors(inputSchema, {
        _errors: ["Usuário não autenticado ou sem permissão"],
      });
    }

    const userId = session.id;

    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!booking) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Agendamento não encontrado"],
      });
    }

    if (booking.userId !== session.id) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Usuário não é o cliente do agendamento"],
      });
    }

    if (booking.status !== "COMPLETED") {
      return returnValidationErrors(inputSchema, {
        _errors: ["Somente agendamentos concluídos podem ser avaliados"],
      });
    }

    const rating = await prisma.rating.findFirst({
      where: {
        bookingId,
      },
    });

    if (rating) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Este agendamento já foi avaliado"],
      });
    }

    const barberId = booking.barberId;

    await prisma.rating.create({
      data: {
        barberId,
        bookingId,
        userId,
        ratingValue,
        comment,
      },
    });

    return { success: true };
  });

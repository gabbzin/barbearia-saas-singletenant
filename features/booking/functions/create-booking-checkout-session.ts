"use server";

import { format } from "date-fns";
import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe-client";
import { clientRoutes } from "@/shared/constants/routes";

const inputSchema = z.object({
  serviceId: z.uuid(),
  date: z.date(),
});

export const createBookingCheckoutSession = actionClient
  .inputSchema(inputSchema)
  .outputSchema(
    z.object({
      url: z.string().nullable(),
    }),
  )
  .action(async ({ parsedInput: { serviceId, date } }) => {
    const session = await verifySession();

    if (!session) {
      returnValidationErrors(inputSchema, {
        _errors: ["Não autorizado."],
      });
    }

    const service = await prisma.barberService.findUnique({
      where: {
        id: serviceId,
      },
      include: {
        barber: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!service) {
      returnValidationErrors(inputSchema, {
        _errors: ["Serviço não encontrado."],
      });
    }

    const checkoutSession = await stripeClient.checkout.sessions.create({
      customer_email: session.email,
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}${clientRoutes.bookings}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      metadata: {
        serviceId: serviceId,
        barberId: service.barber.id,
        userId: session.id,
        date: date.toISOString(),
      },
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: service.priceInCents,
            product_data: {
              name: `${service.barber.user?.name} - ${service.name} em ${format(date, "dd/MM/yyyy HH:mm")}`,
              description: `${service.description}`,
              images: [service.imageUrl],
            },
          },
          quantity: 1,
        },
      ],
    });
    return { url: checkoutSession.url };
  });

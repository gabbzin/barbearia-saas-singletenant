import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe-client";

// Lógica para lidar com a finalização do checkout SUCESSO
export async function handleCheckoutCompleted(
  event: Stripe.CheckoutSessionCompletedEvent,
) {
  try {
    const session = event.data.object;
    const date = session.metadata?.date
      ? new Date(session.metadata.date)
      : null;

    const serviceId = session.metadata?.serviceId;
    const userId = session.metadata?.userId;
    const eventId = event.id;
    const barberId = session.metadata?.barberId;

    const exists = await prisma.booking.findUnique({
      where: {
        stripeEventId: eventId,
      },
    });

    if (exists) {
      return { ok: true };
    }
    if (!date || !serviceId || !userId || !barberId) {
      return { ok: false };
    }

    const expandedSession = await stripeClient.checkout.sessions.retrieve(
      session.id,
      {
        expand: ["payment_intent"],
      },
    );

    const paymentIntent =
      expandedSession.payment_intent as Stripe.PaymentIntent;

    const chargeId =
      typeof paymentIntent.latest_charge === "string"
        ? paymentIntent.latest_charge
        : paymentIntent.latest_charge?.id;

    await prisma.booking.create({
      data: {
        services: {
          connect: [{ id: serviceId }],
        },
        date,
        userId,
        barberId,
        stripeChargeId: chargeId || null,
        stripeEventId: eventId,
        paymentMethod: "card",
        priceInCents: session.amount_total ?? 0,
      },
    });

    revalidatePath("/bookings");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

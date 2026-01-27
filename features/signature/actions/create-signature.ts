"use server";

import { returnValidationErrors } from "next-safe-action";
import z from "zod";
import { verifySession } from "@/features/user/repository/user.repository";
import { actionClient } from "@/lib/actionClient";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe-client";

const inputSchema = z.object({
  // planId: z.uuid(),
  planId: z.string(),
});

export const createSignature = actionClient
  .inputSchema(inputSchema)
  .action(async ({ parsedInput: { planId } }) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not configured.");
    }

    const user = await verifySession();

    if (!user) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Não autorizado."],
      });
    }

    const hasActiveSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        planId: planId,
      },
    });

    if (hasActiveSubscription) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Você já possui uma assinatura ativa."],
      });
    }

    const plan = await prisma.plan.findUnique({
      where: {
        id: planId,
      },
    });

    if (!plan) {
      return returnValidationErrors(inputSchema, {
        _errors: ["Assinatura não encontrada."],
      });
    }

    const customerConfig = {
      customer: user.stripeCustomerId!,
    };

    try {
      const checkoutSession = await stripeClient.checkout.sessions.create({
        ...customerConfig,
        mode: "subscription",
        payment_method_types: ["card"],
        subscription_data: {
          metadata: {
            userId: user.id,
            planId: plan.id,
          },
        },
        line_items: [
          {
            price: plan.stripePriceId ? plan.stripePriceId : undefined,
            quantity: 1,
          },
        ],

        metadata: {
          userId: user.id,
          planId: plan.id,
        },

        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}`, // Criar a página de sucesso
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      });

      if (!checkoutSession.url) {
        throw new Error("Erro ao gerar link de pagamento.");
      }

      return { url: checkoutSession.url };
    } catch (error) {
      console.error("Erro ao criar sessão de checkout:", error);
      return returnValidationErrors(inputSchema, {
        _errors: [`Erro ao criar sessão de checkout. ${error}`],
      });
    }
  });

//  You may only specify one of these parameters: customer, customer_email

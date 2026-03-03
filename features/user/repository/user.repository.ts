"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  imageUrl?: string | null;
  role?: string | null;
  stripeCustomerId?: string | null;
  barberId?: string | null;
  subscription?: SubscriptionInfo;
}
/**
 * Verifica a sessão do usuário e retorna as informações do usuário e do barbeiro (se aplicável).
 * @returns Um objeto contendo as informações do usuário e do barbeiro, ou null se não houver sessão válida.
 * @throws {Error} Se ocorrer um erro ao verificar a sessão ou acessar o banco de dados.
 */
export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const subscrtiption = await isSubscriber(session.user.id);

  const barber = await prisma.barber.findUnique({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
    },
  });

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    imageUrl: session.user.image,
    role: session.user.role,
    stripeCustomerId: session.user.stripeCustomerId,
    barberId: session.user.role === "BARBER" ? barber?.id : null,
    subscription: subscrtiption,
  };
});

export type SubscriptionInfo = {
  hasPlan: boolean;
  name: string | null;
  validUntil?: string | null;
};

const PLAN: SubscriptionInfo = {
  hasPlan: false,
  name: null,
  validUntil: null,
};

/**
 * Obtém as informações da assinatura atual do usuário.
 * @returns Um objeto contendo as informações da assinatura do usuário, ou um objeto padrão indicando que o usuário não tem um plano.
 * @throws {Error} Se ocorrer um erro ao verificar a sessão ou acessar o banco de dados.
 */
export const getCurrentSubscription = cache(async () => {
  const session = await verifySession();

  if (!session) {
    return PLAN;
  }

  return isSubscriber(session.id);
});

export const isSubscriber = cache(
  async (userId: string | undefined): Promise<SubscriptionInfo> => {
    if (!userId) {
      return PLAN;
    }
    const sub = await prisma.subscription.findUnique({
      where: {
        userId,
      },
      select: {
        periodEnd: true,
        plan: {
          select: {
            name: true,
          },
        },
      },
    });

    return sub?.plan
      ? {
          hasPlan: sub.plan.name !== "FREE",
          name: sub.plan.name,
          validUntil: sub.periodEnd?.toISOString() || null,
        }
      : PLAN;
  },
);

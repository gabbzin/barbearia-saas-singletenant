"use server";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const verifySession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    imageUrl: session.user.image,
    role: session.user.role,
    stripeCustomerId: session.user.stripeCustomerId,
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

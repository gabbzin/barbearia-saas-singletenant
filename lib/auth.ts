import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendRecoveryEmail } from "./resend/sendRecoveryEmail";
import { sendVerificationEmail } from "./resend/sendVerifyEmail";
import { stripeClient } from "./stripe-client";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, token }) => {
      sendRecoveryEmail({
        to: [user.email],
        token,
        userName: user.name,
      });
    },
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async user => {
          try {
            const plan = await prisma.plan.findFirstOrThrow({
              where: {
                name: "FREE",
              },
            });

            await prisma.subscription.upsert({
              where: { userId: user.id },
              create: {
                userId: user.id,
                planId: plan.id,
                status: "ACTIVE",
                periodStart: new Date(),
                periodEnd: null,
              },
              update: {},
            });
          } catch (error) {
            console.error("Erro ao criar subscription no hook:", error);
          }
        },
      },
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, token }) => {
      await sendVerificationEmail({
        to: [user.email],
        token,
        userName: user.name,
      });
    },
    expiresIn: 60 * 15, // 15 minutes
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
      },
      stripeCustomerId: {
        type: "string",
        required: false,
      },
      barberId: {
        type: "string",
        required: false,
      },
    },
    fields: {},
  },

  plugins: [
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET as string,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: [
          {
            name: "FREE",
            priceId: "",
          },
          {
            name: "Corte ilimitado",
            priceId: "price_1Sf3aPLZmTtv3cllAd2ewhDQ",
          },
          {
            name: "Barba ilimitada",
            priceId: "price_1SfJCWLZmTtv3cllEvJ1kLV8",
          },
          {
            name: "Corte + Barba ilimitados",
            priceId: "price_1SfJCmLZmTtv3cllXAzpWq1a",
          },
        ],
      },
    }),
  ],
});

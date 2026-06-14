import type { Barber, BarberBreak, Disponibility, SocialMedia } from "@prisma/client";
import { builder } from "../builder";
import { ServiceRef } from "./service";
import { UserRef } from "./user";

const DisponibilityRef = builder.objectRef<Disponibility>("Disponibility");
DisponibilityRef.implement({
  fields: (t) => ({
    id: t.exposeString("id"),
    dayOfWeek: t.exposeInt("dayOfWeek"),
    startTime: t.expose("startTime", { type: "DateTime" }),
    endTime: t.expose("endTime", { type: "DateTime" }),
  }),
});

const BarberBreakRef = builder.objectRef<BarberBreak>("BarberBreak");
BarberBreakRef.implement({
  fields: (t) => ({
    id: t.exposeString("id"),
    dayOfWeek: t.exposeInt("dayOfWeek"),
    startTime: t.expose("startTime", { type: "DateTime" }),
    endTime: t.expose("endTime", { type: "DateTime" }),
    motivo: t.exposeString("motivo", { nullable: true }),
  }),
});

const SocialMediaRef = builder.objectRef<SocialMedia>("SocialMedia");
SocialMediaRef.implement({
  fields: (t) => ({
    id: t.exposeString("id"),
    platform: t.exposeString("platform"),
    url: t.exposeString("url"),
  }),
});

export const BarberRef = builder.objectRef<Barber>("Barber");
BarberRef.implement({
  fields: (t) => ({
    id: t.exposeString("id"),
    phone: t.exposeString("phone"),
    user: t.field({
      type: UserRef,
      nullable: true,
      resolve: (parent, _, ctx) =>
        parent.userId
          ? ctx.prisma.user.findUnique({ where: { id: parent.userId } })
          : null,
    }),
    services: t.field({
      type: [ServiceRef],
      resolve: (parent, _, ctx) =>
        ctx.prisma.barberService.findMany({ where: { barberId: parent.id } }),
    }),
    disponibility: t.field({
      type: [DisponibilityRef],
      resolve: (parent, _, ctx) =>
        ctx.prisma.disponibility.findMany({
          where: { barberId: parent.id },
          orderBy: { dayOfWeek: "asc" },
        }),
    }),
    breaks: t.field({
      type: [BarberBreakRef],
      resolve: (parent, _, ctx) =>
        ctx.prisma.barberBreak.findMany({
          where: { barberId: parent.id },
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        }),
    }),
    socialMedia: t.field({
      type: [SocialMediaRef],
      resolve: (parent, _, ctx) =>
        ctx.prisma.socialMedia.findMany({ where: { barberId: parent.id } }),
    }),
    averageRating: t.float({
      nullable: true,
      resolve: async (parent, _, ctx) => {
        const result = await ctx.prisma.rating.aggregate({
          where: { barberId: parent.id },
          _avg: { ratingValue: true },
        });
        return result._avg.ratingValue;
      },
    }),
    totalRatings: t.int({
      resolve: (parent, _, ctx) =>
        ctx.prisma.rating.count({ where: { barberId: parent.id } }),
    }),
  }),
});

builder.queryField("barbers", (t) =>
  t.field({
    type: [BarberRef],
    description: "Lista todos os barbeiros",
    resolve: (_, __, ctx) => ctx.prisma.barber.findMany(),
  })
);

builder.queryField("barber", (t) =>
  t.field({
    type: BarberRef,
    nullable: true,
    description: "Busca um barbeiro pelo ID",
    args: { id: t.arg.string({ required: true }) },
    resolve: (_, { id }, ctx) =>
      ctx.prisma.barber.findUnique({ where: { id } }),
  })
);

import { GraphQLError } from "graphql";
import type { Booking } from "@prisma/client";
import { builder } from "../builder";
import { BarberRef } from "./barber";
import { ServiceRef } from "./service";
import { UserRef } from "./user";
import {
  InvalidServicesError,
  getAvailableTimeSlotsService,
} from "../services/available-time-slots.service";

export const BookingStatusEnum = builder.enumType("BookingStatus", {
  values: {
    SCHEDULED: { value: "SCHEDULED" as const },
    COMPLETED: { value: "COMPLETED" as const },
    CANCELLED: { value: "CANCELLED" as const },
  },
});

export const BookingRef = builder.objectRef<Booking>("Booking");

BookingRef.implement({
  fields: (t) => ({
    id: t.exposeString("id"),
    date: t.expose("date", { type: "DateTime" }),
    status: t.exposeString("status"),
    priceInCents: t.exposeInt("priceInCents"),
    customerName: t.exposeString("customerName", { nullable: true }),
    customerPhone: t.exposeString("customerPhone", { nullable: true }),
    paymentMethod: t.exposeString("paymentMethod", { nullable: true }),
    paidWithSubscription: t.exposeBoolean("paidWithSubscription"),
    cancelledAt: t.expose("cancelledAt", { type: "DateTime", nullable: true }),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
    barber: t.field({
      type: BarberRef,
      resolve: (parent, _, ctx) =>
        ctx.prisma.barber.findUniqueOrThrow({ where: { id: parent.barberId } }),
    }),
    user: t.field({
      type: UserRef,
      resolve: (parent, _, ctx) =>
        ctx.prisma.user.findUniqueOrThrow({ where: { id: parent.userId } }),
    }),
    services: t.field({
      type: [ServiceRef],
      resolve: (parent, _, ctx) =>
        ctx.prisma.barberService.findMany({
          where: { bookings: { some: { id: parent.id } } },
        }),
    }),
    hasRating: t.boolean({
      resolve: async (parent, _, ctx) => {
        const count = await ctx.prisma.rating.count({
          where: { bookingId: parent.id },
        });
        return count > 0;
      },
    }),
  }),
});

const CreateBookingInput = builder.inputType("CreateBookingInput", {
  fields: (t) => ({
    barberId: t.string({ required: true }),
    serviceIds: t.stringList({ required: true }),
    date: t.field({ type: "DateTime", required: true }),
    customerName: t.string({ required: false }),
    customerPhone: t.string({ required: false }),
    paymentMethod: t.string({ required: false }),
  }),
});

builder.queryField("availableTimeSlots", (t) =>
  t.field({
    type: ["String"],
    description: "Horários disponíveis para agendamento em uma data",
    args: {
      barberId: t.arg.string({ required: true }),
      serviceIds: t.arg.stringList({ required: true }),
      date: t.arg({ type: "DateTime", required: true }),
    },
    resolve: async (_, { barberId, serviceIds, date }, ctx) => {
      if (!ctx.userId)
        throw new GraphQLError("Não autenticado", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      try {
        return await getAvailableTimeSlotsService({ barberId, serviceIds, date });
      } catch (err) {
        if (err instanceof InvalidServicesError)
          throw new GraphQLError(err.message, {
            extensions: { code: "BAD_USER_INPUT" },
          });
        throw err;
      }
    },
  })
);

builder.queryField("myBookings", (t) =>
  t.field({
    type: [BookingRef],
    description: "Agendamentos do usuário autenticado",
    resolve: (_, __, ctx) => {
      if (!ctx.userId)
        throw new GraphQLError("Não autenticado", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      return ctx.prisma.booking.findMany({
        where: { userId: ctx.userId },
        orderBy: { date: "desc" },
      });
    },
  })
);

builder.mutationField("createBooking", (t) =>
  t.field({
    type: BookingRef,
    description: "Cria um novo agendamento",
    args: { input: t.arg({ type: CreateBookingInput, required: true }) },
    resolve: async (_, { input }, ctx) => {
      if (!ctx.userId)
        throw new GraphQLError("Não autenticado", {
          extensions: { code: "UNAUTHENTICATED" },
        });

      const services = await ctx.prisma.barberService.findMany({
        where: { id: { in: input.serviceIds }, barberId: input.barberId },
      });

      if (services.length !== input.serviceIds.length) {
        throw new GraphQLError("Um ou mais serviços são inválidos");
      }

      const totalPrice = services.reduce((sum: number, s) => sum + s.priceInCents, 0);

      return ctx.prisma.booking.create({
        data: {
          barberId: input.barberId,
          userId: ctx.userId,
          date: input.date,
          priceInCents: totalPrice,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          paymentMethod: input.paymentMethod ?? "CASH",
          status: "SCHEDULED",
          services: {
            connect: input.serviceIds.map((id) => ({ id })),
          },
        },
      });
    },
  })
);

builder.mutationField("cancelBooking", (t) =>
  t.field({
    type: BookingRef,
    description: "Cancela um agendamento",
    args: { id: t.arg.string({ required: true }) },
    resolve: async (_, { id }, ctx) => {
      if (!ctx.userId)
        throw new GraphQLError("Não autenticado", {
          extensions: { code: "UNAUTHENTICATED" },
        });

      const booking = await ctx.prisma.booking.findUniqueOrThrow({ where: { id } });

      const isOwner = booking.userId === ctx.userId;
      const isPrivileged = ctx.userRole === "ADMIN" || ctx.userRole === "BARBER";

      if (!isOwner && !isPrivileged) {
        throw new GraphQLError("Sem permissão para cancelar este agendamento", {
          extensions: { code: "FORBIDDEN" },
        });
      }

      if (booking.status === "CANCELLED") {
        throw new GraphQLError("Agendamento já foi cancelado");
      }

      return ctx.prisma.booking.update({
        where: { id },
        data: { status: "CANCELLED", cancelledAt: new Date() },
      });
    },
  })
);

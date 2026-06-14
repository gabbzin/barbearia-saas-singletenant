import type { BarberService } from "@prisma/client";
import { builder } from "../builder";

export const ServiceRef = builder.objectRef<BarberService>("BarberService");

ServiceRef.implement({
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    description: t.exposeString("description"),
    imageUrl: t.exposeString("imageUrl"),
    priceInCents: t.exposeInt("priceInCents"),
    durationInMinutes: t.exposeInt("durationInMinutes"),
    hasStartingPrice: t.exposeBoolean("hasStartingPrice", { nullable: true }),
    barberId: t.exposeString("barberId"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
  }),
});

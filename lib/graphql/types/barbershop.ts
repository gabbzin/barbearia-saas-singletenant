import type { Barbershop } from "@prisma/client";
import { builder } from "../builder";

const BarbershopRef = builder.objectRef<Barbershop>("Barbershop");

BarbershopRef.implement({
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    address: t.exposeString("address"),
    imageUrl: t.exposeString("imageUrl"),
    storageUrl: t.exposeString("storageUrl"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
  }),
});

builder.queryField("barbershop", (t) =>
  t.field({
    type: BarbershopRef,
    nullable: true,
    description: "Informações da barbearia",
    resolve: (_, __, ctx) =>
      ctx.prisma.barbershop.findUnique({ where: { id: "default" } }),
  })
);

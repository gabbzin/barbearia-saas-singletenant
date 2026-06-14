import type { User } from "@prisma/client";
import { builder } from "../builder";

export const UserRoleEnum = builder.enumType("UserRole", {
  values: {
    USER: { value: "USER" as const },
    ADMIN: { value: "ADMIN" as const },
    BARBER: { value: "BARBER" as const },
  },
});

export const UserRef = builder.objectRef<User>("User");

UserRef.implement({
  fields: (t) => ({
    id: t.exposeString("id"),
    name: t.exposeString("name"),
    email: t.exposeString("email"),
    image: t.exposeString("image", { nullable: true }),
    role: t.exposeString("role"),
    createdAt: t.expose("createdAt", { type: "DateTime" }),
  }),
});

builder.queryField("me", (t) =>
  t.field({
    type: UserRef,
    nullable: true,
    description: "Usuário autenticado",
    resolve: (_, __, ctx) => {
      if (!ctx.userId) return null;
      return ctx.prisma.user.findUnique({ where: { id: ctx.userId } });
    },
  })
);

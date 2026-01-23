"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { actionClient } from "@/lib/actionClient";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Schema de validação para criar um barbeiro
const createBarberSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export const createBarber = actionClient
  .schema(createBarberSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    const user = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        role: "BARBER", // Define a role como BARBER
      },
      headers: await headers(),
    });

    if (!user) {
      throw new Error(
        "Erro ao criar usuário. Verifique se o email já está em uso.",
      );
    }

    try {
      // Cria o barbeiro e já define a disponibilidade padrão (Segunda a Sexta, 09:00 - 18:00)
      const barber = await prisma.barber.create({
        data: {
          userId: user.user.id,
          disponibility: {
            createMany: {
              data: [1, 2, 3, 4, 5].map(day => ({
                dayOfWeek: day,
                startTime: "09:00",
                endTime: "18:00",
              })),
            },
          },
        },
      });

      revalidatePath("/painel");
      return { success: true, barberId: barber.id };
    } catch (error) {
      console.error("Erro ao criar perfil do barbeiro:", error);
      throw new Error("Usuário criado, mas falha ao criar perfil de barbeiro.");
    }
  });

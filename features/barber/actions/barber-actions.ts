"use server";

import type { TimesSchemaData } from "@/features/booking/schema/timesSchema";
import { prisma } from "@/lib/prisma";

// Aqui vão as ações dos serviços do barbeiro

export async function getSettingsByBarberId({
  barberId,
}: {
  barberId: string;
}) {
  try {
    const disponibilities = await prisma.disponibility.findMany({
      where: {
        barberId: barberId,
      },
    });

    if (!disponibilities || disponibilities.length === 0) {
      return null;
    }

    // Como o front-end espera um array de dias e um horário único,
    // reconstruímos esse objeto a partir dos registros do banco.
    // Assumimos que, se editado via UI atual, o horário é igual para todos.
    return {
      barberId,
      // daysOfWeek: disponibilities.map(d => d.daysOfWeek),
      startTime: disponibilities[0].startTime,
      endTime: disponibilities[0].endTime,
    };
  } catch (error) {
    console.error("Erro no Prisma:", error);
    throw new Error("Não foi possível buscar as configurações.");
  }
}

export async function createDisponibility(
  data: TimesSchemaData,
  barberId: string,
) {
  const selectedDates: number[] = [];

  for (let i = 0; i <= 6; i++) {
    if (data[i.toString() as "0" | "1" | "2" | "3" | "4" | "5" | "6"]) {
      selectedDates.push(i);
    }
  }

  const startTime = data.horario_abertura;
  const endTime = data.horario_fechamento;

  // Usamos transaction para garantir que limpamos os antigos e criamos os novos
  await prisma.$transaction(async tx => {
    // 1. Remove disponibilidade anterior desse barbeiro
    await tx.disponibility.deleteMany({
      where: {
        barberId: barberId,
      },
    });

    // 2. Cria novas entradas para cada dia selecionado
    if (selectedDates.length > 0) {
      await tx.disponibility.createMany({
        data: selectedDates.map(day => ({
          barberId: barberId,
          dayOfWeek: day,
          startTime: startTime,
          endTime: endTime,
        })),
      });
    }
  });

  // Retornamos o formato esperado pelo front-end para atualizar o cache
  return {
    daysOfWeek: selectedDates,
    startTime: startTime,
    endTime: endTime,
    barberId: barberId,
  };
}

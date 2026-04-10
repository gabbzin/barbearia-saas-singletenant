import { z } from "zod";

export const timesSchema = z
  .object({
    day: z
      .number()
      .min(0)
      .max(6, "O dia deve ser entre 0 (Domingo) e 6 (Sábado)"),
    // Validação de horário no formato "HH:mm"
    horario_abertura: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Use o formato HH:mm (ex: 09:00)",
    }),
    horario_fechamento: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Use o formato HH:mm (ex: 18:00)",
    }),
  })
  .refine(
    data => {
      // Validação extra: Fechamento deve ser depois da Abertura
      const [hAbertura, mAbertura] = data.horario_abertura
        .split(":")
        .map(Number);
      const [hFechamento, mFechamento] = data.horario_fechamento
        .split(":")
        .map(Number);

      const totalMinutosAbertura = hAbertura * 60 + mAbertura;
      const totalMinutosFechamento = hFechamento * 60 + mFechamento;

      return totalMinutosFechamento > totalMinutosAbertura;
    },
    {
      message: "O horário de fechamento deve ser após o horário de abertura",
      path: ["horario_fechamento"], // O erro aparecerá no campo de fechamento
    },
  );

// Tipo exportado para usar no seu componente/form se precisar
export type TimesSchemaData = z.infer<typeof timesSchema>;

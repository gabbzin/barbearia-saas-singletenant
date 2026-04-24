import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const exceptionDateFormSchema = z
  .object({
    date: z.date({ message: "Selecione uma data" }),
    isClosedFullTime: z.boolean().default(false),
    motivo: z
      .string()
      .max(255)
      .optional()
      .transform(value => {
        const trimmedValue = value?.trim();
        return trimmedValue ? trimmedValue : undefined;
      }),
    startTime: z
      .string()
      .optional()
      .refine(
        value => value === undefined || value === "" || timeRegex.test(value),
        {
          message: "Use o formato HH:mm (ex: 09:00)",
        },
      )
      .transform(value => (value === "" ? undefined : value)),
    endTime: z
      .string()
      .optional()
      .refine(
        value => value === undefined || value === "" || timeRegex.test(value),
        {
          message: "Use o formato HH:mm (ex: 18:00)",
        },
      )
      .transform(value => (value === "" ? undefined : value)),
  })
  .superRefine((data, ctx) => {
    if (data.isClosedFullTime) {
      return;
    }

    if (!data.startTime || !data.endTime) {
      return;
    }

    const [startHour, startMinute] = data.startTime.split(":").map(Number);
    const [endHour, endMinute] = data.endTime.split(":").map(Number);

    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;

    if (endTotalMinutes <= startTotalMinutes) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "O horário de término deve ser após o horário de início",
        path: ["endTime"],
      });
    }
  });

export type ExceptionDateFormSchemaType = z.infer<
  typeof exceptionDateFormSchema
>;

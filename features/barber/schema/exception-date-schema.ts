import { z } from "zod";

export const exceptionDateFormSchema = z
  .object({
    date: z.date({ message: "Selecione uma data" }),
    isClosedFullTime: z.boolean().default(false),
    motivo: z.preprocess(
      value => (typeof value === "string" && value.trim() === "" ? undefined : value),
      z.string().max(255).optional(),
    ),
    startTime: z.preprocess(
      value => (value === "" ? undefined : value),
      z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .optional(),
    ),
    endTime: z.preprocess(
      value => (value === "" ? undefined : value),
      z
        .string()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)$/)
        .optional(),
    ),
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

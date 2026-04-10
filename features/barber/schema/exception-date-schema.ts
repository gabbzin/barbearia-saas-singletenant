import { z } from "zod";

export const exceptionDateFormSchema = z
  .object({
    date: z.date({ message: "Selecione uma data" }),
    isClosedFullTime: z.boolean().default(false),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Use o formato HH:mm (ex: 09:00)",
      })
      .optional(),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
        message: "Use o formato HH:mm (ex: 18:00)",
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isClosedFullTime) {
      return;
    }

    if (
      !data.startTime ||
      !/^([01]\d|2[0-3]):([0-5]\d)$/.test(data.startTime)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use o formato HH:mm (ex: 09:00)",
        path: ["startTime"],
      });
    }

    if (!data.endTime || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(data.endTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use o formato HH:mm (ex: 18:00)",
        path: ["endTime"],
      });
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

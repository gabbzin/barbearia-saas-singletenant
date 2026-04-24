import { z } from "zod";

export const barberBreakFormSchema = z
  .object({
    dayOfWeek: z.enum(["0", "1", "2", "3", "4", "5", "6"]),
    startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Use o formato HH:mm (ex: 09:00)",
    }),
    endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Use o formato HH:mm (ex: 18:00)",
    }),
    motivo: z
      .string()
      .max(255)
      .optional()
      .transform(value => {
        const trimmedValue = value?.trim();
        return trimmedValue ? trimmedValue : undefined;
      }),
  })
  .refine(
    data => {
      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);

      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;

      return endTotalMinutes > startTotalMinutes;
    },
    {
      message: "O horário de término deve ser após o horário de início",
      path: ["endTime"],
    },
  );

export type BarberBreakFormSchemaType = z.infer<typeof barberBreakFormSchema>;

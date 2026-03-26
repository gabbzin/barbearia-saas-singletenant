import z from "zod";

export const serviceSchema = z.object({
  name: z
    .string("O nome do serviço é obrigatório")
    .min(2, "O nome do serviço deve ter no mínimo 2 caracteres"),
  price: z
    .number({ error: "O preço do serviço é obrigatório" })
    .min(0, "Preço inválido"),
  description: z
    .string("Descrição é obrigatória")
    .min(5, "A descrição deve ter no mínimo 5 caracteres"),
  durationInMinutes: z
    .coerce.number({ error: "A duração do serviço é obrigatória" })
    .min(1, "A duração deve ser de no mínimo 1 minuto"),
  imageUrl: z.url("URL da imagem inválida").optional().or(z.literal("")),
});

export type serviceSchemaType = z.infer<typeof serviceSchema>;

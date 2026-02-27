import z from "zod";

// ---------------------------------REGEX----------------------------------------

const onlyLettersRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/;
const onlyLettersRegexPhrase = "O campo deve conter apenas letras";

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/;
const passwordRegexPhrase =
  "A senha deve conter ao menos uma letra maiúscula, um número e um caracter especial";

// -------------------------------------------------------------------------

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  senha: z
    .string("Senha inválida")
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .regex(passwordRegex, passwordRegexPhrase),
});

export type loginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  nome: z
    .string("Nome inválido")
    .regex(onlyLettersRegex, onlyLettersRegexPhrase)
    .min(2, "O nome deve ter no mínimo 2 caracteres"),
  email: z.email("Email inválido"),
  senha: z
    .string("Senha inválida")
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .regex(passwordRegex, passwordRegexPhrase),
});

export type registerSchemaType = z.infer<typeof registerSchema>;

export const recoverPasswordSchema = z
  .object({
    senha: z
      .string("Senha inválida")
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(passwordRegex, passwordRegexPhrase),
    confirmarSenha: z.string("Confirmação de senha inválida"),
  })
  .refine(data => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export type recoverPasswordSchemaType = z.infer<typeof recoverPasswordSchema>;

export const editProfileSchema = z.object({
  name: z
    .string("Nome inválido")
    .regex(onlyLettersRegex, onlyLettersRegexPhrase)
    .min(2, "O nome deve ter no mínimo 2 caracteres"),
});

export type editProfileSchemaType = z.infer<typeof editProfileSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string("Senha atual inválida")
      .min(8, "A senha deve ter no mínimo 8 caracteres"),
    newPassword: z
      .string("Nova senha inválida")
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .regex(passwordRegex, passwordRegexPhrase),
    confirmNewPassword: z.string("Confirmação de senha inválida"),
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "As senhas não coincidem",
    path: ["confirmNewPassword"],
  });

export type changePasswordSchemaType = z.infer<typeof changePasswordSchema>;

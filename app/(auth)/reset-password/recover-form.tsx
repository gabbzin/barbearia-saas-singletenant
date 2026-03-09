"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  recoverPasswordSchema,
  type recoverPasswordSchemaType,
} from "@/features/user/schema/userSchema";
import { authClient } from "@/lib/auth-client";
import GenericForm from "@/shared/components/form/generic-form";
import InputForm from "@/shared/components/form/input-form";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { PasswordStrength } from "./passwordStrength";

export default function RecoverPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  if (!token) {
    return (
      <Card className="w-full max-w-md space-y-2">
        <CardHeader className="text-center font-bold text-2xl">
          Recuperar senha
        </CardHeader>
        <CardContent className="px-8">
          <p className="text-center">
            Token de recuperação inválido ou ausente.
          </p>
          <div className="mt-4 text-center">
            <Button variant={"destructive"} type="button" asChild>
              <Link href={"/login"}>Voltar</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRecoverPassword = async (data: recoverPasswordSchemaType) => {
    const res = await authClient.resetPassword({
      newPassword: data.senha,
      token,
    });

    if (res.error) {
      toast.error(
        res.error.message || "Erro ao recuperar a senha. Tente novamente.",
      );
    }

    toast.success("Senha recuperada com sucesso!");
    window.location.href = "/login";
  };

  return (
    <Card className="w-full max-w-md space-y-2">
      <CardHeader className="text-center font-bold text-2xl">
        Recuperar senha
      </CardHeader>
      <CardContent className="px-8">
        <GenericForm
          schema={recoverPasswordSchema}
          onSubmit={handleRecoverPassword}
          submitText="Criar nova senha"
          buttons={
            <Button variant={"destructive"} type="button" asChild>
              <Link href={"/login"}>Voltar</Link>
            </Button>
          }
        >
          <InputForm
            name="senha"
            label="Nova senha"
            type="password"
            placeholder="Digite sua nova senha"
          />
          <InputForm
            name="confirmarSenha"
            label="Confirmar nova senha"
            type="password"
            placeholder="Digite sua nova senha"
          />
          <PasswordStrength fieldName="senha" />
        </GenericForm>
      </CardContent>
    </Card>
  );
}

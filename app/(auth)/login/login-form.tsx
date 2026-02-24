"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  loginSchema,
  type loginSchemaType,
} from "@/features/user/schema/userSchema";
import { authClient } from "@/lib/auth-client";
import GenericForm from "@/shared/components/form/generic-form";
import InputForm from "@/shared/components/form/input-form";
import { GoogleButton } from "@/shared/components/google-button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = async (data: loginSchemaType) => {
    try {
      const user = await authClient.signIn.email({
        email: data.email,
        password: data.senha,
      });

      if (user.error) {
        throw new Error(user.error.message);
      }

      router.refresh();
      router.push("/client");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao fazer login. Tente novamente.",
      );
    }
  };

  return (
    <Card className="w-full max-w-md space-y-2">
      <CardHeader className="text-center font-bold text-3xl">
        Fazer login
      </CardHeader>
      <CardContent className="px-8">
        <GenericForm
          schema={loginSchema}
          onSubmit={handleLogin}
          submitText="Logar conta"
          buttons={<GoogleButton />}
        >
          <InputForm
            name="email"
            label="Email"
            type="email"
            placeholder="Digite seu email"
          />
          <div className="relative">
            <InputForm
              name="senha"
              label="Senha"
              type="password"
              placeholder="Digite sua senha"
            />
            {/* <ForgotPasswordButton /> */}
          </div>
        </GenericForm>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="w-4/6 text-center">Ainda não possui conta? </p>
        <Link href={"/register"} className="text-blue-500">
          Crie uma agora.
        </Link>
      </CardFooter>
    </Card>
  );
}

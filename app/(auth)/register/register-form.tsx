"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  registerSchema,
  type registerSchemaType,
} from "@/features/user/schema/userSchema";
import { authClient } from "@/lib/auth-client";
import GenericForm from "@/shared/components/form/generic-form";
import InputForm from "@/shared/components/form/input-form";
import { GoogleButton } from "@/shared/components/google-button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { PasswordStrength } from "../reset-password/passwordStrength";

const RegisterForm = () => {
  const { push } = useRouter();
  // const [emailSend, setEmailSend] = useState(false);

  const handleRegister = async (data: registerSchemaType) => {
    try {
      await authClient.signUp.email({
        name: data.nome,
        email: data.email,
        password: data.senha,
      });

      toast.success("Conta criada com sucesso! Redirecionando...");
      // setEmailSend(true);
      return push("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao criar conta. Tente novamente.",
      );
    }
  };

  // if (emailSend) {
  //   return (
  //     <Card className="w-full max-w-md">
  //       <CardHeader className="text-center font-bold text-3xl">
  //         Verifique seu email
  //       </CardHeader>
  //       <CardContent className="px-8">
  //         <p>
  //           Um email de verificação foi enviado para o endereço fornecido
  //           durante o cadastro. Por favor, verifique sua caixa de entrada e
  //           siga as instruções para ativar sua conta.
  //         </p>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center font-bold text-3xl">
        Criar conta
      </CardHeader>
      <CardContent className="px-8">
        <GenericForm<registerSchemaType>
          schema={registerSchema}
          onSubmit={handleRegister}
          submitText="Criar conta"
          buttons={<GoogleButton />}
        >
          <InputForm
            name="nome"
            label="Nome"
            type="text"
            placeholder="Digite seu nome"
          />
          <InputForm
            name="email"
            label="Email"
            type="email"
            placeholder="Digite seu email"
          />
          <InputForm
            name="senha"
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
          />
          <PasswordStrength fieldName="senha" />
        </GenericForm>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;

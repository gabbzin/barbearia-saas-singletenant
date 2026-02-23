import { Button, Heading, Text } from "@react-email/components";
import { baseUrl } from "@/lib/consts";
import { TemplateEmailBody } from "./components/body-email";
import { button, heading, paragraph } from "./styles/style";

interface VerifyAccountEmailProps {
  userName?: string;
  token: string;
  barbershopName?: string;
}

export default function VerifyAccountEmail({
  userName,
  token,
  barbershopName = "",
}: VerifyAccountEmailProps) {
  return (
    <TemplateEmailBody barbershopName={barbershopName}>
      <Heading as="h1" style={heading}>
        Verificar Email
      </Heading>

      <Text style={paragraph}>
        Olá {userName ?? "usuário"}, obrigado por criar uma conta na{" "}
        {barbershopName}!
      </Text>
      <Text style={paragraph}>
        Para realizar a verificação do seu email, pedimos que você clique no
        link abaixo. Esse link é válido por 15 minutos. Se você não criou uma
        conta, por favor, ignore este email.
      </Text>

      <Button style={button} href={`${baseUrl}/verify-account?token=${token}`}>
        Verificar Email
      </Button>
    </TemplateEmailBody>
  );
}

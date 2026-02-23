import { Button, Heading, Text } from "@react-email/components";
import { baseUrl } from "@/lib/consts";
import { TemplateEmailBody } from "./components/body-email";
import { button, heading, paragraph } from "./styles/style";

interface TemplateEmailPageProps {
  barbershopName?: string;
  userName?: string;
  token: string;
}

export default function TemplateEmailRecoverPass({
  barbershopName = "",
  userName,
  token,
}: TemplateEmailPageProps) {
  return (
    <TemplateEmailBody barbershopName={barbershopName}>
      <Heading as="h1" style={heading}>
        Recuperar Senha
      </Heading>

      <Text style={paragraph}>
        Olá {userName ?? "Usuário"}, recebemos uma solicitação para recuperar a
        senha da sua conta.
      </Text>
      <Text style={paragraph}>
        Para realiza-lá, pedimos que você clique no link abaixo.
      </Text>

      <Button style={button} href={`${baseUrl}/reset-password?token=${token}`}>
        Redefinir Senha
      </Button>
    </TemplateEmailBody>
  );
}

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
} from "@react-email/components";
import { imagePaths } from "@/shared/constants/images";
import { box, container, hr, image, main } from "../styles/style";
import { FooterEmail } from "./footer";

interface TemplateEmailBodyProps {
  barbershopName: string;
  children: React.ReactNode;
}

export function TemplateEmailBody({
  barbershopName,
  children,
}: TemplateEmailBodyProps) {
  return (
    <Html>
      <Head />
      <Preview>Recuperar sua senha</Preview>

      <Body style={main}>
        <Container style={container}>
          <Img
            src={imagePaths.backgroundMail}
            alt="Head"
            width="600"
            style={image}
          />

          <Hr style={hr} />

          <Section style={box}>{children}</Section>

          <Hr style={hr} />

          <FooterEmail barbershopName={barbershopName} />
        </Container>
      </Body>
    </Html>
  );
}

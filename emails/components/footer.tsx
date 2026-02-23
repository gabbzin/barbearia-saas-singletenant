import { Img, Section, Text } from "@react-email/components";
import { baseUrlBlob } from "@/lib/consts";
import { footer, footerBox, footerText, image } from "../styles/style";

export function FooterEmail({ barbershopName = "" }) {
  const year = new Date().getFullYear();

  return (
    <Section style={footerBox}>
      <Img
        src={`${baseUrlBlob}/templates-assets/closed.png`}
        alt="closed"
        width="200"
        style={image}
      />

      <Text style={footerText}>
        © {year} {barbershopName}
      </Text>

      <Text style={footer}>Todos os direitos reservados.</Text>

      <Img
        src={`${baseUrlBlob}/templates-assets/divider_down.png`}
        alt="divider"
        width="600"
        style={image}
      />
    </Section>
  );
}

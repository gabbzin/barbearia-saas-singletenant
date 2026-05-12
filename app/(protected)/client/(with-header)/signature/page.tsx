import { featureSignatureActive } from "@/lib/consts";
import { SignatureComingSoon } from "@/shared/components/signature-coming-soon";
import { PageSection, PageSectionTitle } from "@/shared/components/ui/page";

export default async function SignaturePage() {

  if (!featureSignatureActive) {
    return <SignatureComingSoon />
  }

  return (
    <PageSection>
      <PageSectionTitle>Planos de Assinaturas</PageSectionTitle>
      
    </PageSection>
  );
}

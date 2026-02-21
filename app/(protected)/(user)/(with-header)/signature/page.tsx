import { getCurrentSubscription } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";
import ExpandableCardDemo from "@/shared/components/expandable-card";
import { PageSection, PageSectionTitle } from "@/shared/components/ui/page";

export default async function SignaturePage() {
  const plans = await prisma.plan.findMany({
    where: {
      NOT: {
        name: "FREE",
      },
    },
  });

  const myPlan = await getCurrentSubscription();

  return (
    <PageSection>
      <PageSectionTitle>Planos de Assinaturas</PageSectionTitle>
      <div className="p-2">
        <ExpandableCardDemo plans={plans} myPlan={myPlan} />
      </div>
    </PageSection>
  );
}

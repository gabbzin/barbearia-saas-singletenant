import dynamic from "next/dynamic";
import { getCurrentSubscription } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";
import { PageSection, PageSectionTitle } from "@/shared/components/ui/page";

const ExpandableCardDemo = dynamic(
  () => import("@/shared/components/expandable-card"),
  {
    ssr: false,
    loading: () => (
      <div className="h-96 w-full animate-pulse rounded-xl bg-muted" />
    ),
  },
);

export default async function SignaturePage() {
  const [plans, myPlan] = await Promise.all([
    prisma.plan.findMany({
      where: {
        NOT: {
          name: "FREE",
        },
      },
    }),
    getCurrentSubscription(),
  ]);

  return (
    <PageSection>
      <PageSectionTitle>Planos de Assinaturas</PageSectionTitle>
      <div className="p-2">
        <ExpandableCardDemo plans={plans} myPlan={myPlan} />
      </div>
    </PageSection>
  );
}

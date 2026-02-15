import SignatureItem from "@/features/signature/components/signature-item";
import { getCurrentSubscription } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";
import { Carousel, CarouselContent } from "@/shared/components/ui/carousel";
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
      <PageSectionTitle>Assinaturas</PageSectionTitle>
      <div className="p-2">
        <Carousel className="w-full">
          <CarouselContent>
            {plans.map(plan => {
              return (
                <SignatureItem
                  key={plan.id}
                  plan={plan}
                  myPlanName={myPlan.name}
                />
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>
    </PageSection>
  );
}

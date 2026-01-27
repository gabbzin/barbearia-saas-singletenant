import { getCurrentSubscription } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";
import Header from "@/shared/components/header";
import HeaderTitle from "@/shared/components/me/HeaderTitle";
import SignatureItem from "@/shared/components/signature/signature-item";
import { Carousel, CarouselContent } from "@/shared/components/ui/carousel";
import { PageContainer, PageSection } from "@/shared/components/ui/page";
import { Separator } from "@/shared/components/ui/separator";

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
    <>
      <Header />

      <Separator />

      <PageContainer>
        <HeaderTitle>Assinaturas</HeaderTitle>
        <PageSection>
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
      </PageContainer>
    </>
  );
}

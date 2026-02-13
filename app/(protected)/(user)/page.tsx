import { getBarbers } from "@/features/barber/services/barbers.repository";
import { NextBooking } from "@/features/booking/components/next-booking";
import { getNextBooking } from "@/features/booking/functions/get-bookings";
import { verifySession } from "@/features/user/repository/user.repository";
import BarberItem from "@/shared/components/barber-item";
import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "@/shared/components/ui/page";
import { getCurrentSubscriptionAction } from "../../../features/signature/actions/get-current-subscription";
import { ProfilePhoto } from "@/shared/components/profile-photo";
import { Card, CardContent } from "@/shared/components/ui/card";

export default async function Home() {
  const user = await verifySession();

  const barbers = await getBarbers();
  const plan = await getCurrentSubscriptionAction();
  const nextBooking = await getNextBooking(user?.id ?? "");

  return (
    <main className="flex min-h-screen flex-col justify-around">
      <Header />
      <PageContainer>
        <PageSection>
          <Card className="w-full">
            <CardContent className="flex items-center gap-4 px-4">
              <ProfilePhoto
                initial={user?.name?.charAt(0).toUpperCase() ?? ""}
                imageUrl={user?.imageUrl}
                size={12}
              />
              <div>
                <p className="font-semibold text-base">Olá, {user?.name}!</p>
                <p className="text-muted-foreground text-xs">
                  Bem-vindo de volta!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* <Alert variant={plan.hasPlan ? "success" : "info"} className="mt-4">
            <AlertTitle>
              {plan.hasPlan ? (
                <div className="flex items-center gap-3">
                  <CheckCircleIcon />
                  <div>
                    <p>Você está no plano {plan.name}</p>
                    <p className="text-muted-foreground">
                      Válido até{" "}
                      {plan.validUntil
                        ? format(plan.validUntil, "dd/MM/yyyy")
                        : "data desconhecida"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <InfoIcon />
                  Você não possui um plano ativo.
                </div>
              )}
            </AlertTitle>
          </Alert> */}
        </PageSection>

        <PageSection>
          <PageSectionTitle>Próximo agendamento</PageSectionTitle>
          <NextBooking nextBooking={nextBooking} />
        </PageSection>

        <PageSection>
          <PageSectionTitle>Barbeiros</PageSectionTitle>
          <PageSectionScroller>
            {barbers.map((barber) => (
              <BarberItem
                key={barber.id}
                barber={{
                  id: barber.id,
                  name: barber.user?.name ?? "Barbeiro",
                  imageUrl: barber.imageUrl,
                }}
              />
            ))}
          </PageSectionScroller>
        </PageSection>
      </PageContainer>
      <Footer />
    </main>
  );
}

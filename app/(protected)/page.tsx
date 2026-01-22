import { format } from "date-fns";
import { AlertTriangleIcon, CheckIcon } from "lucide-react";
import { getBarbers } from "@/features/barber/services/barbers.repository";
import { NextBooking } from "@/features/booking/components/next-booking";
import { getNextBooking } from "@/features/booking/functions/get-bookings";
import { verifySession } from "@/features/user/repository/user.repository";
import BarberItem from "@/shared/components/barber-item";
import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "@/shared/components/ui/page";
import { getCurrentSubscriptionAction } from "../../features/signature/actions/get-current-subscription";

const Home = async () => {
  const user = await verifySession();

  const barbers = await getBarbers();
  const plan = await getCurrentSubscriptionAction();
  const nextBooking = await getNextBooking(user?.id ?? "");

  // Ordenar no JavaScript após buscar os dados
  barbers.sort((a, b) => {
    const nameA = a.user?.name ?? "";
    const nameB = b.user?.name ?? "";
    return nameA.localeCompare(nameB);
  });
  return (
    <main className="flex min-h-screen flex-col justify-around">
      <Header />
      <PageContainer>
        <PageSection>
          <div className="flex items-center gap-2">
            <Avatar className="size-12">
              <AvatarImage
                src={user?.imageUrl ?? ""}
                alt={user?.name ?? "User Avatar"}
              />
            </Avatar>
            <div>
              <p className="font-semibold text-base">Olá, {user?.name}!</p>
              <p className="text-muted-foreground text-xs">
                Bem-vindo de volta!
              </p>
            </div>
          </div>

          <Alert>
            <AlertTitle>
              {plan.hasPlan ? (
                <div>
                  <CheckIcon />
                  Você está no plano {plan.name}, válido até
                  {plan.validUntil
                    ? format(plan.validUntil, "dd/MM/yyyy")
                    : "data desconhecida"}
                  `
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <AlertTriangleIcon />
                  Você não possui um plano ativo.
                </div>
              )}
            </AlertTitle>
          </Alert>
        </PageSection>

        <PageSection>
          <PageSectionTitle>Próximo agendamento</PageSectionTitle>
          <NextBooking nextBooking={nextBooking} />
        </PageSection>

        <PageSection>
          <PageSectionTitle>Barbeiros</PageSectionTitle>
          <PageSectionScroller>
            {barbers.map(barber => (
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
};

export default Home;

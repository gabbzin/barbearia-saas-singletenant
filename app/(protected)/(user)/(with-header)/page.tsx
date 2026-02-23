import BarberItem from "@/features/barber/components/barber-item";
import { getBarbers } from "@/features/barber/services/barbers.repository";
import { NextBooking } from "@/features/booking/components/next-booking";
import { getNextBooking } from "@/features/booking/functions/get-bookings";
import { SignatureCard } from "@/features/signature/components/signature-card";
import { verifySession } from "@/features/user/repository/user.repository";
import { ProfilePhoto } from "@/shared/components/profile-photo";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "@/shared/components/ui/page";
import { getCurrentSubscriptionAction } from "../../../../features/signature/actions/get-current-subscription";

export default async function Home() {
  const user = await verifySession();

  const barbers = await getBarbers();
  const plan = await getCurrentSubscriptionAction();
  const nextBooking = await getNextBooking(user?.id ?? "");

  return (
    <main className="flex flex-col gap-2">
      <PageSection>
        <Card className="w-full">
          <CardContent className="px-4">
            <div className="mb-4 flex items-center gap-4">
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
            </div>
            <SignatureCard
              hasPlan={plan?.hasPlan ?? false}
              name={plan?.name ?? undefined}
              validUntil={plan?.validUntil ?? undefined}
              className=""
            />
          </CardContent>
        </Card>
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
    </main>
  );
}

import { getBarbers } from "@/features/barber/services/barbers.repository";
import { NextBooking } from "@/features/booking/components/next-booking";
import { getNextBooking } from "@/features/booking/functions/get-bookings";
import { verifySession } from "@/features/user/repository/user.repository";
import BarberItem from "@/features/barber/components/barber-item";
import Footer from "@/shared/components/footer";
import Header from "@/shared/components/header";
import {
  PageContainer,
  PageSection,
  PageSectionScroller,
  PageSectionTitle,
} from "@/shared/components/ui/page";
import { getCurrentSubscriptionAction } from "../../../../features/signature/actions/get-current-subscription";
import { ProfilePhoto } from "@/shared/components/profile-photo";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { SignatureCard } from "@/features/signature/components/signature-card";

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
            <div className="flex items-center gap-4 mb-4">
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
    </main>
  );
}

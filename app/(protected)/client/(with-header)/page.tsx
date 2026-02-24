import BarberItem from "@/features/barber/components/barber-item";
import { getBarbers } from "@/features/barber/services/barbers.repository";
import { NextBooking } from "@/features/booking/components/next-booking";
import { getNextBooking } from "@/features/booking/functions/get-bookings";
import { SignatureCard } from "@/features/signature/components/signature-card";
import { verifySession } from "@/features/user/repository/user.repository";
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
        <SignatureCard
          hasPlan={plan?.hasPlan ?? false}
          name={plan?.name ?? undefined}
          validUntil={plan?.validUntil ?? undefined}
          className=""
        />
      </PageSection>

      <PageSection>
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

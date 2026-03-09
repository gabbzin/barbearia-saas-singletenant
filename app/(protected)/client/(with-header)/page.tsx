import Link from "next/link";
import BarberItem from "@/features/barber/components/barber-item";
import { getBarbers } from "@/features/barber/services/barbers.repository";
import { getHistory } from "@/features/booking/actions/get-history";
import { getLastBookingAction } from "@/features/booking/actions/get-last-booking-action";
import { getNextBookingAction } from "@/features/booking/actions/get-next-booking-action";
import { NextBooking } from "@/features/booking/components/next-booking";
import { RatingDialog } from "@/features/rating/components/rating-dialog";
import { ClientNavs } from "@/shared/components/client-navs";
import { HistoryList } from "@/shared/components/history-list";
import { Alert, AlertDescription, AlertTitle } from "@/shared/components/ui/alert";
import { PageSection, PageSectionTitle } from "@/shared/components/ui/page";
import { imagePaths } from "@/shared/constants/images";

export default async function Home() {
  const [barbers, history, nextBooking, lastBooking] = await Promise.all([
    getBarbers(),
    getHistory(),
    getNextBookingAction(),
    getLastBookingAction(),
  ]);

  return (
    <main className="flex flex-col gap-2">
      {/* Próximo agendamento */}
      <PageSection>
        <NextBooking
          nextBooking={nextBooking.data?.nextBooking ?? null}
          lastBookingDate={nextBooking.data?.lastDate ?? null}
        />
      </PageSection>

      <PageSection>
        <Alert>
          <AlertTitle>Planos de assinatura em desenvolvimento</AlertTitle>
          <AlertDescription>
            Em breve você poderá gerenciar um plano de assinatura exclusivo por aqui.
          </AlertDescription>
        </Alert>
      </PageSection>

      {/* Opcional (por enquanto) */}
      <PageSection>
        <ClientNavs />
      </PageSection>

      <PageSection>
        <PageSectionTitle>Nossos Profissionais</PageSectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {barbers.map(barber => (
            <BarberItem
              key={barber.id}
              barber={{
                id: barber.id,
                name: barber.user?.name ?? "Barbeiro",
                imageUrl: barber.user?.image ?? imagePaths.defaultAvatar,
              }}
            />
          ))}
        </div>
      </PageSection>

      <PageSection>
        <div className="flex items-center justify-between">
          <PageSectionTitle>Histórico Recente</PageSectionTitle>
          <Link
            href="/client/bookings"
            className="cursor-pointer text-muted-foreground text-sm hover:underline"
          >
            Ver completo {">"}
          </Link>
        </div>
        <HistoryList history={history} />
      </PageSection>

      <RatingDialog lastBooking={lastBooking.data ?? null} />
    </main>
  );
}

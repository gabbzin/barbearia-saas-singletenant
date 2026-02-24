import { format } from "date-fns";
import { ScissorsIcon } from "lucide-react";
import Link from "next/link";
import BarberItem from "@/features/barber/components/barber-item";
import { getBarbers } from "@/features/barber/services/barbers.repository";
import { NextBooking } from "@/features/booking/components/next-booking";
import { getNextBooking } from "@/features/booking/functions/get-bookings";
import { getCurrentSubscriptionAction } from "@/features/signature/actions/get-current-subscription";
import { SignatureCard } from "@/features/signature/components/signature-card";
import { verifySession } from "@/features/user/repository/user.repository";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/shared/components/ui/card";
import { PageSection, PageSectionTitle } from "@/shared/components/ui/page";

export default async function Home() {
  const user = await verifySession();

  const barbers = await getBarbers();
  const history = await prisma.booking.findMany({
    where: {
      userId: user?.id,
      date: {
        lte: new Date(),
      },
    },
    include: {
      service: {
        select: {
          name: true,
        },
      },
    },
  });
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
        <PageSectionTitle>Nossos Profissionais</PageSectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <div className="mt-4">
          {history.length > 0 ? (
            history.map(booking => (
              <Card key={booking.id} className="mb-2">
                <CardContent className="flex items-center gap-2">
                  <div
                    className={cn(
                      booking.status === "COMPLETED"
                        ? "bg-green-400 text-green-600"
                        : "bg-red-400 text-red-600",
                      "rounded-md p-2",
                    )}
                  >
                    <ScissorsIcon size={24} strokeWidth={2.5} />
                  </div>
                  <div className="items-centertext-sm">
                    <p className="font-bold">{booking.service.name}</p>
                    <p>{format(booking.date, "dd MMM yyyy 'às' HH:mm")}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="mb-2">
              <CardContent className="w-full">
                <p className="text-center text-muted-foreground">
                  Nenhum agendamento recente
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </PageSection>
    </main>
  );
}

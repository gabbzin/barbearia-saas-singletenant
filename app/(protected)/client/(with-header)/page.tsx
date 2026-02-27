import { format } from "date-fns";
import { History, Plus, ScissorsIcon, User } from "lucide-react";
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
import { Button } from "@/shared/components/ui/button";
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
        <div className="mb-10 grid grid-cols-4 gap-3">
          {[
            {
              icon: Plus,
              label: "Agendar",
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
            {
              icon: User,
              label: "Barbeiros",
              color: "text-blue-400",
              bg: "bg-blue-400/10",
            },
            {
              icon: History,
              label: "Histórico",
              color: "text-purple-400",
              bg: "bg-purple-400/10",
            },
          ].map((action, idx) => (
            <Button
              // biome-ignore lint/suspicious/noArrayIndexKey: <Relaxe>
              key={idx}
              variant={"secondary"}
              size="card"
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl p-4 backdrop-blur-2xl transition-all duration-300 hover:bg-primary/10"
            >
              <div
                className={`${action.bg} ${action.color} rounded-xl p-3 transition-transform group-hover:scale-110`}
              >
                <action.icon size={22} />
              </div>
              <span className="font-semibold text-xs sm:text-sm">
                {action.label}
              </span>
            </Button>
          ))}
        </div>
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
                imageUrl: barber.user?.image ?? "/default-avatar.png",
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

"use client";

import type { Barber, BarberService, Booking, User } from "@prisma/client";
import { useState } from "react";
import BookingItem from "@/features/booking/components/booking-item";
import { CancelBooking } from "@/features/booking/components/cancel-booking";
import { PageContainer, PageSection } from "@/shared/components/ui/page";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

interface BookingsClientProps {
  bookings: (Booking & {
    service: BarberService & {
      barber: Barber & {
        user: User | null;
      };
    };
  })[];
}

export type BookingClient = {
  id: string;
  date: Date;
  stripeChargeId?: string | null;
  service: {
    name: string;
    priceInCents: number;
  };
  barber: {
    name: string;
    imageUrl: string;
    phone: string[];
  };
};

export default function BookingsClient({ bookings }: BookingsClientProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingClient | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const now = new Date();

  if (!bookings || bookings.length === 0) {
    return (
      <PageContainer>
        <h1 className="font-bold text-xl">Agendamentos</h1>
        <PageSection>
          <p className="text-muted-foreground text-sm">
            Você não tem agendamentos.
          </p>
        </PageSection>
      </PageContainer>
    );
  }

  const confirmedBookings = bookings.filter(
    booking => booking.date > now && booking.status === "SCHEDULED",
  );

  const cancelledBookings = bookings.filter(
    booking => booking.status === "CANCELLED",
  );

  const finishedBookings = bookings.filter(
    booking => booking.date <= now && booking.status !== "CANCELLED",
  );

  const handleClickBooking = (booking: BookingClient) => {
    setSelectedBooking(booking);
    setIsSheetOpen(true);
  };

  return (
    <>
      <PageContainer>
        <h1 className="font-bold text-xl">Agendamentos</h1>
        <Tabs defaultValue="confirmed">
          <TabsList className="mb-4">
            <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
            <TabsTrigger value="finished">Finalizados</TabsTrigger>
          </TabsList>
          <TabsContent value="confirmed">
            <PageSection>
              {confirmedBookings.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Você não tem agendamentos confirmados.
                </p>
              ) : (
                confirmedBookings.map(booking => (
                  <BookingItem
                    key={booking.id}
                    serviceName={booking.service.name}
                    date={booking.date}
                    counterPart={{
                      name: booking.service.barber.user?.name ?? "Barbeiro",
                      imageUrl: booking.service.barber.imageUrl,
                    }}
                    onClick={() =>
                      handleClickBooking({
                        id: booking.id,
                        date: booking.date,
                        stripeChargeId: booking.stripeChargeId,
                        service: {
                          name: booking.service.name,
                          priceInCents: booking.service.priceInCents,
                        },
                        barber: {
                          name: booking.service.barber.user?.name ?? "Barbeiro",
                          imageUrl: booking.service.barber.imageUrl,
                          phone: booking.service.barber.phone,
                        },
                      })
                    }
                  />
                ))
              )}
            </PageSection>
          </TabsContent>
          <TabsContent value="cancelled">
            <PageSection>
              {cancelledBookings.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Você não tem agendamentos cancelados.
                </p>
              ) : (
                cancelledBookings.map(booking => (
                  <BookingItem
                    key={booking.id}
                    serviceName={booking.service.name}
                    date={booking.date}
                    counterPart={{
                      name: booking.service.barber.user?.name ?? "Barbeiro",
                      imageUrl: booking.service.barber.imageUrl,
                    }}
                  />
                ))
              )}
            </PageSection>
          </TabsContent>
          <TabsContent value="finished">
            <PageSection>
              {finishedBookings.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Você não tem agendamentos finalizados.
                </p>
              ) : (
                finishedBookings.map(booking => (
                  <BookingItem
                    key={booking.id}
                    serviceName={booking.service.name}
                    date={booking.date}
                    counterPart={{
                      name: booking.service.barber.user?.name ?? "Barbeiro",
                      imageUrl: booking.service.barber.imageUrl,
                    }}
                  />
                ))
              )}
            </PageSection>
          </TabsContent>
        </Tabs>
      </PageContainer>

      <CancelBooking
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        booking={selectedBooking}
      />
    </>
  );
}

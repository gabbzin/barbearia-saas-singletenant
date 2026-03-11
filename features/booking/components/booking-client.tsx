"use client";

import { useState } from "react";
import BookingItem from "@/features/booking/components/booking-item";
import { CancelBooking } from "@/features/booking/components/cancel-booking";
import { PageSection, PageSectionTitle } from "@/shared/components/ui/page";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { imagePaths } from "@/shared/constants/images";
import type { getBookingsClient } from "../functions/get-bookings";

interface BookingsClientProps {
  bookings: Awaited<ReturnType<typeof getBookingsClient>> | null;
}

export type BookingClient = {
  id: string;
  date: Date;
  stripeChargeId?: string | null;
  status: "SCHEDULED" | "PENDING" | "COMPLETED" | "CANCELLED";
  service: {
    name: string;
    priceInCents: number;
  };
  barber: {
    name: string;
    imageUrl: string;
    phone: string;
  };
};

export default function BookingsClient({ bookings }: BookingsClientProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingClient | null>(
    null,
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (!bookings || bookings.length === 0) {
    return (
      <PageSection>
        <PageSectionTitle>Agendamentos</PageSectionTitle>
        <div className="mt-4">
          <p className="text-muted-foreground text-sm">
            Você não tem agendamentos.
          </p>
        </div>
      </PageSection>
    );
  }

  const scheduledBookings = bookings.filter(
    booking => booking.status === "SCHEDULED",
  );

  const cancelledBookings = bookings.filter(
    booking => booking.status === "CANCELLED",
  );

  const finishedBookings = bookings.filter(
    booking => booking.status === "COMPLETED",
  );

  const handleClickBooking = (booking: BookingClient) => {
    setSelectedBooking(booking);
    setIsSheetOpen(true);
  };

  const tabs = [
    { label: "Confirmados", value: "scheduled" },
    { label: "Cancelados", value: "cancelled" },
    { label: "Finalizados", value: "finished" },
  ];

  return (
    <>
      <PageSection>
        <PageSectionTitle>Agendamentos</PageSectionTitle>
        <Tabs defaultValue={tabs[0].value}>
          <TabsList className="mb-4">
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map(tab => {
            const list =
              tab.value === "scheduled"
                ? scheduledBookings
                : tab.value === "cancelled"
                  ? cancelledBookings
                  : finishedBookings;

            const emptyMessages: Record<
              (typeof tabs)[number]["value"],
              string
            > = {
              scheduled: "Você não tem agendamentos marcados ou pendentes.",
              cancelled: "Você não tem agendamentos cancelados.",
              finished: "Você não tem agendamentos finalizados.",
            };

            return (
              <TabsContent key={tab.value} value={tab.value}>
                {list.length === 0 ? (
                  <p className="text-muted-foreground text-sm">
                    {emptyMessages[tab.value]}
                  </p>
                ) : (
                  <div className="flex flex-col gap-3">
                    <BookingDetails
                      bookings={list}
                      onClick={
                        tab.value === "scheduled"
                          ? handleClickBooking
                          : undefined
                      }
                    />
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </PageSection>

      <CancelBooking
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        booking={selectedBooking}
      />
    </>
  );
}

interface BookingDetailsProps {
  bookings: Awaited<ReturnType<typeof getBookingsClient>>;
  onClick?: (booking: BookingClient) => void;
}

const BookingDetails = ({ bookings, onClick }: BookingDetailsProps) => {
  if (!bookings || bookings.length === 0) {
    return null;
  }

  return bookings.map(booking => {
    const isPendingVisual =
      booking.status === "SCHEDULED" && booking.date < new Date();

    const bookingClient: BookingClient = {
      id: booking.id,
      date: booking.date,
      stripeChargeId: booking.stripeChargeId,
      status: booking.status,
      service: {
        name: booking.service.name,
        priceInCents: booking.service.priceInCents,
      },
      barber: {
        name: booking.barber.user?.name ?? "Barbeiro",
        imageUrl: booking.barber.user?.image ?? imagePaths.defaultAvatar,
        phone: booking.barber.phone,
      },
    };

    return (
      <BookingItem
        key={booking.id}
        serviceName={booking.service.name}
        date={booking.date}
        counterPart={{
          name: booking.barber.user?.name ?? "Barbeiro",
          imageUrl: booking.barber.user?.image ?? imagePaths.defaultAvatar,
        }}
        status={isPendingVisual ? "PENDING" : booking.status}
        onClick={onClick ? () => onClick(bookingClient) : undefined}
      />
    );
  });
};

/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Eu posso usar> */
"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { confirmBookingAction } from "@/features/booking/actions/confirm-booking-checkout";
import BookingItem from "@/features/booking/components/booking-item";
import { BookingSkeleton } from "@/features/booking/components/booking-skeleton";
import ConfirmAlertDialog from "@/features/booking/components/confirm-booking-dialog";
import { useBookings } from "@/features/booking/hooks/useBookings";
import { DatePicker } from "@/shared/components/date-picker";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { cancelBookingAction } from "@/features/booking/functions/cancel-booking";

export function ScheduleCard() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date();
    return today;
  });

  /**
   * Hook para buscar os agendamentos do barbeiro para a data selecionada
   */
  const { data: bookings, isLoading } = useBookings(selectedDate);

  /**
   * Action para confirmar um agendamento. Só pode ser confirmado se a data do agendamento for igual ou anterior à data atual
   */
  const { execute, isPending } = useAction(confirmBookingAction, {
    onError: ({ error }) => {
      const message =
        error.validationErrors?._errors?.[0] ||
        error.serverError ||
        "Erro ao confirmar o agendamento.";
      toast.error(message);
    },
  });

  const {execute: cancelExecute, isPending: isCancelPending} = useAction(cancelBookingAction)

  const Skeleton = (
    <div className="flex flex-col gap-4">
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <BookingSkeleton key={`i${index}`} />
        ))}
    </div>
  );
  const completedBookings = bookings?.filter(
    booking => booking.status === "COMPLETED",
  );

  const scheduledBookings = bookings?.filter(
    booking => booking.status === "SCHEDULED",
  );

  const canceledBookings = bookings?.filter(
    booking => booking.status === "CANCELLED",
  );

  const tabs = [
    { label: "Pendentes", value: "scheduled" },
    { label: "Finalizados", value: "completed" },
    { label: "Cancelados", value: "canceled" },
  ] as const;

  const emptyMessages: Record<(typeof tabs)[number]["value"], string> = {
    scheduled: "Você não tem agendamentos pendentes.",
    completed: "Você não tem agendamentos finalizados.",
    canceled: "Você não tem agendamentos cancelados.",
  };

  return (
    <div className="flex flex-col gap-6 self-end">
      <div className="flex w-full max-w-xs flex-col gap-2 sm:items-start sm:justify-between">
        <span className="font-medium text-muted-foreground text-sm">
          {selectedDate ? "Data selecionada:" : "Selecione uma data"}
        </span>
        <DatePicker date={selectedDate} setDate={setSelectedDate} />
      </div>

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
              ? (scheduledBookings ?? [])
              : tab.value === "completed"
                ? (completedBookings ?? [])
                : (canceledBookings ?? []);

          return (
            <TabsContent key={tab.value} value={tab.value}>
              {isLoading || isPending ? (
                Skeleton
              ) : list.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {emptyMessages[tab.value]}
                </p>
              ) : tab.value === "scheduled" ? (
                <div className="flex flex-col gap-4">
                  {list.map(booking => (
                    <ConfirmAlertDialog
                      key={booking.id}
                      handleConfirm={() => {
                        if (booking.date > new Date()) {
                          toast.error(
                            "Não é possível confirmar um agendamento para uma data futura",
                          );
                          return;
                        }
                        execute({ bookingId: booking.id });
                      }}
                      otherAction={() => {
                         if (booking.date > new Date()) {
                          toast.error(
                            "Não é possível confirmar um agendamento para uma data futura",
                          );
                          return;
                        }
                        cancelExecute({ bookingId: booking.id });
                      }}
                      otherActionText="Cancelar agendamento"
                      isLoading={isPending || isCancelPending}
                      title="Confirmar Agendamento"
                      infos={
                        <span>
                          Você está prestes a confirmar o agendamento de{" "}
                          <strong>{booking.service.name}</strong> para{" "}
                          <strong>
                            {new Date(booking.date).toLocaleDateString(
                              "pt-BR",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </strong>{" "}
                          de <strong>{booking.client.name}</strong>.
                        </span>
                      }
                    >
                      <BookingItem
                        key={booking.id}
                        serviceName={booking.service.name}
                        date={booking.date}
                        counterPart={{
                          name: booking.client.name,
                          imageUrl: booking.client.image ?? "",
                        }}
                      />
                    </ConfirmAlertDialog>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {list.map(booking => {
                    const isPendingVisual =
                      booking.status === "SCHEDULED" &&
                      new Date(booking.date) < new Date();

                    return (
                      <BookingItem
                        key={booking.id}
                        serviceName={booking.service.name}
                        date={booking.date}
                        counterPart={{
                          name: booking.client.name,
                          imageUrl: booking.client.image ?? "",
                        }}
                        status={isPendingVisual ? "PENDING" : booking.status}
                      />
                    );
                  })}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

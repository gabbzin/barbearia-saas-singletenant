/** biome-ignore-all lint/suspicious/noArrayIndexKey: <Eu posso usar> */
"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { confirmBookingAction } from "@/features/booking/actions/confirm-booking-checkout";
import BookingItem from "@/features/booking/components/booking-item";
import { BookingSkeleton } from "@/features/booking/components/booking-skeleton";
import ConfirmAlertDialog from "@/features/booking/components/confirm-booking-dialog";
import { useBookings } from "@/features/booking/hooks/useBookings";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

export function ScheduleCard({ barberId }: { barberId: string }) {
  const { data: bookings, isLoading } = useBookings(barberId);

  const { execute, isPending } = useAction(confirmBookingAction, {
    onError: ({ error }) => {
      const message =
        error.validationErrors?._errors?.[0] ||
        error.serverError ||
        "Erro ao confirmar o agendamento.";
      toast.error(message);
    },
  });

  const completedBookings = bookings?.filter(
    booking => booking.status === "COMPLETED",
  );

  const scheduledBookings = bookings?.filter(
    booking => booking.status === "SCHEDULED",
  );

  const canceledBookings = bookings?.filter(
    booking => booking.status === "CANCELLED",
  );

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <BookingSkeleton key={`i${index}`} />
          ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="scheduled">
        <TabsList className="mb-4">
          <TabsTrigger value="scheduled">Pendentes</TabsTrigger>
          <TabsTrigger value="completed">Finalizados</TabsTrigger>
          <TabsTrigger value="canceled">Cancelados</TabsTrigger>
        </TabsList>
        <TabsContent value="scheduled">
          {scheduledBookings && scheduledBookings.length > 0 ? (
            <div className="flex flex-col gap-4">
              {scheduledBookings?.map(booking => (
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
                  isLoading={isPending}
                  title="Confirmar Agendamento"
                  infos={
                    <span>
                      Você está prestes a confirmar o agendamento de{" "}
                      <strong>{booking.service.name}</strong> para{" "}
                      <strong>
                        {new Date(booking.date).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </strong>{" "}
                      de <strong>{booking.user.name}</strong>.
                    </span>
                  }
                >
                  <BookingItem
                    key={booking.id}
                    serviceName={booking.service.name}
                    date={booking.date}
                    counterPart={{
                      name: booking.user.name,
                      imageUrl: booking.user.image ?? "",
                    }}
                  />
                </ConfirmAlertDialog>
              ))}
            </div>
          ) : (
            <p>Nenhum agendamento pendente.</p>
          )}
        </TabsContent>
        <TabsContent value="completed">
          {completedBookings && completedBookings.length > 0 && (
            <div className="flex flex-col gap-4">
              {completedBookings?.map(booking => (
                <BookingItem
                  key={booking.id}
                  serviceName={booking.service.name}
                  date={booking.date}
                  counterPart={{
                    name: booking.user.name,
                    imageUrl: booking.user.image ?? "",
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="canceled">
          {canceledBookings && canceledBookings.length > 0 && (
            <div className="flex flex-col gap-4">
              {canceledBookings?.map(booking => (
                <BookingItem
                  key={booking.id}
                  serviceName={booking.service.name}
                  date={booking.date}
                  counterPart={{
                    name: booking.user.name,
                    imageUrl: booking.user.image ?? "",
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

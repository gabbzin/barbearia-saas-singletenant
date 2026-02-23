"use client";

import type { Barber, BarberService, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { createBooking } from "@/features/booking/functions/create-booking";
import { createBookingCheckoutSession } from "@/features/booking/functions/create-booking-checkout-session";
import { getDateAvailableTimeSlots } from "@/features/booking/functions/get-date-available-time-slots";
import type { SubscriptionInfo } from "@/features/user/repository/user.repository";
import { isPastTimeSlot } from "@/utils/isPastTimeSlot";
import PagamentForm, { type payMethods } from "./form/pagament-form";
import { SpinLoader } from "./spinLoader";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import { SheetContent, SheetHeader, SheetTitle } from "./ui/sheet";
import { Spinner } from "./ui/spinner";

interface AppointmentSheetProps {
  setSheetOpen: (open: boolean) => void;
  service: BarberService & {
    barber: Barber & {
      user: User;
    };
  };
  plan?: SubscriptionInfo;
}

const AppointmentSheet = ({
  setSheetOpen,
  service,
  plan,
}: AppointmentSheetProps) => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [payMethod, setPayMethod] = useState<payMethods>("cartao");

  const { executeAsync, isPending: isBookingPending } =
    useAction(createBooking);
  const { executeAsync: executeCheckoutAsync, isPending: isCheckoutPending } =
    useAction(createBookingCheckoutSession);

  const selectedDateKey = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : null;

  const { data: availableTimeSlots, isPending: isAvailableTimePending } =
    useQuery<string[]>({
      queryKey: [
        "date-available-time-slots",
        service.barberId,
        selectedDateKey,
      ],
      queryFn: async () => {
        const result = await getDateAvailableTimeSlots({
          barberId: service.barberId,
          // biome-ignore lint/style/noNonNullAssertion: <Sempre vai ter valor aqui>
          date: selectedDate!,
        });
        if (result.validationErrors || result.serverError) {
          toast.error(
            `Erro ao buscar horários disponíveis: ${result.validationErrors?._errors?.[0] || result.serverError}`,
          );
          return [];
        }

        return result?.data || [];
      },
      enabled: !!selectedDate,
    });

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const isPending = isBookingPending || isCheckoutPending;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const priceInReaisInteger = Math.floor(service.priceInCents / 100);

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })
    : "";

  const isConfirmDisabled = !selectedDate || !selectedTime;

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return;

    // biome-ignore lint/suspicious/noExplicitAny: <Não precisa tipar aqui>
    let result: any;

    const timeSplitted = selectedTime.split(":");
    const hours = timeSplitted[0];
    const minutes = timeSplitted[1];

    const date = new Date(selectedDate);

    date.setHours(Number(hours), Number(minutes), 0, 0);

    if (payMethod === "cartao" && !plan?.hasPlan) {
      result = await executeCheckoutAsync({
        serviceId: service.id,
        date,
      });
    } else {
      result = await executeAsync({
        serviceId: service.id,
        date,
      });
    }

    if (result.serverError || result.validationErrors) {
      toast.error(result.validationErrors?._errors?.[0]);
      return;
    }

    if (payMethod === "cartao" && result.data && "url" in result.data) {
      if (result.data.url) {
        window.location.href = result.data.url;
        return;
      }
    }

    // Redirect to bookings page after successful booking
    router.push("/bookings");

    toast.success("Agendamento criado com sucesso!");
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setSheetOpen(false);
  };

  let priceFree = priceInReaisInteger;
  // Isolar lógica em outro lugar depois
  if (
    service.name.toLowerCase() === "corte de cabelo" &&
    (plan?.name?.toLowerCase() === "corte ilimitado" ||
      plan?.name?.toLowerCase() === "corte e barba ilimitados")
  ) {
    priceFree = 0;
  } else if (
    service.name.toLowerCase() === "barba" &&
    (plan?.name?.toLowerCase() === "barba ilimitada" ||
      plan?.name?.toLowerCase() === "corte e barba ilimitados")
  ) {
    priceFree = 0;
  }

  return (
    <SheetContent className="w-92.5 overflow-y-auto p-0">
      <div className="flex h-full flex-col gap-6">
        <SheetHeader className="px-5 pt-6">
          <SheetTitle className="font-bold text-lg">Fazer Reserva</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-5">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={{ before: today }}
            className="w-full p-0"
            locale={ptBR}
          />
        </div>

        {selectedDate && (
          <>
            <Separator />

            <div className="flex px-5">
              <div className="flex flex-1 items-center gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {isAvailableTimePending ? (
                  <div className="flex w-full flex-1 justify-center">
                    <Spinner />
                  </div>
                ) : (
                  <div className="flex flex-1 justify-center gap-3">
                    {availableTimeSlots && availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map(time => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "secondary"
                          }
                          size={"sm"}
                          onClick={() => setSelectedTime(time)}
                          disabled={isPastTimeSlot(time, selectedDate)}
                        >
                          {time}
                        </Button>
                      ))
                    ) : (
                      <span className="">Nenhum horário disponível</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div className="flex flex-col gap-3 px-5">
              <PagamentForm
                payMethod={payMethod}
                onPaymentMethodSelect={setPayMethod}
              />
            </div>

            <Separator />

            <div className="flex flex-col gap-3 px-5">
              <div className="flex w-full flex-col gap-3 rounded-[10px] border border-border border-solid bg-card p-3">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-base text-card-foreground">
                    {service.name}
                  </p>
                  <p className="font-bold text-card-foreground text-sm">
                    R${priceFree},00
                  </p>
                </div>

                <div className="flex items-center justify-between text-muted-foreground text-sm">
                  <p>Método de pagamento</p>
                  <p className="capitalize">
                    {payMethod === "cartao" ? "Cartão" : payMethod}
                  </p>
                </div>
                <div className="flex items-center justify-between text-muted-foreground text-sm">
                  <p>Data</p>
                  <p>{formattedDate}</p>
                </div>

                {selectedTime && (
                  <div className="flex items-center justify-between text-muted-foreground text-sm">
                    <p>Horário</p>
                    <p>{selectedTime}</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-muted-foreground text-sm">
                  <p>Barbeiro</p>
                  <p>{service.barber.user.name}</p>
                </div>
              </div>
            </div>

            <div className="px-5 pb-6">
              <Button
                className="w-full rounded-full"
                disabled={isConfirmDisabled || isPending}
                onClick={handleConfirm}
              >
                {isPending ? <SpinLoader /> : "Confirmar"}
              </Button>
            </div>
          </>
        )}
      </div>
    </SheetContent>
  );
};

export default AppointmentSheet;

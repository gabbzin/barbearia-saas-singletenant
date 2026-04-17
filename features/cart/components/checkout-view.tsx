import { ptBR } from "date-fns/locale/pt-BR";
import { useState } from "react";
import { Calendar } from "@/shared/components/ui/calendar";
import { Separator } from "@/shared/components/ui/separator";
import { Spinner } from "@/shared/components/ui/spinner";
import { Button } from "@/shared/components/ui/button";
import { isPastTimeSlot } from "@/utils/isPastTimeSlot";
import PagamentForm from "@/shared/components/form/pagament-form";
import { SpinLoader } from "@/shared/components/spinLoader";
import { createBooking } from "@/features/booking/functions/create-booking";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useAvailableTimeSlots } from "@/features/booking/hooks/use-available-time-slots";
import { useCartStore } from "../store/cart.store";
import { SheetFooter } from "@/shared/components/ui/sheet";

type payMethods = "cartao" | "pix" | "dinheiro";

const today = new Date();
today.setHours(0, 0, 0, 0);

export function CheckoutView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [payMethod, setPayMethod] = useState<payMethods>("cartao");

  const { items, barberId } = useCartStore();

  const itemsIds = items.map(item => item.serviceId);
  const barberIdForQuery = barberId ?? undefined;

  const { executeAsync, isPending } = useAction(createBooking);
  const { availableTimeSlots, isAvailableTimePending } = useAvailableTimeSlots(
    barberIdForQuery,
    itemsIds,
    selectedDate,
  );

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })
    : "";

  const isConfirmDisabled = !selectedDate || !selectedTime;

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined);
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime || !barberIdForQuery) return;

    const timeSplitted = selectedTime.split(":");
    const hours = timeSplitted[0];
    const minutes = timeSplitted[1];

    const date = new Date(selectedDate);

    date.setHours(Number(hours), Number(minutes), 0, 0);

    const result = await executeAsync({
      barberId: barberIdForQuery,
      servicesIds: itemsIds,
      date,
      paymentMethod: payMethod,
    });

    if (result.serverError || result.validationErrors) {
      toast.error(result.validationErrors?._errors?.[0]);
      return;
    }

    // Redirect to bookings page after successful booking
    // router.push(clientRoutes.bookings);

    toast.success("Agendamento criado com sucesso!");
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    // setSheetOpen(false);
  };

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex flex-1 flex-col gap-5">
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
            {/* Horários */}
            <div className="flex px-5">
              <div className="flex flex-1 items-center gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                {isAvailableTimePending ? (
                  <div className="flex w-full flex-1 items-center justify-center">
                    <Spinner /> Buscando horários...
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

            {/* Formulário de pagamento */}
            <div className="flex flex-col gap-3 px-5">
              <PagamentForm
                payMethod={payMethod}
                onPaymentMethodSelect={setPayMethod}
              />
            </div>

            <Separator />

            {/* Card de informações */}
            <div className="flex flex-col gap-3 px-5">
              <div className="flex w-full flex-col gap-3 rounded-[10px] border border-border border-solid bg-card p-3">
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
              </div>
            </div>
          </>
        )}
      </div>
      <SheetFooter>
        <Button
          className="w-full rounded-full"
          disabled={isConfirmDisabled || isPending}
          onClick={handleConfirm}
        >
          {isPending ? <SpinLoader /> : "Confirmar"}
        </Button>
      </SheetFooter>
    </div>
  );
}

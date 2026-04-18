"use client";

import { EllipsisIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import type { BookingClient } from "@/features/booking/components/booking-client";
import CancelAlertDialog from "@/shared/components/cancel-alert-dialog";
import { cancelBookingAction } from "@/features/booking/functions/cancel-booking";
import { cancelBookingCheckoutSession } from "@/features/booking/functions/cancel-booking-checkout-session";
import { PhoneItem } from "@/shared/components/phone-item";
import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { imagePaths } from "@/shared/constants/images";
import { getBookingServiceFullLabel } from "@/utils/booking-services-label";
import { formatarHoraLocal } from "@/utils/date-formatters";

interface CancelBookingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: BookingClient | null;
  showTrigger?: boolean;
}

export function CancelBooking({
  open,
  onOpenChange,
  booking,
  showTrigger = false,
}: CancelBookingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { execute: executeCancelBooking } = useAction(cancelBookingAction, {
    onSuccess: () => {
      toast.success("Reserva cancelada com sucesso!");
      onOpenChange(false);
      router.refresh();
    },
    onError: () => {
      toast.error("Erro ao cancelar reserva.");
      setIsLoading(false);
    },
  });

  const { execute: executeCancelBookingCheckout } = useAction(
    cancelBookingCheckoutSession,
    {
      onSuccess: () => {
        toast.success("Reserva cancelada com sucesso! E foi reembolsada.");
        onOpenChange(false);
        router.refresh();
      },
      onError: () => {
        toast.error("Erro ao cancelar reserva.");
        setIsLoading(false);
      },
    },
  );

  if (!booking) {
    return null;
  }

  const handleCancelBooking = () => {
    setIsLoading(true);

    if (booking.stripeChargeId) {
      executeCancelBookingCheckout({ bookingId: booking.id });
      return;
    }

    executeCancelBooking({ bookingId: booking.id });
  };

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(
    booking.services.reduce((sum, service) => sum + service.priceInCents, 0) /
      100,
  );

  const serviceFullLabel = getBookingServiceFullLabel(booking.services);

  const formattedDate = booking.date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
  const formattedTime = formatarHoraLocal(booking.date);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {showTrigger && (
        <SheetTrigger asChild>
          <Button variant={"secondary"}>
            <EllipsisIcon />
            Ver detalhes
          </Button>
        </SheetTrigger>
      )}
      <SheetContent className="w-[90%] max-w-92.5 overflow-y-auto p-0">
        <SheetHeader className="px-5 py-6 text-left">
          <SheetTitle>Informações da Reserva</SheetTitle>
          <SheetDescription className="sr-only">
            Detalhes da sua reserva
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-5 py-6">
          {/* Imagem do Mapa e Card da Barbearia */}
          <div className="relative h-45 w-full overflow-hidden rounded-lg">
            <Image
              src={imagePaths.map}
              alt="Mapa"
              fill
              className="object-cover"
              quality={100}
            />
            <Card className="absolute bottom-5 left-1/2 flex w-[calc(100%-40px)] -translate-x-1/2 items-center gap-3 p-5">
              <Avatar className="size-12">
                <AvatarImage src={booking.barber.imageUrl} />
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <h3 className="truncate font-bold">{booking.barber.name}</h3>
              </div>
            </Card>
          </div>

          {/* Card de Informações do Agendamento */}
          <Card className="flex flex-col gap-3 p-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">{serviceFullLabel}</h3>
              <p className="font-bold text-sm">{formattedPrice}</p>
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <p>Data</p>
              <p className="text-right">{formattedDate}</p>
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <p>Horário</p>
              <p className="text-right">{formattedTime}</p>
            </div>
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <p>Barbeiro</p>
              <p className="text-right">{booking.barber.name}</p>
            </div>
          </Card>

          {/* Telefones */}
          <div className="flex flex-col gap-3">
            <PhoneItem phone={booking.barber.phone} />
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-3 px-5 py-6">
          <Button
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => onOpenChange(false)}
          >
            Voltar
          </Button>
          <CancelAlertDialog
            handleCancel={handleCancelBooking}
            isLoading={isLoading}
            title="Cancelar Reserva"
            description="Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita."
            cancelButtonText="Não, manter reserva"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

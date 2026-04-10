"use client";

import { addMinutes, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { type CalendarOptions, GoogleCalendar } from "datebook";
import {
  CalendarFoldIcon,
  CalendarIcon,
  CalendarX2Icon,
  EllipsisIcon,
  FrownIcon,
  MapPinIcon,
  PlusIcon,
  ScissorsIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconBadge } from "@/shared/components/icon-badge";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { clientRoutes } from "@/shared/constants/routes";
import { useBarbershopStore } from "@/stores/barbershop.store";
import { formatarHoraLocal } from "@/utils/date-formatters";
import AddEventCalendar from "../functions/download-ics";
import type { getNextBookingClient } from "../functions/get-bookings";

interface NextBookingProps {
  nextBooking: Awaited<ReturnType<typeof getNextBookingClient>> | null;
  lastBookingDate: Date | null;
}

export function NextBooking({
  nextBooking,
  lastBookingDate,
}: NextBookingProps) {
  const [isMounted, setIsMounted] = useState(false);
  const barbershop = useBarbershopStore(s => s.barbershop);

  const { push } = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!nextBooking) {
    return (
      <Card>
        <CardContent className="mx-auto flex w-full flex-col items-center gap-4 py-6 text-center">
          <IconBadge
            icon={lastBookingDate ? <CalendarX2Icon /> : <FrownIcon />}
            variant="mutedSoft"
            size="lg"
          />
          <div>
            <p className="font-bold">Você ainda não tem horário marcado</p>
            <p className="text-muted-foreground text-sm">
              {lastBookingDate ? (
                <span>
                  Seu último corte foi há{" "}
                  {Math.floor(
                    (Date.now() - lastBookingDate.getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  dias.
                  <br />
                  Que tal dar um trato no visual?
                </span>
              ) : (
                "Você nunca marcou um horário. Vamos agendar um!"
              )}
            </p>
          </div>
          <Button variant={"gold"}>
            <Link
              href={clientRoutes.barberLucas}
              className="flex items-center gap-2"
            >
              <PlusIcon />
              Agendar Agora
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const bookingDate = new Date(nextBooking.date);

  const day = format(bookingDate, "dd");
  const month = format(bookingDate, "MMM", {
    locale: ptBR,
  }).toUpperCase();
  const timeEnd = addMinutes(bookingDate, 30);

  // Atualizar para usar dados reais do nextBooking
  const eventConfig: CalendarOptions = {
    title: `${nextBooking?.service.name} com ${nextBooking?.barber.user?.name}`,
    start: bookingDate,
    end: timeEnd,
    description: `Agendamento de serviço na barbearia com ${nextBooking?.barber.user?.name}.`,
    location: "Barbearia XYZ",
  };

  const handleButtonClick = () => {
    const userAgent = navigator.userAgent;

    const isMobile = /iPhone|iPad|iPod|Android|Mobi/i.test(userAgent);

    if (isMobile) {
      AddEventCalendar(eventConfig);
      return;
    }

    const googleCalendar = new GoogleCalendar(eventConfig);
    const url = googleCalendar.render();
    window.open(url, "_blank");
  };

  return (
    <Card className="grid gap-4 border-6 transition-colors duration-300 hover:border-gold/30">
      <CardHeader className="grid gap-4">
        <Badge variant={"gold"}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-strong"></span>
          Próximo Agendamento
        </Badge>
        <CardTitle className="text-2xl">{nextBooking?.service.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <main className="flex items-center gap-3 py-2 font-poppins">
          <Card className="flex flex-1 items-center justify-between gap-2">
            <CardContent className="mx-2 flex w-full flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="rounded-md bg-gold p-2 text-primary-foreground">
                  <CalendarIcon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-primary/50 text-xs uppercase">
                    Data e Hora
                  </p>
                  <p className="font-semibold text-sm">
                    {day} de {month} às{" "}
                    {isMounted ? formatarHoraLocal(bookingDate) : "--:--"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-md bg-gold p-2 text-primary-foreground">
                  <ScissorsIcon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-primary/50 text-xs uppercase">Barbeiro</p>
                  <p className="font-semibold text-sm">
                    {nextBooking?.barber.user?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-md bg-gold p-2 text-primary-foreground">
                  <MapPinIcon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-primary/50 text-xs uppercase">Local</p>
                  <p className="font-semibold text-sm">{barbershop?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </CardContent>

      <CardFooter className="flex flex-col items-end justify-end gap-2 *:text-xs sm:flex-row">
        <Button
          variant={"secondary"}
          onClick={() => {
            push(clientRoutes.bookings);
          }}
        >
          <EllipsisIcon />
          Ver detalhes
        </Button>
        <Button variant={"default"} onClick={handleButtonClick}>
          <CalendarFoldIcon />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  );
}

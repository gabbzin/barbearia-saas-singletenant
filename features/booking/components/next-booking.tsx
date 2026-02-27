"use client";

import { addMinutes, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { type CalendarOptions, GoogleCalendar } from "datebook";
import {
  CalendarFoldIcon,
  CalendarIcon,
  CalendarX2Icon,
  EllipsisIcon,
  MapPinIcon,
  PlusIcon,
} from "lucide-react";
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
import { PhotoAndName } from "@/shared/new_components/photo-and-name";
import { useBarbershopStore } from "@/stores/barbershop.store";
import AddEventCalendar from "../functions/download-ics";
import type { getNextBooking } from "../functions/get-bookings";

interface NextBookingProps {
  nextBooking: Awaited<ReturnType<typeof getNextBooking>> | null;
  lastBookingday: Date | null;
}

export function NextBooking({ nextBooking, lastBookingday }: NextBookingProps) {
  const [isMounted, setIsMounted] = useState(false);
  const barbershop = useBarbershopStore(s => s.barbershop);

  const { push } = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!nextBooking) {
    return (
      <Card>
        <CardContent className="mx-auto flex w-3/5 flex-col items-center gap-4 py-6 text-center">
          <IconBadge
            icon={<CalendarX2Icon size={24} />}
            variant="mutedSoft"
            size="lg"
          />
          <div>
            <p className="mt-2 font-bold">Você ainda não tem horário marcado</p>
            <p className="text-muted-foreground text-sm">
              Seu último corte foi há{" "}
              {lastBookingday
                ? Math.floor(
                    (Date.now() - lastBookingday.getTime()) /
                      (1000 * 60 * 60 * 24),
                  )
                : 0}{" "}
              dias. Que tal dar um trato no visual essa semana?
            </p>
          </div>
          <Button variant={"gold"}>
            <PlusIcon />
            Agendar Agora
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
    title: `${nextBooking?.service.name} com ${nextBooking?.service?.barber?.user?.name}`,
    start: bookingDate,
    end: timeEnd,
    description: `Agendamento de serviço na barbearia com ${nextBooking?.service?.barber?.user?.name}.`,
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
            <CardContent className="mx-2 flex w-full items-center justify-between gap-6">
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
                    {isMounted ? format(bookingDate, "HH:mm") : "--:--"}
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

      <CardFooter className="flex justify-between gap-2 *:text-xs">
        <PhotoAndName
          name={nextBooking?.service?.barber?.user?.name ?? "Barbeiro"}
          imageUrl={nextBooking?.service.barber.user?.image}
          mutedPhrase="Barbeiro"
        />
        <div className="flex gap-3">
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
        </div>
      </CardFooter>
    </Card>
  );
}

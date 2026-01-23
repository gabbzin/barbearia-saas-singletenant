"use client";

import type { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { type CalendarOptions, GoogleCalendar } from "datebook";
import {
  CalendarFoldIcon,
  ClockIcon,
  EllipsisIcon,
  ScissorsIcon,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import AddEventCalendar from "../functions/download-ics";

interface NextBookingProps {
  nextBooking: Prisma.BookingGetPayload<{
    include: {
      service: {
        include: {
          barber: {
            include: {
              user: true;
            };
          };
        };
      };
    };
  }> | null;
}

export function NextBooking({ nextBooking }: NextBookingProps) {
  if (!nextBooking) {
    return (
      <Card className="flex flex-col gap-5">
        <CardHeader className="text-md">
          <CardTitle className="text-center">Sem agendamentos</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const day = format(nextBooking?.date, "dd");
  const month = format(nextBooking?.date, "MMM", {
    locale: ptBR,
  }).toUpperCase();
  const time = nextBooking?.date;
  const timeEnd = new Date(time?.setMinutes(time.getMinutes() + 30));

  const timeFormat = format(time, "HH:mm");

  // Atualizar para usar dados reais do nextBooking
  const eventConfig: CalendarOptions = {
    title: `${nextBooking?.service.name} com ${nextBooking?.service?.barber?.user?.name}`,
    start: nextBooking?.date,
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
    <Card>
      <CardHeader>
        <CardTitle>{nextBooking?.service.name}</CardTitle>
      </CardHeader>

      <CardContent>
        <Separator className="my-2" />
        <main className="flex items-center gap-3 py-2 font-geist">
          {/* Data e Hora */}
          <div className="flex h-full flex-col items-start border-r pr-4">
            <p className="text-center font-semibold text-xl capitalize leading-none">
              <span className="font-bold">{day}</span>
              <br />
              <span>{month}</span>
            </p>
          </div>

          {/* Detalhes do Agendamento */}
          <div>
            <div className="flex items-center gap-2">
              <ScissorsIcon size={12} />
              <p>{nextBooking?.service?.barber?.user?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon size={12} />
              <p>{timeFormat}</p>
            </div>
          </div>

          {/* Tempo para conclusão */}
          <div></div>
        </main>
        <Separator className="my-2" />
      </CardContent>

      <CardFooter className="flex justify-between gap-2 *:text-xs">
        <Button className="" variant={"secondary"} onClick={handleButtonClick}>
          <CalendarFoldIcon />
          Adicionar
        </Button>
        <Button className="">
          <EllipsisIcon />
          Ver detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}

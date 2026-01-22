"use client";

import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Card } from "@/shared/components/ui/card";

interface BookingItemProps {
  // status: "confirmed" | "finished" | "cancelled";
  serviceName: string;
  date: Date;
  counterPart: {
    name: string;
    imageUrl: string;
  };
  onClick?: () => void;
}

const BookingItem = ({
  // status,
  serviceName,
  date,
  counterPart,
  onClick,
}: BookingItemProps) => {
  // const getBadgeVariant = (s: string) => {
  //   if (s === "confirmed") return "success";
  //   if (s === "cancelled") return "destructive";
  //   return "secondary";
  // };
  return (
    <Card
      className="flex w-full min-w-full cursor-pointer flex-row items-center justify-between p-0 transition-opacity hover:opacity-75"
      onClick={onClick}
    >
      {/* ESQUERDA - INFORMAÇÕES DO SERVIÇO E BARBEIRO */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Já tem os tabs para indicar */}
        {/* <Badge variant={getBadgeVariant(status)} className="font-bold">
          {status === "confirmed"
            ? "CONFIRMADO"
            : status === "cancelled"
              ? "CANCELADO"
              : "FINALIZADO"}
        </Badge> */}
        <div className="flex flex-col gap-2">
          <p className="font-bold">{serviceName}</p>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={counterPart.imageUrl} />
            </Avatar>
            <p className="font-bold text-xs">{counterPart.name}</p>
          </div>
        </div>
      </div>

      {/* DIREITA - INFORMAÇÔES DO HORÁRIO */}
      <div className="flex h-full flex-col items-center justify-center border-l p-4 py-3">
        <p className="text-xs capitalize">
          {date.toLocaleDateString("pt-BR", { month: "long" })}
        </p>
        <p className="font-bold text-xl capitalize">
          {date.toLocaleDateString("pt-BR", { day: "2-digit" })}
        </p>
        <p className="text-xs capitalize">
          {date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </Card>
  );
};

export default BookingItem;

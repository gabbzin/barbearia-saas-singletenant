"use client";

import { Avatar, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { formatarHoraLocal } from "@/utils/date-formatters";

interface BookingItemProps {
  serviceName: string;
  date: Date;
  counterPart: {
    name: string;
    imageUrl: string;
  };
  status?: "SCHEDULED" | "PENDING" | "COMPLETED" | "CANCELLED";
  onClick?: () => void;
}

const BookingItem = ({
  serviceName,
  date,
  counterPart,
  status,
  onClick,
}: BookingItemProps) => {
  return (
    <Card
      className="flex w-full min-w-full cursor-pointer flex-row items-center justify-between p-0 transition-opacity hover:opacity-75"
      onClick={onClick}
    >
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-col gap-2">
          <p className="font-bold text-base">{serviceName}</p>
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
        {status === "PENDING" && (
          <Badge variant="secondary" className="mb-2">
            Aguardando confirmação
          </Badge>
        )}
        <p className="text-xs capitalize">
          {date.toLocaleDateString("pt-BR", { month: "long" })}
        </p>
        <p className="font-bold text-xl capitalize">
          {date.toLocaleDateString("pt-BR", { day: "2-digit" })}
        </p>
        <p className="text-xs capitalize">{formatarHoraLocal(date)}</p>
      </div>
    </Card>
  );
};

export default BookingItem;

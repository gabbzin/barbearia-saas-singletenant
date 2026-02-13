"use client";

import type { Barber, BarberService, User } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";
import { useGetSubscription } from "@/queries/get-subscription-user";
import { convertBRL } from "@/utils/convertBRL";
import AppointmentSheet from "../../../shared/components/appointment-sheet";
import { Button } from "../../../shared/components/ui/button";
import { Sheet, SheetTrigger } from "../../../shared/components/ui/sheet";

interface ServiceItemProps {
  service: BarberService & {
    barber: Barber & {
      user: User;
    };
  };
}

export function ServiceItem({ service }: ServiceItemProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const priceInReais = convertBRL(service.priceInCents);

  const { data } = useGetSubscription();

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <div className="flex items-center justify-center gap-3 rounded-2xl border border-border border-solid bg-card p-3">
        <div className="relative size-[110px] shrink-0 overflow-hidden rounded-[10px]">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex grow basis-0 flex-row items-center self-stretch">
          <div className="relative flex h-full min-h-0 min-w-0 grow basis-0 flex-col items-start justify-between">
            <div className="flex w-full flex-col items-start gap-1 text-sm leading-[1.4]">
              <p className="w-full font-bold text-card-foreground">
                {service.name}
              </p>
              <p className="w-full font-normal text-muted-foreground">
                {service.description}
              </p>
            </div>

            <div className="flex w-full items-center justify-between">
              <p className="whitespace-pre font-bold text-card-foreground text-sm leading-[1.4]">
                {priceInReais}
              </p>
              <SheetTrigger asChild>
                <Button className="rounded-full px-4 py-2">Reservar</Button>
              </SheetTrigger>
            </div>
          </div>
        </div>
      </div>
      <AppointmentSheet
        setSheetOpen={setSheetOpen}
        service={service}
        plan={data}
      />
    </Sheet>
  );
}

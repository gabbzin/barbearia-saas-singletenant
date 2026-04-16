"use client";

import type { Barber, BarberService, User } from "@prisma/client";
import { useState } from "react";
import { useGetSubscription } from "@/queries/get-subscription-user";
import AppointmentSheet from "../../../shared/components/appointment-sheet";
import { Sheet } from "../../../shared/components/ui/sheet";
import { ServiceCard } from "./service-card";

interface ServiceItemProps {
  service: BarberService & {
    barber: Barber & {
      user: User;
    };
  };
}

export function ServiceItem({ service }: ServiceItemProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { data } = useGetSubscription();

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <ServiceCard service={service} />
      <AppointmentSheet
        setSheetOpen={setSheetOpen}
        service={service}
        plan={data}
      />
    </Sheet>
  );
}

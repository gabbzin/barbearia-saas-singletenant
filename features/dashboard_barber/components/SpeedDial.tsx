"use client";

import type { Disponibility } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { TimesSchemaData } from "@/features/booking/schema/timesSchema";
import { Button } from "@/shared/components/ui/button";
import { FormBarberBreak } from "./barber-break-form";
import { FormService } from "./form-service";
import FormTimesServices from "./form-times-services";

interface SpeedDialProps {
  barberId: string;
  defaultTimes?: TimesSchemaData;
  disponibility: Disponibility[];
}

export function SpeedDial({
  barberId,
  defaultTimes,
  disponibility,
}: SpeedDialProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col items-end gap-3">
      <div
        className={`flex flex-col gap-3 transition-all duration-300 ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-10 opacity-0"}`}
      >
        <FormTimesServices barberId={barberId} defaultValues={defaultTimes} />
        <FormService barberId={barberId} />
        <FormBarberBreak barberId={barberId} disponibility={disponibility} />
      </div>

      {/* Botão Principal (FAB) */}
      <Button
        size="icon"
        className={`h-14 w-14 rounded-full shadow-xl transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Plus className="size-6" />
      </Button>
    </div>
  );
}

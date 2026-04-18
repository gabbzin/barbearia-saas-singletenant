"use client";

import type { Disponibility } from "@prisma/client";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { TimesSchemaData } from "@/features/booking/schema/timesSchema";
import { Button } from "@/shared/components/ui/button";
import { FormBarberBreak } from "./forms/form-barber-break";
import { FormExceptionDate } from "./forms/form-exception-date";
import { FormService } from "./forms/form-service";
import FormTimesServices from "./forms/form-times-services";
import { NewBookingManualDialog } from "./new-booking-manual-dialog";

interface SpeedDialProps {
  barberId: string;
  defaultTimes?: TimesSchemaData[];
  disponibility: Disponibility[];
}

export function SpeedDial({
  barberId,
  defaultTimes,
  disponibility,
}: SpeedDialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnyDialogOpen, setIsAnyDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setIsAnyDialogOpen(false);
  };

  const handleDialogOpen = () => {
    setIsOpen(false);
    setIsAnyDialogOpen(true);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Fechar menu rápido"
        className={`fixed inset-0 z-60 bg-foreground/50 transition-all duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed right-6 bottom-6 z-61 flex flex-col items-end gap-3">
        <div
          className={`flex flex-col gap-3 transition-all duration-300 ${isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-10 opacity-0"}`}
        >
          <NewBookingManualDialog
            barberId={barberId}
            speedDial={true}
            onDialogOpen={handleDialogOpen}
            onDialogClose={handleDialogClose}
          />
          <FormExceptionDate
            barberId={barberId}
            onDialogOpen={handleDialogOpen}
            onDialogClose={handleDialogClose}
          />
          <FormTimesServices
            barberId={barberId}
            defaultValues={defaultTimes}
            onDialogOpen={handleDialogOpen}
            onDialogClose={handleDialogClose}
          />
          <FormService
            barberId={barberId}
            onDialogOpen={handleDialogOpen}
            onDialogClose={handleDialogClose}
          />
          <FormBarberBreak
            barberId={barberId}
            disponibility={disponibility}
            onDialogOpen={handleDialogOpen}
            onDialogClose={handleDialogClose}
          />
        </div>

        {!isAnyDialogOpen && (
          <Button
            size="icon"
            className={`h-14 w-14 rounded-full shadow-xl transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Plus className="size-6" />
          </Button>
        )}
      </div>
    </>
  );
}

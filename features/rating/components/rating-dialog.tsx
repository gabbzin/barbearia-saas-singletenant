"use client";

import { useState } from "react";
import type { getLastBookingAction } from "@/features/booking/actions/get-last-booking-action";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { InputStars } from "./input-stars";

interface RatingDialogProps {
  lastBooking: Awaited<ReturnType<typeof getLastBookingAction>>["data"];
}

export function RatingDialog({ lastBooking }: RatingDialogProps) {
  const hasBooking = !!lastBooking;
  const [open, setOpen] = useState(hasBooking);

  if (!hasBooking || !lastBooking) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Avalie o atendimento</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <p>
              Seu último atendimento foi {lastBooking.service.name} com o{" "}
              {lastBooking.barber.user?.name}
            </p>
            <p>Como foi sua experiência com esse atendimento?</p>
            <InputStars />
          </div>
          <div className="space-y-2">
            <Input placeholder="Comentário (opcional)" />
          </div>
          <Button>Enviar avaliação</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

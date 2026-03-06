"use client";

import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import type { getLastBookingAction } from "@/features/booking/actions/get-last-booking-action";
import { SpinLoader } from "@/shared/components/spinLoader";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { RatingAction } from "../actions/rating-action";
import { InputStars } from "./input-stars";

interface RatingDialogProps {
  lastBooking: Awaited<ReturnType<typeof getLastBookingAction>>["data"];
}

export function RatingDialog({ lastBooking }: RatingDialogProps) {
  const hasBooking = !!lastBooking;
  const [open, setOpen] = useState(hasBooking);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");

  const { executeAsync, isPending } = useAction(RatingAction);

  if (!hasBooking || !lastBooking) {
    return null;
  }

  const handleSubmit = async () => {
    const payload = {
      ratingValue,
      comment,
      bookingId: lastBooking.id,
    };

    if (ratingValue === 0) {
      toast.error("Por favor, selecione uma avaliação antes de enviar.");
      return;
    }

    const result = await executeAsync(payload);

    if (result.serverError || result.validationErrors) {
      toast.error(
        result.serverError ||
          result.validationErrors?._errors?.[0] ||
          "Erro ao enviar avaliação",
      );
    }

    toast.success("Avaliação enviada com sucesso!");
    setOpen(false);
  };

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
            <InputStars rating={ratingValue} setRating={setRatingValue} />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Comentário (opcional)"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? <SpinLoader /> : "Enviar avaliação"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

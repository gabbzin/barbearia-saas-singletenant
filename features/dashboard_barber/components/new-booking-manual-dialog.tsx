"use client";

import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { useServicesCRUD } from "@/features/service/hooks/useServices";
import { DatePicker } from "@/shared/components/date-picker";
import { SelectForm } from "@/shared/components/form/select-form";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { convertBRL } from "@/utils/convertBRL";

interface NewBookingManualDialogProps {
  barberId: string;
}

export function NewBookingManualDialog({
  barberId,
}: NewBookingManualDialogProps) {
  const { services } = useServicesCRUD(barberId);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <PlusIcon />
          Novo agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Novo agendamento</DialogTitle>
          <DialogDescription>
            Use este formulário rápido para registrar um atendimento presencial.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6 text-sm"
          onSubmit={event => {
            event.preventDefault();
            toast.info("Conecte este formulário ao RHF e à action.");
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="manual-booking-name">Nome do cliente</Label>
            <Input
              id="manual-booking-name"
              name="name"
              placeholder="Nome do cliente"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="manual-booking-phone">Telefone / WhatsApp</Label>
            <Input
              id="manual-booking-phone"
              name="phone"
              placeholder="(00) 00000-0000"
              
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="manual-booking-service">Serviço</Label>
            <SelectForm
              name="service"
              placeholder="Selecione o serviço"
              items={
                services
                  ? services.map(service => ({
                      value: service.id,
                      label: `${service.name} - ${convertBRL(service.priceInCents)}`,
                    }))
                  : []
              }
            />
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="manual-booking-date">Data</Label>
              <DatePicker
                date={new Date()}
                setDate={() => {
                  return;
                }}
                before={today}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="manual-booking-payment">Forma de pagamento</Label>
              <SelectForm
                name="paymentMethod"
                placeholder="Método de pagamento"
                items={[
                  { value: "dinheiro", label: "Dinheiro" },
                  { value: "pix", label: "Pix" },
                  { value: "cartao", label: "Cartão" },
                ]}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="sm">
            Salvar agendamento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

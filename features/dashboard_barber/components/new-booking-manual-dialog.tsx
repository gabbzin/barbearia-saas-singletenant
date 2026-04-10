"use client";

import { PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";
import { createBookingWithoutSession } from "@/features/booking/functions/create-booking-without-session";
import { useAvailableTimeSlots } from "@/features/booking/hooks/use-available-time-slots";
import { useServicesCRUD } from "@/features/service/hooks/useServices";
import { DatePickerForm } from "@/shared/components/form/date-picker-form";
import GenericForm from "@/shared/components/form/generic-form";
import InputForm from "@/shared/components/form/input-form";
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
import { Label } from "@/shared/components/ui/label";
import { convertBRL } from "@/utils/convertBRL";

interface NewBookingManualDialogProps {
  barberId: string;
}

const newBookingSchema = z.object({
  name: z.string({ error: "O nome do cliente é obrigatório" }),
  phone: z.string({ error: "O telefone é obrigatório" }),
  service: z
    .string({ error: "O serviço é obrigatório" })
    .min(1, "O serviço é obrigatório"),
  date: z.date({ error: "A data é obrigatória" }),
  paymentMethod: z
    .string({ error: "A forma de pagamento é obrigatória" })
    .min(1, "A forma de pagamento é obrigatória"),
  time: z.string({ error: "O horário é obrigatório" }),
});

const defaultValues: newBookingSchemaType = {
  name: "",
  phone: "",
  service: "",
  date: new Date(),
  paymentMethod: "",
  time: "",
};

type newBookingSchemaType = z.infer<typeof newBookingSchema>;

export function NewBookingManualDialog({
  barberId,
}: NewBookingManualDialogProps) {
  // Constante de tempo
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Variaveis de estado
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [open, setOpen] = useState(false);

  // Hooks
  const { services } = useServicesCRUD(barberId);
  const { executeAsync } = useAction(createBookingWithoutSession);

  const { availableTimeSlots, isAvailableTimePending } = useAvailableTimeSlots(
    barberId,
    selectedServiceId,
    selectedDate,
    false,
  );

  // Funções
  const handleCreateBooking = async (data: newBookingSchemaType) => {
    const [hours, minutes] = data.time.split(":");
    console.log("Selected time:", data.time);

    const date = new Date(data.date);
    date.setHours(Number(hours), Number(minutes), 0, 0);

    const result = await executeAsync({
      serviceId: data.service,
      date,
      name: data.name,
      phone: data.phone,
      paymentMethod: data.paymentMethod,
    });

    if (result?.serverError || result?.validationErrors) {
      toast.error(
        result.validationErrors?._errors?.[0] ?? "Erro ao criar agendamento.",
      );
      return;
    }

    toast.success(`Agendamento para ${data.name} criado com sucesso!`);
    setOpen(false);
  };

  // React
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <GenericForm<newBookingSchemaType>
          schema={newBookingSchema}
          className="gap-1 text-sm"
          defaultValues={{
            ...defaultValues,
            date: today,
          }}
          onSubmit={handleCreateBooking}
          submitText="Criar agendamento"
        >
          <InputForm
            label="Nome do cliente"
            name="name"
            placeholder="Nome do cliente"
          />

          <InputForm
            label="Telefone"
            name="phone"
            placeholder="(00) 00000-0000"
            mask="phone"
            maxLength={11}
            minLength={10}
          />

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="manual-booking-service">Serviço</Label>
              <SelectForm
                name="service"
                placeholder="Selecione o serviço"
                onValueChange={setSelectedServiceId}
                items={
                  services
                    ? services.map(
                        (service: {
                          id: string;
                          name: string;
                          priceInCents: number;
                        }) => ({
                          value: service.id,
                          label: `${service.name} - ${convertBRL(service.priceInCents)}`,
                        }),
                      )
                    : []
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="manual-booking-payment">Forma de pagamento</Label>
              <SelectForm<newBookingSchemaType>
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

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="manual-booking-date">Data</Label>
              <DatePickerForm
                name="date"
                setSelectedDate={date => setSelectedDate(date ?? today)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="manual-booking-date">Hora</Label>
              <SelectForm
                name="time"
                placeholder="Selecione o horário"
                items={
                  availableTimeSlots?.map(time => ({
                    value: time,
                    label: time,
                  })) || []
                }
                disabled={isAvailableTimePending}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            
          </div>
        </GenericForm>
      </DialogContent>
    </Dialog>
  );
}

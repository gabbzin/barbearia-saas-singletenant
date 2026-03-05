"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { useServicesCRUD } from "@/features/service/hooks/useServices";
import { DatePicker } from "@/shared/components/date-picker";
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
});

const defaultValues: newBookingSchemaType = {
  name: "",
  phone: "",
  service: "",
  date: new Date(),
  paymentMethod: "",
};

type newBookingSchemaType = z.infer<typeof newBookingSchema>;

export function NewBookingManualDialog({
  barberId,
}: NewBookingManualDialogProps) {
  const { services } = useServicesCRUD(barberId);
  const [open, setOpen] = useState(false);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handleCreateBooking = async (data: newBookingSchemaType) => {
    console.log(data);
    toast.info("Rodou aqui chefe");
  };

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
          className="text-sm"
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

          <div className="space-y-2">
            <Label htmlFor="manual-booking-service">Serviço</Label>
            <SelectForm
              name="service"
              placeholder="Selecione o serviço"
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

          <div className="grid gap-3 lg:grid-cols-2">
            <DatePickerForm before={today} />
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
        </GenericForm>
      </DialogContent>
    </Dialog>
  );
}

interface DatePickerFormProps {
  before: Date;
}

function DatePickerForm({ before }: DatePickerFormProps) {
  const { control } = useFormContext<newBookingSchemaType>();

  return (
    <div className="space-y-1.5">
      <Label htmlFor="manual-booking-date">Data</Label>
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <DatePicker
            date={field.value ?? before}
            setDate={field.onChange}
            before={before}
          />
        )}
      />
    </div>
  );
}

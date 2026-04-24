"use client";

import { PlusIcon } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { Controller } from "react-hook-form";
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
import { Checkbox } from "@/shared/components/ui/checkbox";
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
import { SpeedDialFormTrigger } from "./forms/triggers/speed-dial-form-trigger";

interface NewBookingManualDialogProps {
  barberId: string;
  speedDial?: boolean;
  onDialogOpen?: () => void;
  onDialogClose?: () => void;
}

const newBookingSchema = z.object({
  name: z.string({ error: "O nome do cliente é obrigatório" }),
  phone: z.string({ error: "O telefone é obrigatório" }),
  servicesIds: z
    .array(z.string().uuid())
    .min(1, "Selecione pelo menos 1 serviço"),
  date: z.date({ error: "A data é obrigatória" }),
  paymentMethod: z
    .string({ error: "A forma de pagamento é obrigatória" })
    .min(1, "A forma de pagamento é obrigatória"),
  time: z.string({ error: "O horário é obrigatório" }),
});

const defaultValues: newBookingSchemaType = {
  name: "",
  phone: "",
  servicesIds: [],
  date: new Date(),
  paymentMethod: "",
  time: "",
};

type newBookingSchemaType = z.infer<typeof newBookingSchema>;

export function NewBookingManualDialog({
  barberId,
  speedDial = false,
  onDialogOpen,
  onDialogClose,
}: NewBookingManualDialogProps) {
  // Constante de tempo
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Variaveis de estado
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedServicesIds, setSelectedServicesIds] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  // Hooks
  const { services } = useServicesCRUD(barberId);
  const { executeAsync } = useAction(createBookingWithoutSession);

  const { availableTimeSlots, isAvailableTimePending } = useAvailableTimeSlots(
    barberId,
    selectedServicesIds,
    selectedDate,
    false,
  );

  const selectedServices =
    services?.filter(service => selectedServicesIds.includes(service.id)) ?? [];

  const totalPriceInCents = selectedServices.reduce(
    (sum, service) => sum + service.priceInCents,
    0,
  );

  const totalDurationInMinutes = selectedServices.reduce(
    (sum, service) => sum + service.durationInMinutes,
    0,
  );

  // Funções
  const handleCreateBooking = async (data: newBookingSchemaType) => {
    const [hours, minutes] = data.time.split(":");
    console.log("Selected time:", data.time);

    const date = new Date(data.date);
    date.setHours(Number(hours), Number(minutes), 0, 0);

    const result = await executeAsync({
      servicesIds: data.servicesIds,
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
    onDialogClose?.();
    setOpen(false);
  };

  // React
  return (
    <Dialog
      open={open}
      onOpenChange={value => {
        if (value) onDialogOpen?.();
        if (!value) onDialogClose?.();
        if (!value) {
          setSelectedServicesIds([]);
          setSelectedDate(today);
        }
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        {speedDial ? (
          <SpeedDialFormTrigger icon={PlusIcon} label="Novo agendamento" />
        ) : (
          <Button variant="default" className="flex items-center gap-2">
            <PlusIcon />
            Novo agendamento
          </Button>
        )}
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
              <Label htmlFor="manual-booking-service">Serviços</Label>
              <Controller
                name="servicesIds"
                render={({ field, fieldState }) => (
                  <div className="h-28 space-y-2 overflow-y-auto rounded-md border p-3">
                    {services && services.length > 0 ? (
                      services.map(service => {
                        const inputId = `manual-booking-service-${service.id}`;
                        const checked = field.value?.includes(service.id);

                        return (
                          <div
                            key={service.id}
                            className="flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={inputId}
                                checked={checked}
                                onCheckedChange={checkedValue => {
                                  const currentValues =
                                    (field.value as string[]) ?? [];

                                  const nextValues =
                                    checkedValue === true
                                      ? [...currentValues, service.id]
                                      : currentValues.filter(
                                          value => value !== service.id,
                                        );

                                  field.onChange(nextValues);
                                  setSelectedServicesIds(nextValues);
                                }}
                              />
                              <Label htmlFor={inputId}>{service.name}</Label>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {convertBRL(service.priceInCents)}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-muted-foreground text-xs">
                        Nenhum serviço disponível.
                      </p>
                    )}

                    {fieldState.error && (
                      <p className="text-red-500 text-xs">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="grid gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="manual-booking-payment">
                  Forma de pagamento
                </Label>
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
                  disabled={
                    isAvailableTimePending || selectedServicesIds.length === 0
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2"></div>

          <div className="space-y-1 rounded-md border border-dashed p-3">
            <p className="text-muted-foreground text-xs">Resumo</p>
            <p className="font-medium text-sm">
              Servicos selecionados: {selectedServices.length}
            </p>
            <p className="font-medium text-sm">
              Duracao total: {totalDurationInMinutes} min
            </p>
            <p className="font-medium text-sm">
              Total: {convertBRL(totalPriceInCents)}
            </p>
          </div>
        </GenericForm>
      </DialogContent>
    </Dialog>
  );
}

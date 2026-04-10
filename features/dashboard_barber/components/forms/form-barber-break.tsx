"use client";

import type { BarberBreak, Disponibility } from "@prisma/client";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useBarberBreakCRUD } from "@/features/barber/hooks/use-barber-breaks";
import {
  type BarberBreakFormSchemaType,
  barberBreakFormSchema,
} from "@/features/barber/schema/barber-break-schema";
import GenericForm from "@/shared/components/form/generic-form";
import { SelectForm } from "@/shared/components/form/select-form";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { createRange } from "@/utils/convertTimes";
import { SpeedDialFormTrigger } from "./triggers/speed-dial-form-trigger";

export const dias = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

interface BarberBreakFormProps {
  barberId: string;
  barberBreak?: BarberBreak;
  disponibility: Disponibility[];
}

export function FormBarberBreak({
  barberId,
  barberBreak,
  disponibility,
}: BarberBreakFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [slots, setSlots] = useState<{ value: string; label: string }[]>([]);

  const { createBarberBreak, updateBarberBreak, isCreating, isUpdating } =
    useBarberBreakCRUD(barberId);

  const isEditing = !!barberBreak;

  useEffect(() => {
    if (isEditing && barberBreak) {
      setSelectedDay(String(barberBreak.dayOfWeek));
    }
  }, [isEditing, barberBreak]);

  useEffect(() => {
    if (!selectedDay) {
      setSlots([]);
      return;
    }

    const dayDisponibility = disponibility.find(
      d => String(d.dayOfWeek) === selectedDay,
    );

    if (!dayDisponibility) {
      setSlots([]);
      return;
    }

    const range = createRange(
      dayDisponibility.startTime,
      dayDisponibility.endTime,
    );

    const generatedSlots: { value: string; label: string }[] = [];
    const interval = 15;

    for (let time = range.start; time + 30 <= range.end; time += interval) {
      const hours = Math.floor(time / 60)
        .toString()
        .padStart(2, "0");
      const minutes = (time % 60).toString().padStart(2, "0");
      const formatted = `${hours}:${minutes}`;
      generatedSlots.push({ value: formatted, label: formatted });
    }

    setSlots(generatedSlots);
  }, [selectedDay, disponibility]);

  const defaultValues: BarberBreakFormSchemaType | undefined = barberBreak
    ? {
        dayOfWeek: String(
          barberBreak.dayOfWeek,
        ) as BarberBreakFormSchemaType["dayOfWeek"],
        startTime: barberBreak.startTime,
        endTime: barberBreak.endTime,
      }
    : undefined;

  const handleSubmit = async (data: BarberBreakFormSchemaType) => {
    console.log("Enviando aqui chefe");
    const payload = {
      dayOfWeek: Number(data.dayOfWeek),
      startTime: data.startTime,
      endTime: data.endTime,
    };

    if (isEditing && barberBreak) {
      await updateBarberBreak({ barberBreakId: barberBreak.id, ...payload });
    } else {
      await createBarberBreak({ barberId, ...payload });
    }
    setIsOpen(false);
  };

  const isLoading = isEditing ? isUpdating : isCreating;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant={"secondary"} disabled={isLoading}>
            <PencilIcon />
          </Button>
        ) : (
          <SpeedDialFormTrigger label="Adicionar Intervalo" icon={PlusIcon} />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">
            {isEditing ? "Editar Intervalo" : "Adicionar Intervalo"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isEditing
              ? "Altere os detalhes do intervalo abaixo."
              : "Preencha os detalhes do novo intervalo."}
          </DialogDescription>
        </DialogHeader>
        <GenericForm<BarberBreakFormSchemaType>
          schema={barberBreakFormSchema}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          submitText={isEditing ? "Salvar Alterações" : "Criar Intervalo"}
          disabled={isLoading}
        >
          <SelectForm<BarberBreakFormSchemaType>
            name="dayOfWeek"
            placeholder="Selecione o dia da semana"
            items={disponibility.map(d => ({
              value: String(d.dayOfWeek),
              label: dias[d.dayOfWeek],
            }))}
            onValueChange={setSelectedDay}
          />

          <SelectForm<BarberBreakFormSchemaType>
            name="startTime"
            placeholder="Horário de início"
            groupLabels="Hora"
            items={slots}
          />

          <SelectForm<BarberBreakFormSchemaType>
            name="endTime"
            groupLabels="Hora"
            placeholder="Horário de término"
            items={slots}
          />
        </GenericForm>
      </DialogContent>
    </Dialog>
  );
}

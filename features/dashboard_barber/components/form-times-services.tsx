"use client";

import { ScissorsIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSettingsBarber } from "@/features/barber/settings/useSettingsBarber";
import {
  type TimesSchemaData,
  timesSchema,
} from "@/features/booking/schema/timesSchema";
import GenericForm from "@/shared/components/form/generic-form";
import InputForm from "@/shared/components/form/input-form";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

type DayRange = {
  horario_abertura: string;
  horario_fechamento: string;
};

const daysMap = new Map([
  [0, "Domingo"],
  [1, "Segunda-feira"],
  [2, "Terça-feira"],
  [3, "Quarta-feira"],
  [4, "Quinta-feira"],
  [5, "Sexta-feira"],
  [6, "Sábado"],
]);

interface FormTimesServicesProps {
  barberId: string;
  defaultValues?: TimesSchemaData[];
}

interface DaySelectorProps {
  selectedDay: number;
  setSelectedDay: (day: number) => void;
  availabilityByDay: Map<number, DayRange>;
}

function DaySelector({
  selectedDay,
  setSelectedDay,
  availabilityByDay,
}: DaySelectorProps) {
  const { setValue } = useFormContext<TimesSchemaData>();

  useEffect(() => {
    const dayAvailability = availabilityByDay.get(selectedDay);

    setValue("day", selectedDay, { shouldValidate: true });
    setValue("horario_abertura", dayAvailability?.horario_abertura ?? "", {
      shouldValidate: true,
    });
    setValue("horario_fechamento", dayAvailability?.horario_fechamento ?? "", {
      shouldValidate: true,
    });
  }, [selectedDay, availabilityByDay, setValue]);

  return (
    <Select
      value={selectedDay.toString()}
      onValueChange={value => setSelectedDay(Number(value))}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Selecione um dia" />
      </SelectTrigger>
      <SelectContent>
        {Array.from(daysMap.entries()).map(([index, label]) => (
          <SelectItem key={index} value={index.toString()}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function FormTimesServices({
  barberId,
  defaultValues,
}: FormTimesServicesProps) {
  const { saveSettings } = useSettingsBarber(barberId);

  const [availabilityByDay, setAvailabilityByDay] = useState<
    Map<number, DayRange>
  >(
    new Map(
      (defaultValues ?? []).map(item => [
        item.day,
        {
          horario_abertura: item.horario_abertura,
          horario_fechamento: item.horario_fechamento,
        },
      ]),
    ),
  );

  const [selectedDay, setSelectedDay] = useState<number>(
    defaultValues?.[0]?.day ?? 1,
  );

  useEffect(() => {
    setAvailabilityByDay(
      new Map(
        (defaultValues ?? []).map(item => [
          item.day,
          {
            horario_abertura: item.horario_abertura,
            horario_fechamento: item.horario_fechamento,
          },
        ]),
      ),
    );
  }, [defaultValues]);

  const handleSubmit = async (data: TimesSchemaData) => {
    try {
      await saveSettings(data);
      setAvailabilityByDay(prev => {
        const updated = new Map(prev);
        updated.set(data.day, {
          horario_abertura: data.horario_abertura,
          horario_fechamento: data.horario_fechamento,
        });
        return updated;
      });
    } catch (e) {
      console.error("Erro ao salvar", e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center justify-end gap-3">
          <span className="rounded bg-primary/90 px-2 py-1 text-background">
            {"Configurar horários"}
          </span>
          <Button
            size="icon"
            variant="secondary"
            className="h-14 w-14 rounded-full shadow-lg"
          >
            <ScissorsIcon className="size-4" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">
            Configurações de Horários
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Defina os dias e horários de atendimento disponíveis para seus
            clientes.
          </DialogDescription>
        </DialogHeader>
        <GenericForm
          defaultValues={{
            day: selectedDay,
            horario_abertura:
              availabilityByDay.get(selectedDay)?.horario_abertura ?? "",
            horario_fechamento:
              availabilityByDay.get(selectedDay)?.horario_fechamento ?? "",
          }}
          schema={timesSchema}
          submitText="Salvar Configurações"
          onSubmit={handleSubmit}
        >
          <h3 className="font-semibold text-lg">Dias da Semana</h3>
          <div className="grid grid-cols-2 gap-3">
            <DaySelector
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              availabilityByDay={availabilityByDay}
            />
          </div>

          <InputForm
            name="horario_abertura"
            placeholder="Horário de abertura"
            label="Horário de Inicio"
            type="time"
          />

          <InputForm
            name="horario_fechamento"
            placeholder="Horário de fechamento"
            label="Horário de Fechamento"
            type="time"
          />
        </GenericForm>
      </DialogContent>
    </Dialog>
  );
}

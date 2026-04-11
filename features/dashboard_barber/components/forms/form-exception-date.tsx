"use client";

import type { ExceptionDate } from "@prisma/client";
import { CalendarDaysIcon, PencilIcon } from "lucide-react";
import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useExceptionDates } from "@/features/barber/hooks/use-exception-dates";
import {
  type ExceptionDateFormSchemaType,
  exceptionDateFormSchema,
} from "@/features/barber/schema/exception-date-schema";
import { DEFAULT_TIMEZONE } from "@/lib/consts";
import CheckboxForm from "@/shared/components/form/checkbox-form";
import { DatePickerForm } from "@/shared/components/form/date-picker-form";
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
import { formatInTimeZone } from "date-fns-tz";
import { SpeedDialFormTrigger } from "./triggers/speed-dial-form-trigger";

interface FormExceptionDateProps {
  barberId: string;
  exceptionDate?: ExceptionDate;
  onDialogOpen?: () => void;
}

function ExceptionTimeFields() {
  const { control } = useFormContext<ExceptionDateFormSchemaType>();
  const isClosedFullTime = useWatch({ control, name: "isClosedFullTime" });

  if (isClosedFullTime) {
    return null;
  }

  return (
    <>
      <InputForm<ExceptionDateFormSchemaType>
        label="Horário de início"
        name="startTime"
        type="time"
        placeholder="09:00"
      />

      <InputForm<ExceptionDateFormSchemaType>
        label="Horário de término"
        name="endTime"
        type="time"
        placeholder="18:00"
      />
    </>
  );
}

export function FormExceptionDate({
  barberId,
  exceptionDate,
  onDialogOpen,
}: FormExceptionDateProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { createExceptionDate, updateExceptionDate, isCreating, isUpdating } =
    useExceptionDates(barberId);

  const isEditing = !!exceptionDate;
  const isLoading = isEditing ? isUpdating : isCreating;

  const defaultValues: ExceptionDateFormSchemaType | undefined = exceptionDate
    ? {
        date: exceptionDate.date,
        isClosedFullTime: exceptionDate.isClosedFullTime,
        startTime: formatInTimeZone(
          exceptionDate.startTime ?? new Date(),
          DEFAULT_TIMEZONE,
          "HH:mm",
        ),
        endTime: formatInTimeZone(
          exceptionDate.endTime ?? new Date(),
          DEFAULT_TIMEZONE,
          "HH:mm",
        ),
      }
    : {
        date: new Date(),
        isClosedFullTime: false,
        startTime: "",
        endTime: "",
      };

  const handleSubmit = async (data: ExceptionDateFormSchemaType) => {
    if (isEditing && exceptionDate) {
      await updateExceptionDate({
        exceptionDateId: exceptionDate.id,
        data,
      });
    } else {
      await createExceptionDate(data);
    }

    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (open) onDialogOpen?.();
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="secondary" disabled={isLoading}>
            <PencilIcon />
          </Button>
        ) : (
          <SpeedDialFormTrigger
            label="Adicionar exceção"
            icon={CalendarDaysIcon}
          />
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">
            {isEditing ? "Editar exceção" : "Nova exceção"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isEditing
              ? "Atualize a data e os horários dessa exceção."
              : "Defina a data e o intervalo da exceção de agenda."}
          </DialogDescription>
        </DialogHeader>

        <GenericForm<ExceptionDateFormSchemaType>
          schema={exceptionDateFormSchema}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          submitText={isEditing ? "Salvar alterações" : "Criar exceção"}
        >
          <DatePickerForm<ExceptionDateFormSchemaType>
            name="date"
            setSelectedDate={() => {}}
          />

          <CheckboxForm<ExceptionDateFormSchemaType>
            name="isClosedFullTime"
            label="Fechar o dia inteiro"
          />

          <ExceptionTimeFields />
        </GenericForm>
      </DialogContent>
    </Dialog>
  );
}

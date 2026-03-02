"use client";

import { AlertTriangleIcon } from "lucide-react";
import { useSettingsBarber } from "@/features/barber/settings/useSettingsBarber";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { CardTable } from "./card-table";

const daysMap = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export function TableSettings({ barberId }: { barberId: string }) {
  const { settings, isLoading } = useSettingsBarber(barberId);

  const daysOfWeek = settings?.daysOfWeek ?? [];

  return (
    <CardTable
      titleCard="Horários padrão"
      linkText="Ajustar"
      url="/barber/settings"
      tableTitles={["Dia da semana", "Horário"]}
    >
      {isLoading && !settings ? (
        <TableRow>
          <TableCell colSpan={2} className="px-6 py-4 text-muted-foreground text-sm">
            Carregando horários padrão...
          </TableCell>
        </TableRow>
      ) : settings && daysOfWeek.length > 0 ? (
        daysOfWeek.map((day, index) => (
          <TableRow
            key={`${day}-${
              // biome-ignore lint/suspicious/noArrayIndexKey: <>
              index
            }`}
            className="border-t"
          >
            <TableCell className="px-6 py-4">{daysMap[day]}</TableCell>
            <TableCell className="px-6 py-4">
              {settings.startTime} - {settings.endTime}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={2} className="px-6 py-4">
            <Alert>
              <AlertTitle className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <span>Nenhum horário padrão configurado.</span>
                </div>
                <span className="text-muted-foreground text-xs">
                  Use o botão "Ajustar" acima para definir seus horários.
                </span>
              </AlertTitle>
            </Alert>
          </TableCell>
        </TableRow>
      )}
    </CardTable>
  );
}

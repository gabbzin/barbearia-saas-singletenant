"use client";

import { AlertTriangleIcon } from "lucide-react";
import { useBarberBreakCRUD } from "@/features/barber/hooks/use-barber-breaks";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { timeDateToString } from "@/utils/convertTimes";
import { dias } from "../forms/form-barber-break";
import { CardTable } from "./card-table";

interface TableBarberBreakProps {
  barberId: string;
}

export function TableBarberBreak({ barberId }: TableBarberBreakProps) {
  const { barberBreaks, isLoading } = useBarberBreakCRUD(barberId);

  const list = barberBreaks
    ? barberBreaks.map(b => ({ ...b, dayOfWeek: dias[b.dayOfWeek] }))
    : [];

  const barberBreaksFormatted = list.reduce(
    (acc, current) => {
      const existing = acc.find(item => item.dayOfWeek === current.dayOfWeek);
      if (existing) {
        existing.intervals.push(current);
      } else {
        acc.push({ dayOfWeek: current.dayOfWeek, intervals: [current] });
      }

      return acc;
    },
    [] as { dayOfWeek: string; intervals: typeof list }[],
  );

  return (
    <CardTable
      titleCard="Intervalos"
      tableTitles={["Dia da semana", "Intervalos"]}
    >
      {isLoading && barberBreaksFormatted.length === 0 ? (
        <TableRow>
          <TableCell
            colSpan={2}
            className="px-6 py-4 text-muted-foreground text-sm"
          >
            Carregando intervalos...
          </TableCell>
        </TableRow>
      ) : barberBreaksFormatted.length > 0 ? (
        barberBreaksFormatted.map(barberBreak => (
          <TableRow
            key={barberBreak.intervals[0].id}
            className="w-full border-t"
          >
            <TableCell className="px-6 py-4">{barberBreak.dayOfWeek}</TableCell>
            <TableCell className="px-6 py-4">
              {barberBreak.intervals.map(i => (
                <span key={i.id} className="block">
                  {timeDateToString(i.startTime)}-{timeDateToString(i.endTime)}
                </span>
              ))}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={2} className="px-6 py-4">
            <Alert>
              <AlertTitle className="flex flex-col items-center justify-center gap-2 text-yellow-600">
                <div className="flex items-center gap-2">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <span>Nenhum intervalo cadastrado.</span>
                </div>
              </AlertTitle>
            </Alert>
          </TableCell>
        </TableRow>
      )}
    </CardTable>
  );
}

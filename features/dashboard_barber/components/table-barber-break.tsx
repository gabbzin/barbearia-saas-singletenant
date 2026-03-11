"use client";

import { AlertTriangleIcon } from "lucide-react";
import { useBarberBreakCRUD } from "@/features/barber/hooks/use-barber-breaks";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { dias } from "./barber-break-form";
import { CardTable } from "./card-table";

interface TableBarberBreakProps {
  barberId: string;
}

export function TableBarberBreak({ barberId }: TableBarberBreakProps) {
  const { barberBreaks, isLoading } = useBarberBreakCRUD(barberId);
  // const list = barberBreaks ?? [];

  const list = barberBreaks
    ? barberBreaks.map(b => ({ ...b, dayOfWeek: dias[b.dayOfWeek] }))
    : [];

  return (
    <CardTable
      titleCard="Intervalos"
      tableTitles={["Dia da semana", "Intervalo"]}
    >
      {isLoading && list.length === 0 ? (
        <TableRow>
          <TableCell
            colSpan={2}
            className="px-6 py-4 text-muted-foreground text-sm"
          >
            Carregando intervalos...
          </TableCell>
        </TableRow>
      ) : list.length > 0 ? (
        list.map(barberBreak => (
          <TableRow key={barberBreak.id} className="w-full border-t">
            <TableCell className="px-6 py-4">{barberBreak.dayOfWeek}</TableCell>
            <TableCell className="px-6 py-4">
              {barberBreak.startTime}-{barberBreak.endTime}
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

"use client";

import { AlertTriangleIcon } from "lucide-react";
import { useServicesCRUD } from "@/features/service/hooks/useServices";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { convertBRL } from "@/utils/convertBRL";
import { CardTable } from "./card-table";

export function TableService({ barberId }: { barberId: string }) {
  const { services, isLoading } = useServicesCRUD(barberId);
  const list = services ?? [];

  return (
    <CardTable
      titleCard="Serviços"
      linkText="Ver todos"
      tableTitles={["Nome", "Preço"]}
      url=""
    >
      {isLoading && list.length === 0 ? (
        <TableRow>
          <TableCell
            colSpan={2}
            className="px-6 py-4 text-muted-foreground text-sm"
          >
            Carregando serviços...
          </TableCell>
        </TableRow>
      ) : list.length > 0 ? (
        list.map(service => (
          <TableRow key={service.id} className="w-full border-t">
            <TableCell className="px-6 py-4">{service.name}</TableCell>
            <TableCell className="px-6 py-4">
              {convertBRL(service.priceInCents)}
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={2} className="px-6 py-4">
            <Alert>
              <AlertTitle className="flex flex-col items-center justify-center gap-2 text-yellow-600">
                <div className="flex items-center gap-2">
                  <AlertTriangleIcon />
                  Nenhum serviço cadastrado.
                </div>
              </AlertTitle>
            </Alert>
          </TableCell>
        </TableRow>
      )}
    </CardTable>
  );
}

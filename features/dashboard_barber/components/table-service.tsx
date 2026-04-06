"use client";

import { AlertTriangleIcon, ScissorsIcon } from "lucide-react";
import { ServiceDialog } from "@/features/service/components/service-dialog";
import { useServicesCRUD } from "@/features/service/hooks/useServices";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { convertBRL } from "@/utils/convertBRL";
import { CardTable } from "./card-table";
import { Card, CardContent } from "@/shared/components/ui/card";

export function ServiceList({ barberId }: { barberId: string }) {
  const { services, isLoading } = useServicesCRUD(barberId);
  const list = services ?? [];
  const bool = 1 + 1 === 3;

  if (!bool) {
    return (
      <div className="flex items-center gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {list.map(service => (
          <ServiceDialog
            serviceId={service.id}
            key={service.id}
            title={service.name}
            description={service.description}
            price={convertBRL(service.priceInCents)}
            barberId={barberId}
          >
            <Card
              key={service.id}
              className="w-full min-w-fit cursor-pointer rounded-3xl border-none bg-accent transition-colors hover:bg-accent-hover"
            >
              <CardContent className="flex flex-col items-start justify-start py-1 pr-8 pl-4">
                <ScissorsIcon className="mb-2 size-6 text-muted-foreground" />
                <h4 className="font-bold">{service.name}</h4>
                <div className="flex gap-1 text-muted-foreground">
                  <p>{service.durationInMinutes}min</p>
                  <p>-</p>
                  <p>
                    {service.priceInCents === 0
                      ? "A combinar"
                      : convertBRL(service.priceInCents).split(",")[0]}
                  </p>
                </div>
              </CardContent>
            </Card>
          </ServiceDialog>
        ))}
      </div>
    );
  }

  if (bool) {
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
            <ServiceDialog
              serviceId={service.id}
              key={service.id}
              title={service.name}
              description={service.description}
              price={convertBRL(service.priceInCents)}
              barberId={barberId}
            >
              <TableRow className="w-full border-t">
                <TableCell className="px-6 py-4">{service.name}</TableCell>
                <TableCell className="px-6 py-4">
                  {service.priceInCents === 0
                    ? "A combinar"
                    : convertBRL(service.priceInCents)}
                </TableCell>
              </TableRow>
            </ServiceDialog>
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
}

import type { getBookingsBarber } from "@/features/booking/functions/get-bookings";
import { CardTable } from "@/features/dashboard_barber/components/tables/card-table";
import { NextBookingsCard } from "@/features/dashboard_barber/components/next-bookings-card";
import { Badge } from "@/shared/components/ui/badge";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { formatarHoraLocal } from "@/utils/date-formatters";

type NextBooking = Awaited<ReturnType<typeof getBookingsBarber>>[number];

interface NextBookingsSectionProps {
  bookings: NextBooking[] | null | undefined;
}

export function NextBookingsSection({ bookings }: NextBookingsSectionProps) {
  return (
    <>
      <CardTable
        titleCard="Próximos agendamentos"
        linkText="Ver agenda"
        url="/barber/schedule"
        tableTitles={["Cliente", "Serviço", "Data/Hora", "Status"]}
        classNameCard="hidden md:block"
        variant="basic"
      >
        {bookings && bookings.length > 0 ? (
          bookings.map(booking => (
            <TableRow className="border-t" key={booking.id}>
              <TableCell className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {booking.client.name}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 font-semibold text-muted-foreground text-sm">
                {booking.service.name}
              </TableCell>
              <TableCell className="px-6 py-4 text-sm">
                <p className="font-semibold">
                  {formatarHoraLocal(booking.date)}
                </p>
                <p className="font-semibold text-[10px] text-muted-foreground uppercase">
                  Hoje
                </p>
              </TableCell>
              <TableCell className="px-6 py-4 text-sm">
                <Badge
                  variant={
                    booking.status === "CANCELLED" ? "destructive" : "success"
                  }
                >
                  {booking.status.toUpperCase()}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={4}
              className="px-6 py-6 text-center text-muted-foreground text-sm"
            >
              Nenhum agendamento encontrado
            </TableCell>
          </TableRow>
        )}
      </CardTable>

      <NextBookingsCard bookings={bookings} />
    </>
  );
}

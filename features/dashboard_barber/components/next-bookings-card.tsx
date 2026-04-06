import { PhotoAndName } from "@/shared/components/photo-and-name";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent } from "@/shared/components/ui/card";
import { formatarHoraLocal } from "@/utils/date-formatters";

interface NextBookingCardItem {
  id: string;
  date: Date;
  status: string;
  service: {
    name: string;
  };
  client: {
    name: string;
    image: string | null;
  };
}

interface NextBookingsCardProps {
  bookings: NextBookingCardItem[] | null | undefined;
}

const MAX_BOOKINGS_CARDS = 5;

export function NextBookingsCard({ bookings }: NextBookingsCardProps) {
  const bookingsList = bookings?.slice(0, MAX_BOOKINGS_CARDS) ?? [];
  return (
    <div className="grid gap-2 md:hidden">
      {bookingsList.length > 0 ? (
        bookingsList.map(booking => {
          return (
            <Card key={booking.id} variant={"basic"}>
              <CardContent className="flex items-center justify-between">
                <PhotoAndName
                  imageUrl={booking.client.image ?? ""}
                  name={booking.client.name}
                  mutedPhrase={booking.service.name}
                  reverseText={true}
                />
                <div className="flex flex-col items-end justify-center gap-0.5">
                  <p className="font-bold font-inter text-sm">
                    {formatarHoraLocal(booking.date)}
                  </p>
                  <Badge variant={"mini"} className="font-bold">
                    {booking.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <Card>
          <CardContent className="flex items-center justify-center">
            <p className="text-muted-foreground text-sm">
              Nenhum agendamento encontrado
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { ScissorsIcon } from "lucide-react";
import type { getHistory } from "@/features/booking/actions/get-history";
import { cn } from "@/lib/utils";
import { formatarDataHoraLocal } from "@/utils/date-formatters";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

interface HistoryListProps {
  history: Awaited<ReturnType<typeof getHistory>>;
}

export function HistoryList({ history }: HistoryListProps) {
  return (
    <div className="mt-4">
      {history?.data?.history && history.data.history.length > 0 ? (
        history.data.history.map(booking => (
          <Card key={booking.id} className="mb-2">
            <CardContent className="mx-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    booking.status === "COMPLETED"
                      ? "bg-green-400 text-green-600"
                      : booking.status === "CANCELLED"
                        ? "bg-red-400 text-red-600"
                        : "bg-yellow-400 text-yellow-600",
                    "rounded-md p-2",
                  )}
                >
                  <ScissorsIcon size={24} strokeWidth={2.5} />
                </div>
                <div className="items-center text-sm">
                  <p className="font-bold">{booking.service.name}</p>
                  <p>{formatarDataHoraLocal(booking.date)}</p>
                </div>
              </div>
              <div>
                <Badge
                  variant={
                    booking.status === "COMPLETED"
                      ? "success"
                      : booking.status === "CANCELLED"
                        ? "destructive"
                        : "gold"
                  }
                >
                  {booking.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="mb-2">
          <CardContent className="w-full">
            <p className="text-center text-muted-foreground">
              Nenhum agendamento recente
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { format } from "date-fns";
import { ScissorsIcon } from "lucide-react";
import type { getHistory } from "@/features/booking/actions/get-history";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "../components/ui/card";

interface HistoryListProps {
  history: Awaited<ReturnType<typeof getHistory>>;
}

export function HistoryList({ history }: HistoryListProps) {
  return (
    <div className="mt-4">
      {history?.data?.history && history.data.history.length > 0 ? (
        history.data.history.map(booking => (
          <Card key={booking.id} className="mb-2">
            <CardContent className="flex items-center gap-2">
              <div
                className={cn(
                  booking.status === "COMPLETED"
                    ? "bg-green-400 text-green-600"
                    : "bg-red-400 text-red-600",
                  "rounded-md p-2",
                )}
              >
                <ScissorsIcon size={24} strokeWidth={2.5} />
              </div>
              <div className="items-centertext-sm">
                <p className="font-bold">{booking.service.name}</p>
                <p>{format(booking.date, "dd MMM yyyy 'às' HH:mm")}</p>
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

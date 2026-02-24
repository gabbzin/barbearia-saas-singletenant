import { format } from "date-fns";
import { CalendarIcon, CrownIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

interface AccountInfoCardProps {
  createdAt: Date | null;
  planName?: string | null;
  hasPlan: boolean;
}

export function AccountInfoCard({
  createdAt,
  planName,
  hasPlan,
}: AccountInfoCardProps) {
  const formattedDate = createdAt ? format(createdAt, "dd/MM/yyyy") : "—";

  return (
    <Card className="w-full">
      <CardContent className="px-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-muted">
              <CalendarIcon className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Membro desde</p>
              <p className="font-medium text-sm">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-muted">
              <CrownIcon className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Plano atual</p>
              <p className="font-medium text-sm">
                {hasPlan ? planName : "Gratuito"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { format } from "date-fns";
import { CalendarIcon, CrownIcon } from "lucide-react";
import { IconBadge } from "@/shared/components/icon-badge";
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
            <IconBadge
              icon={<CalendarIcon className="size-4" />}
              variant="muted"
              size="lg"
            />
            <div>
              <p className="text-muted-foreground text-xs">Membro desde</p>
              <p className="font-medium text-sm">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <IconBadge
              icon={<CrownIcon className="size-4" />}
              variant="muted"
              size="lg"
            />
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

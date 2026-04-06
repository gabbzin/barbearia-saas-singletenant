import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { BarChartGraph } from "./charts/barchart-comp";

interface GraphCardProps {
  title: string;
  description: string;
  todayBilling: string;
  growthPercentage: number;
  weeklyBillingData: { day: string; saldoEmReais: number }[];
}

export function GraphCard({
  title,
  description,
  todayBilling,
  growthPercentage,
  weeklyBillingData,
}: GraphCardProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="font-bold text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-black text-3xl italic">
              {todayBilling ?? "R$ 0,00"}
            </p>
            <p className="font-medium text-muted-foreground text-sm">
              {description}
            </p>
          </div>
          <div className="font-semibold text-sm">
            {growthPercentage && growthPercentage >= 0 ? (
              <div className="flex items-center gap-2 text-green-500">
                <TrendingUpIcon className="size-5" />
                <span>{growthPercentage?.toFixed(2) ?? 0}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <TrendingDownIcon className="size-5" />
                <span>{growthPercentage?.toFixed(2) ?? 0}%</span>
              </div>
            )}
          </div>
        </div>
        <BarChartGraph
          chartConfig={{
            saldoEmReais: {
              label: "Saldo",
              color: "#60a5fa",
            },
          }}
          data={weeklyBillingData ?? []}
        />
      </CardContent>
    </Card>
  );
}

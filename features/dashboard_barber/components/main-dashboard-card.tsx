import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type React from "react";

type CardInfoProps = {
  Icon?: LucideIcon;
  title: string;
  value: React.ReactNode;
  growthPercentage?: number;
};

export default function MainCardDashboard({
  Icon,
  title,
  value,
  growthPercentage = 0,
}: CardInfoProps) {

  console.log(growthPercentage)

  return (
    <Card className="relative rounded-4xl bg-indigo-600 py-6 text-white">
      <CardHeader className="px-4">
        <CardTitle className="flex items-center justify-between font-semibold text-sm">
          {title}
          {Icon && <Icon className="size-5" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p className="font-bold font-geist text-3xl">{value}</p>
      </CardContent>
      <CardFooter className="px-4 text-xs">
        {typeof(growthPercentage) === "number" ? (
          <div className="flex items-center gap-2">
            {growthPercentage >= 0 ? (
              <TrendingUp className="size-4 text-green-500" />
            ) : (
              <TrendingDown className="size-4 text-red-500" />
            )}
            <p>
              {Math.round(growthPercentage)}%{" "}
              {growthPercentage >= 0
                ? "à mais do que ontem"
                : "à menos do que ontem"}
            </p>
          </div>
        ): null}
      </CardFooter>
    </Card>
  );
}

import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import type React from "react";
import { Progress } from "@/shared/components/ui/progress";

type CardInfoProps = {
  Icon?: LucideIcon;
  title: string;
  value: React.ReactNode;
  growthPercentage?: number;
  progress?: number;
};

export default function MainCardDashboard({
  Icon,
  title,
  value,
  growthPercentage,
  progress,
}: CardInfoProps) {
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
        {progress !== undefined && (
          <Progress
            value={progress}
            className="w-[75%] bg-white/20 text-white"
          />
        )}

        {growthPercentage && (
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
        )}
      </CardFooter>
    </Card>
  );
}

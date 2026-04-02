import { TrendingDown, TrendingUp, type LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type CardInfoProps = {
  Icon?: LucideIcon;
  title: string;
  value: React.ReactNode;
  details?: React.ReactNode;
  growthPercentage?: number;
};

export default function MainCardDashboard({
  Icon,
  title,
  value,
  details,
  growthPercentage = 0,
}: CardInfoProps) {
  const variant =
    growthPercentage > 0 ? "green" : growthPercentage < 0 ? "red" : "default";

  return (
    <Card variant={variant} className="relative rounded-4xl py-6 md:hidden">
      <CardHeader className="px-4">
        <CardTitle className="flex items-center justify-between font-semibold text-sm">
          {title}
          {Icon && <Icon className="size-5" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p className="font-bold font-geist text-3xl">{value}</p>
        {details && <div>{details}</div>}
      </CardContent>
      <CardFooter className="px-4 text-xs">
        {growthPercentage && (
          <div className="flex items-center gap-2">
            {growthPercentage >= 0 ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
            <span>{Math.round(growthPercentage)}%</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

import type { LucideIcon } from "lucide-react";
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
  variant?: "default" | "green" | "blue" | "yellow" | "red" | "basic" | null;
  classNameCard?: string;
  details?: React.ReactNode;
};

export default function CardInfo({
  Icon,
  title,
  value,
  classNameCard,
  variant,
  details,
}: CardInfoProps) {
  const pxCard = "px-4";
  return (
    <Card variant={variant} className={`relative py-6 ${classNameCard ?? ""}`}>
      <CardHeader className={`${pxCard}`}>
        <CardTitle className="flex items-center justify-between font-semibold text-primary/60 text-xs uppercase">
          {title}
          {Icon && <Icon className="size-5 text-primary/50" />}
        </CardTitle>
      </CardHeader>
      <CardContent className={`${pxCard}`}>
        <p className="font-bold font-geist text-xl">{value}</p>
      </CardContent>
      <CardFooter className={`${pxCard}`}>
        {details && <>{details}</>}
      </CardFooter>
    </Card>
  );
}

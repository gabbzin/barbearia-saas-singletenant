import type { LucideIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type CardInfoProps = {
  Icon?: LucideIcon;
  title: string;
  value: React.ReactNode;
  variant?: "default" | "green" | "blue" | "yellow" | "red" | null;
};

export default function CardInfo({
  Icon,
  title,
  value,
  variant,
}: CardInfoProps) {
  return (
    <Card variant={variant} className="relative py-4">
      <CardHeader className="px-4">
        <CardTitle className="flex items-center justify-between font-semibold text-sm">
          {title}
          {Icon && <Icon className="h-5 w-5 opacity-50" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        <p className="font-bold font-geist text-xl">{value}</p>
      </CardContent>
    </Card>
  );
}

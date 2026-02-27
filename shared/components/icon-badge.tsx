import { cn } from "@/lib/utils";

interface IconBadgeProps {
  icon: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "muted"
    | "mutedSoft"
    | "gold"
    | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function IconBadge({
  icon,
  variant = "primary",
  size = "md",
  className,
}: IconBadgeProps) {
  const sizeClasses: Record<NonNullable<IconBadgeProps["size"]>, string> = {
    sm: "p-1",
    md: "p-2",
    lg: "p-3",
  };

  const variantClasses: Record<
    NonNullable<IconBadgeProps["variant"]>,
    string
  > = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary-foreground",
    muted: "bg-muted text-muted-foreground",
    mutedSoft: "bg-muted-foreground/20 text-muted-foreground",
    gold: "bg-gold-soft text-gold",
    success: "bg-chart-2/10 text-chart-2",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        sizeClasses[size ?? "md"],
        variantClasses[variant ?? "primary"],
        className,
      )}
    >
      {icon}
    </div>
  );
}

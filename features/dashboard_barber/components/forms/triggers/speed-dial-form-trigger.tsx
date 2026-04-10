import type { LucideIcon } from "lucide-react";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";

interface SpeedDialFormTriggerProps
  extends ComponentPropsWithoutRef<typeof Button> {
  label: string;
  icon: LucideIcon;
}

export const SpeedDialFormTrigger = forwardRef<
  HTMLButtonElement,
  SpeedDialFormTriggerProps
>(({ label, icon: Icon, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      size="icon"
      variant="secondary"
      {...props}
      className={cn("relative h-14 w-14 rounded-full shadow-lg", className)}
    >
      <span className="pointer-events-none absolute top-1/2 right-[calc(100%+0.75rem)] -translate-y-1/2 whitespace-nowrap rounded bg-background px-2 py-1 text-muted-foreground">
        {label}
      </span>
      <Icon className="size-4" />
    </Button>
  );
});

SpeedDialFormTrigger.displayName = "SpeedDialFormTrigger";

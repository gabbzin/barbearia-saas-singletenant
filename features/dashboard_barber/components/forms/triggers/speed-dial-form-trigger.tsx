import { forwardRef, type HTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface SpeedDialFormTriggerProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  icon: LucideIcon;
}

export const SpeedDialFormTrigger = forwardRef<
  HTMLDivElement,
  SpeedDialFormTriggerProps
>(({ label, icon: Icon, ...props }, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className="flex items-center justify-end gap-3"
    >
      <span className="rounded bg-background px-2 py-1 text-muted-foreground">
        {label}
      </span>
      <Button
        size="icon"
        variant="secondary"
        className="h-14 w-14 rounded-full shadow-lg"
      >
        <Icon className="size-4" />
      </Button>
    </div>
  );
});

SpeedDialFormTrigger.displayName = "SpeedDialFormTrigger";

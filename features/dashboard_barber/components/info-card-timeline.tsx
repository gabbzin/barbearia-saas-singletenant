import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { TimelineIndicator } from "@/shared/components/ui/timeline";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckIcon, ScissorsIcon } from "lucide-react";
import { useState } from "react";

interface InfoCardTimelineProps {
  index: number;
  currentIndex: number;
  event: {
    name: string;
    time: string;
  };
}

export function InfoCardTimeline({
  index,
  currentIndex,
  event,
}: InfoCardTimelineProps) {
  const [open, setOpen] = useState(false);

  const [hours, minutes] = event.time.split(":");
  const time = new Date().setHours(Number(hours), Number(minutes), 0, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TimelineIndicator
          className={cn(
            "flex size-7 items-center justify-center p-1",
            index < currentIndex
              ? "border-none bg-emerald-500 text-primary-foreground"
              : index === currentIndex
                ? "border-none bg-yellow-500 text-primary-foreground"
                : "border bg-zinc-100 dark:bg-zinc-700",
          )}
        >
          {index < currentIndex ? (
            <CheckIcon className="text-primary" />
          ) : index === currentIndex ? (
            <ScissorsIcon className="text-white" />
          ) : null}
        </TimelineIndicator>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left font-bold font-newsreader text-lg">
            {event.name}
          </DialogTitle>
        </DialogHeader>
        <div>
          <p>
            Este evento ocorre{" "}
            {formatDistanceToNow(time, {
              addSuffix: true,
              locale: ptBR,
            })}
          </p>
        </div>
        <DialogFooter>
          <Button variant={"default"}>Ok!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

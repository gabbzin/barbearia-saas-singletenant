"use client";

import { AlertCircle, CheckIcon, ScissorsIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Timeline,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/shared/components/ui/timeline";
import type { TimelineArray } from "../actions/getTimeline";

interface TimelineBarberProps {
  timeline: TimelineArray;
  currentIndex?: number;
}

export function TimelineBarber({
  timeline,
  currentIndex = 0,
}: TimelineBarberProps) {
  const itemsRef = useRef(new Map<string, HTMLDivElement>());

  const setItemRef = (id: string) => (node: HTMLDivElement | null) => {
    if (node) {
      itemsRef.current.set(id, node);
      return;
    }

    itemsRef.current.delete(id);
  };

  useEffect(() => {
    const currentAppointment = timeline.find(item => item.isCurrent);

    if (!currentAppointment) return;

    const node = itemsRef.current.get(currentAppointment.id);

    if (!node) return;

    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [timeline]);

  if (timeline.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border p-4">
        <AlertCircle className="h-10 w-10" />
        <span>Não há eventos para exibir neste dia.</span>
      </div>
    );
  }

  return (
    <Timeline
      defaultValue={currentIndex !== undefined ? currentIndex + 1 : 1}
      orientation="horizontal"
      className="flex w-full justify-between pt-2"
    >
      {timeline.map((item, index) => (
        <TimelineItem
          key={item.id}
          step={index + 1}
          ref={setItemRef(item.id)}
          className="grow"
        >
          <TimelineHeader className="">
            <TimelineDate>{item.eventTime}</TimelineDate>
            <TimelineTitle className="min-w-20 text-xs sm:-mt-0.5">
              {item.description}
            </TimelineTitle>
            <TimelineSeparator className="w-full" />
            <TimelineIndicator
              className={cn(
                "flex size-6 items-center justify-center p-1",
                index < currentIndex
                  ? "border-none bg-emerald-500 text-primary-foreground"
                  : index === currentIndex
                    ? "border-none bg-yellow-500 text-primary-foreground"
                    : "border bg-primary/10",
              )}
            >
              {index < currentIndex ? (
                <CheckIcon className="text-primary" />
              ) : index === currentIndex ? (
                <ScissorsIcon className="text-white" />
              ) : null}
            </TimelineIndicator>
          </TimelineHeader>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

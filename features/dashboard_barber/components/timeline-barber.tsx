"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import {
  Timeline,
  TimelineDate,
  TimelineHeader,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/shared/components/ui/timeline";
import type { TimelineArray } from "../actions/getTimeline";
import { InfoCardTimeline } from "./info-card-timeline";

interface TimelineBarberProps {
  timeline: TimelineArray;
  currentIndex?: number;
}

const classNameSeparatorTimeline =
  "group-data-[orientation=horizontal]/timeline:w-[calc(100%-1rem-0.3rem)] group-data-[orientation=horizontal]/timeline:translate-x-6";

export function TimelineBarber({
  timeline,
  currentIndex = 0,
}: TimelineBarberProps) {
  const itemsRef = useRef(new Map<string, HTMLDivElement>());

  console.log(timeline)

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
          className="grow has-[+[data-completed]]:**:data-[slot=timeline-separator]:bg-emerald-500"
        >
          <TimelineHeader className="">
            <TimelineDate>{item.eventTime}</TimelineDate>
            <TimelineTitle className="line-clamp-2 min-w-24 text-xs sm:-mt-0.5">
              {item.description}
            </TimelineTitle>
            <TimelineSeparator className={`${classNameSeparatorTimeline}`} />
            {index === currentIndex ? (
              <TimelineSeparator
                className={`bg-yellow-500 group-data-[orientation=horizontal]/timeline:w-[50%]`}
              />
            ) : null}

            <InfoCardTimeline
              index={index}
              currentIndex={currentIndex}
              event={{
                name: item.description,
                time: item.eventTime,
              }}
            />
          </TimelineHeader>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

import { AlertCircle } from "lucide-react";
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
import { formatInTimeZone } from "date-fns-tz";
import { DEFAULT_TIMEZONE } from "@/lib/consts";
import { timeToMinutes } from "@/utils/convertTimes";

interface TimelineBarberProps {
  timeline: TimelineArray | null;
}

export function TimelineBarber({ timeline }: TimelineBarberProps) {
  if (timeline === null) {
    return;
  }

  if (timeline.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-md border p-4">
        <AlertCircle className="h-10 w-10" />
        <span>Não há eventos para exibir neste dia.</span>
      </div>
    );
  }

  const nowMinutes = timeToMinutes(
    formatInTimeZone(new Date(), DEFAULT_TIMEZONE, "HH:mm"),
  );
  const nextEventIndex = timeline.findIndex(item => {
    return timeToMinutes(item.eventTime) > nowMinutes;
  });
  const value = nextEventIndex === -1 ? timeline.length : nextEventIndex + 1;

  return (
    <Timeline defaultValue={value} orientation="horizontal">
      {timeline?.map((item, index) => (
        <TimelineItem key={item.id} step={index + 1}>
          <TimelineHeader>
            <TimelineDate>{item.eventTime}</TimelineDate>
            <TimelineTitle className="text-xs sm:-mt-0.5">
              {item.description}
            </TimelineTitle>
            <TimelineSeparator />
            <TimelineIndicator />
          </TimelineHeader>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

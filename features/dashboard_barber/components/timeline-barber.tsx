import {
  Timeline,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/shared/components/ui/timeline";

const items = [
  {
    id: 1,
    title: "Inicio de trabalho",
    hour: "08:00",
  },
  {
    hour: "09:00",
    id: 2,
    title: "Corte de cabelo com Lucas",
  },
  {
    id: 3,
    title: "Inicio do horário de almoço",
    hour: "12:00",
  },
  {
    id: 4,
    hour: "14:00",
    title: "Fim do horário de almoço",
  },
  {
    id: 7,
    hour: "16:00",
    title: "Barba com Carlos",
  },
  {
    id: 6,
    hour: "19:00",
    title: "Fim do turno",
  },
];

interface TimelineBarberProps {
  timeline: {
    disponibility?: any;
    barberBreaks?: any;
    exceptionDates?: any;
    bookings?: any;
  } | null;
}

export function TimelineBarber({ timeline }: TimelineBarberProps) {
  if (timeline === null) {
    return;
  }

  return (
    <Timeline defaultValue={6} orientation="horizontal">
      {items.map(item => (
        <TimelineItem key={item.id} step={item.id}>
          <TimelineHeader>
            <TimelineSeparator />
            <TimelineDate>{item.hour}</TimelineDate>
            <TimelineTitle className="text-xs sm:-mt-0.5 lg:text-sm">
              {item.title}
            </TimelineTitle>
            <TimelineIndicator />
          </TimelineHeader>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

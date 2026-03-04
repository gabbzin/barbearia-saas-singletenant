"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          <CalendarIcon />
          {date ? (
            `${format(date, "dd/MM/yyyy")}`
          ) : (
            <span>Selecione uma data</span>
          )}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          required
          mode="single"
          selected={date}
          onSelect={date => {
            setDate(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

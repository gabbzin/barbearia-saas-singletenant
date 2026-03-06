import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
import { DatePicker } from "../date-picker";

type DateFieldFormProps<T extends FieldValues> = {
  name: Path<T>;
  setSelectedDate: (date: Date | undefined) => void;
};

export function DatePickerForm<T extends FieldValues>({
  name,
  setSelectedDate,
}: DateFieldFormProps<T>) {
  const { control } = useFormContext<T>();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          date={field.value ?? today}
          setDate={date => {
            field.onChange(date);
            setSelectedDate(date);
          }}
          before={today}
        />
      )}
    />
  );
}

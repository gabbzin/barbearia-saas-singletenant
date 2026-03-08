import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface SelectFormProps<T extends FieldValues> {
  name: Path<T>;
  placeholder?: string;
  groupLabels?: string;
  items: { value: string; label: string }[];
  disabled?: boolean;
}

export function SelectForm<T extends FieldValues>({
  name,
  placeholder,
  groupLabels,
  items,
  disabled,
}: SelectFormProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Select
          value={field.value}
          onValueChange={field.onChange}
          disabled={field.disabled || disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder ?? "Selecione uma opção"} />
          </SelectTrigger>
          <SelectContent>
            {groupLabels ? (
              <SelectGroup>
                <SelectLabel>{groupLabels}</SelectLabel>
                {items.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            ) : (
              <div>
                {items.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </div>
            )}
          </SelectContent>
        </Select>
      )}
    />
  );
}

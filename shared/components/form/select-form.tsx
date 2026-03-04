import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type SelectFormProps = {
  name?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  groupLabels?: string;
  items: { value: string; label: string }[];
};

export function SelectForm(props: SelectFormProps) {
  return (
    <Select
      value={props.value}
      onValueChange={props.onChange}
      name={props.name}
    >
      <SelectTrigger className="w-full max-w-sm">
        <SelectValue placeholder={props.placeholder ?? "Selecione uma opção"} />
      </SelectTrigger>
      <SelectContent>
        {props.groupLabels ? (
          <SelectGroup>
            <SelectLabel>{props.groupLabels}</SelectLabel>
            {props.items.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ) : (
          <div>
            {props.items.map(item => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </div>
        )}
      </SelectContent>
    </Select>
  );
}

import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface InputFormProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  placeholder?: string;
  type?: string;
  control?: Control<T>;
  classname?: string;
  disabled?: boolean;
  mask?: "currency" | "phone" | "";
  minLength?: number;
  maxLength?: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatPhone = (value: string) => {
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return value;
};

const InputForm = <T extends FieldValues>({
  label,
  type = "text",
  name,
  placeholder,
  control: propsControl,
  classname,
  disabled,
  mask,
  maxLength,
  minLength,
}: InputFormProps<T>) => {
  const context = useFormContext<T>();
  const control = propsControl || context?.control;

  if (!control) {
    throw new Error(
      "InputForm deve ser usado dentro de um FormProvider ou receber a prop 'control'.",
    );
  }

  return (
    <div className="space-y-2">
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value, ...field }, fieldState }) => {
          const inputValue =
            mask === "currency" && value !== undefined
              ? // Se for currency, formata o número que está no form para Texto (R$)
                formatCurrency(Number(value))
              : mask === "phone" && value !== undefined
                ? // Se for phone, formata o número que está no form para Texto ((99) 99999-9999)
                  formatPhone(String(value))
                : (value ?? "");
          return (
            <>
              <Label
                htmlFor={name}
                className={fieldState.error && "text-red-500"}
              >
                {label}
              </Label>
              <Input
                type={type}
                placeholder={placeholder}
                className={classname}
                disabled={disabled}
                {...field}
                value={inputValue}
                onChange={e => {
                  if (mask === "currency") {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    const numberValue = Number(rawValue) / 100;
                    onChange(numberValue);
                  } else if (mask === "phone") {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    onChange(rawValue);
                  } else {
                    onChange(e);
                  }
                }}
                maxLength={maxLength}
                minLength={minLength}
              />
              <p className="text-red-500 text-sm">
                {fieldState.error?.message}
              </p>
            </>
          );
        }}
      />
    </div>
  );
};

export default InputForm;

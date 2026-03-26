"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  type FieldValues,
  FormProvider,
  type UseFormProps,
  useForm,
} from "react-hook-form";
import type { ZodType } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface GenericFormProps<T extends FieldValues> extends UseFormProps<T> {
  schema: ZodType<T, FieldValues>;
  onSubmit: (data: T) => Promise<void> | void;
  children: React.ReactNode;
  submitText: string;
  buttons?: React.ReactNode;
  className?: string;
}

export default function GenericForm<T extends FieldValues>({
  schema,
  onSubmit,
  children,
  submitText,
  buttons,
  className,
  ...hookProps
}: GenericFormProps<T>) {
  const methods = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    ...hookProps,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-6", className)}
      >
        {children}
        <Buttons>
          <Button variant={"default"} type="submit" disabled={isSubmitting}>
            {methods.formState.isSubmitting ? "Enviando..." : submitText}
          </Button>
          {buttons}
        </Buttons>
      </form>
    </FormProvider>
  );
}

const Buttons = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-4 flex flex-col gap-2 font-bold">{children}</div>;
};

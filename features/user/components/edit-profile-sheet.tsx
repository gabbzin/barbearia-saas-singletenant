"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import GenericForm from "@/shared/components/form/generic-form";
import InputForm from "@/shared/components/form/input-form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import {
  editProfileSchema,
  type editProfileSchemaType,
} from "../schema/userSchema";

interface EditProfileSheetProps {
  children: React.ReactNode;
  name: string;
}

export function EditProfileSheet({ children, name }: EditProfileSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: editProfileSchemaType) => {
    try {
      await authClient.updateUser({ name: data.name });
      toast.success("Perfil atualizado com sucesso!");
      setIsOpen(false);
      router.refresh();
    } catch {
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Editar informações</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4">
          <GenericForm
            schema={editProfileSchema}
            onSubmit={handleSubmit}
            submitText="Salvar alterações"
            defaultValues={{ name }}
          >
            <InputForm
              name="name"
              label="Nome completo"
              placeholder="Seu nome completo"
            />
          </GenericForm>
        </div>
      </SheetContent>
    </Sheet>
  );
}

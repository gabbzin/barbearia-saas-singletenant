"use client";

import { useState } from "react";
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
  changePasswordSchema,
  type changePasswordSchemaType,
} from "../schema/userSchema";

interface ChangePasswordSheetProps {
  children: React.ReactNode;
}

export function ChangePasswordSheet({ children }: ChangePasswordSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (data: changePasswordSchemaType) => {
    try {
      await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Senha alterada com sucesso!");
      setIsOpen(false);
    } catch {
      toast.error("Erro ao alterar senha. Verifique a senha atual e tente novamente.");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Alterar senha</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-4">
          <GenericForm
            schema={changePasswordSchema}
            onSubmit={handleSubmit}
            submitText="Alterar senha"
          >
            <InputForm
              name="currentPassword"
              label="Senha atual"
              type="password"
              placeholder="Digite sua senha atual"
            />
            <InputForm
              name="newPassword"
              label="Nova senha"
              type="password"
              placeholder="Digite sua nova senha"
            />
            <InputForm
              name="confirmNewPassword"
              label="Confirmar nova senha"
              type="password"
              placeholder="Confirme sua nova senha"
            />
          </GenericForm>
        </div>
      </SheetContent>
    </Sheet>
  );
}

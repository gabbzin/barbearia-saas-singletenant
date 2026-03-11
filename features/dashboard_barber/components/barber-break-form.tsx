import type { BarberBreak } from "@prisma/client";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useServicesCRUD } from "@/features/service/hooks/useServices";
import {
  serviceSchema,
  type serviceSchemaType,
} from "@/features/service/schema/serviceSchema";
import GenericForm from "@/shared/components/form/generic-form";
import InputForm from "@/shared/components/form/input-form";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/shared/components/ui/dialog";

interface FormServiceProps {
  barberId: string;
  barberBreak: BarberBreak;
}

export function FormService({ barberId, barberBreak }: FormServiceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { createService, updateService, isCreating, isUpdating } =
    useServicesCRUD(barberId);

  const isEditing = !!barberBreak;

  const handleSubmit = async (data: serviceSchemaType) => {
    if (isEditing && barberBreak) {
      await updateService({ serviceId: barberBreak.id, ...data });
    } else {
      await createService({ barberId, ...data });
    }
    setIsOpen(false);
  };

  const isLoading = isEditing ? isUpdating : isCreating;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant={"secondary"} disabled={isLoading}>
            <PencilIcon />
          </Button>
        ) : (
          <div className="flex items-center justify-end gap-3">
            <span className="rounded bg-primary/90 px-2 py-1 text-background">
              Adicionar Intervalo
            </span>
            <Button
              size="icon"
              variant="secondary"
              className="h-14 w-14 rounded-full shadow-lg"
            >
              <PlusIcon className="size-4" />
            </Button>
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-bold text-xl">
            {isEditing ? "Editar Intervalo" : "Adicionar Intervalo"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isEditing
              ? "Altere os detalhes do intervalo abaixo."
              : "Preencha os detalhes do novo intervalo."}
          </DialogDescription>
        </DialogHeader>
        <GenericForm
          schema={serviceSchema}
          onSubmit={handleSubmit}
          submitText={isEditing ? "Salvar Alterações" : "Criar Intervalo"}
          disabled={isLoading}
        >
          <InputForm
            name="name"
            label="Nome do Intervalo"
            placeholder="Digite o nome do intervalo"
          />
          <InputForm
            name="price"
            label="Preço do Intervalo"
            placeholder="Digite o preço do intervalo"
            mask="currency"
          />
          <InputForm
            name="description"
            label="Descrição do Intervalo"
            placeholder="Digite a descrição do intervalo"
          />
        </GenericForm>
      </DialogContent>
    </Dialog>
  );
}

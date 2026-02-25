import type { BarberService } from "@prisma/client";
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
  service?: BarberService;
}

export function FormService({ barberId, service }: FormServiceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { createService, updateService, isCreating, isUpdating } = useServicesCRUD(barberId);

  const isEditing = !!service;

  const defaultValues: serviceSchemaType | undefined = service
    ? {
        name: service.name,
        price: Number(service.priceInCents) / 100,
        description: service.description,
      }
    : undefined;

  const handleSubmit = async (data: serviceSchemaType) => {
    if (isEditing && service) {
      await updateService({ serviceId: service.id, ...data });
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
              Adicionar Serviço
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
            {isEditing ? "Editar Serviço" : "Adicionar Serviço"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {isEditing
              ? "Altere os detalhes do serviço abaixo."
              : "Preencha os detalhes do novo serviço."}
          </DialogDescription>
        </DialogHeader>
        <GenericForm
          schema={serviceSchema}
          onSubmit={handleSubmit}
          defaultValues={defaultValues}
          submitText={isEditing ? "Salvar Alterações" : "Criar Serviço"}
          disabled={isLoading}
        >
          <InputForm
            name="name"
            label="Nome do Serviço"
            placeholder="Digite o nome do serviço"
          />
          <InputForm
            name="price"
            label="Preço do Serviço"
            placeholder="Digite o preço do serviço"
            mask="currency"
          />
          <InputForm
            name="description"
            label="Descrição do Serviço"
            placeholder="Digite a descrição do serviço"
          />
        </GenericForm>
      </DialogContent>
    </Dialog>
  );
}

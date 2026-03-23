import CancelAlertDialog from "@/features/booking/components/cancel-booking-alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useServicesCRUD } from "../hooks/useServices";

interface ServiceDialogProps {
  serviceId: string;
  title: string;
  description: string;
  price: string;
  children: React.ReactNode;
  barberId: string;
}

export function ServiceDialog({
  serviceId,
  title,
  description,
  price,
  children,
  barberId,
}: ServiceDialogProps) {
  const { deleteService, isLoading } = useServicesCRUD(barberId);

  return (
    <Dialog>
      <DialogTrigger className="cursor-pointer" asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Informações do serviço</DialogTitle>
        </DialogHeader>
        <p>
          <span className="font-semibold">Serviço selecionado:</span> {title}
        </p>
        <p>
          <span className="font-semibold">Descrição:</span> {description}
        </p>
        <p>
          <span className="font-semibold">Preço:</span> {price}
        </p>
        <DialogFooter>
          <div>
            <CancelAlertDialog
              title="Deletar serviço"
              description="Tem certeza que deseja deletar este serviço? Esta ação não pode ser desfeita."
              loadingText="Deletando..."
              confirmText="Sim, deletar"
              handleCancel={() => deleteService(serviceId)}
              isLoading={isLoading}
            />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import type React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";

interface ConfirmBookingAlertProps {
  handleConfirm: () => void;
  otherAction?: () => void;
  otherActionText?: string;
  isLoading: boolean;
  title: string;
  description?: React.ReactNode;
  cancelButtonText?: string;
  children?: React.ReactNode;
  infos?: React.ReactNode;
}

export default function ConfirmAlertDialog({
  handleConfirm,
  otherAction,
  otherActionText,
  isLoading,
  title,
  description,
  cancelButtonText,
  children,
  infos,
}: ConfirmBookingAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="default" className="flex-1 rounded-full">
            {title}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col gap-8">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ||
              "Tem certeza que deseja executar esta ação? Esta ação não pode ser desfeita."}
            <br />
            <br />
            {infos && <span className="mt-4">{infos}</span>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="grid">
          <AlertDialogAction
            onClick={otherAction}
            disabled={isLoading}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            {isLoading ? "Executando..." : otherActionText || "Outra ação"}
          </AlertDialogAction>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? "Executando..." : "Sim, executar ação"}
          </AlertDialogAction>
          <AlertDialogCancel
            disabled={isLoading}
            className="bg-destructive/80 hover:bg-destructive/90"
          >
            {cancelButtonText || "Não, fechar ação"}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

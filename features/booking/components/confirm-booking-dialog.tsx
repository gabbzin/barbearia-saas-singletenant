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
  isLoading: boolean;
  title: string;
  description?: React.ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  children?: React.ReactNode;
  infos?: React.ReactNode;
}

export default function ConfirmAlertDialog({
  handleConfirm,
  isLoading,
  title,
  description,
  confirmButtonText,
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
          <AlertDialogTitle className="text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ||
              "Tem certeza que deseja executar esta ação? Esta ação não pode ser desfeita."}
            <br />
            <br />
            {infos && <span className="mt-4">{infos}</span>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-1 flex-row justify-end gap-2">
          <AlertDialogCancel
            disabled={isLoading}
            className="bg-secondary/80 hover:bg-secondary/90"
          >
            {cancelButtonText || "Cancelar"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading
              ? "Executando..."
              : confirmButtonText || "Sim, tenho certeza"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

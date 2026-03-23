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
} from "../../../shared/components/ui/alert-dialog";
import { Button } from "../../../shared/components/ui/button";

interface CancelAlertDialogProps {
  handleCancel: () => void;
  isLoading: boolean;
  title: string;
  description?: React.ReactNode;
  cancelButtonText?: string;
  loadingText?: string;
  confirmText?: string;
  children?: React.ReactNode;
}

export default function CancelAlertDialog({
  handleCancel,
  isLoading,
  title,
  description,
  cancelButtonText,
  loadingText,
  confirmText,
  children,
}: CancelAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="destructive" className="flex-1 rounded-full">
            {title}
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description ||
              "Tem certeza que deseja cancelar esta ação? Esta ação não pode ser desfeita."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelButtonText || "Não, manter"}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading
              ? loadingText || "Cancelando..."
              : confirmText || "Sim, cancelar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

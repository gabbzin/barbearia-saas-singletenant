import { useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordButton() {
  const { trigger, getValues } = useFormContext();

  const handleRecover = async () => {
    const isValid = await trigger("email");

    if (isValid) {
      const email = getValues("email");

      await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      toast.success("Email de recuperação enviado!");
    } else {
      toast.error("Por favor, digite um email válido primeiro.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleRecover}
      className="absolute right-0 text-blue-500 text-sm hover:underline"
    >
      Esqueceu a senha?
    </button>
  );
}

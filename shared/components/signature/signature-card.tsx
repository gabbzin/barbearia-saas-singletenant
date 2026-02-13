import { CheckCircleIcon, InfoIcon } from "lucide-react";
import { Alert, AlertTitle } from "../ui/alert";
import { format } from "date-fns";

interface SignatureCardProps {
  hasPlan: boolean;
  name?: string;
  validUntil?: string;
  className?: string;
}

export function SignatureCard(plan: SignatureCardProps) {
  const validUntil = plan.validUntil
    ? format(plan.validUntil, "dd/MM/yyyy")
    : "data desconhecida";

  return (
    <Alert
      variant={plan.hasPlan ? "success" : "info"}
      className={plan.className ?? "mt-4"}
    >
      <AlertTitle>
        {plan.hasPlan ? (
          <div className="flex items-center gap-3">
            <CheckCircleIcon />
            <div>
              <p>Você está no plano {plan.name}</p>
              <p className="text-muted-foreground">Válido até {validUntil}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <InfoIcon />
            Você não possui um plano ativo.
          </div>
        )}
      </AlertTitle>
    </Alert>
  );
}

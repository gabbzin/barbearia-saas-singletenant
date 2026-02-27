import { format } from "date-fns";
import { CheckCircleIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { Alert, AlertTitle } from "@/shared/components/ui/alert";
import { clientRoutes } from "@/shared/constants/routes";

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
            <p>
              Você não possui um plano ativo. <br />
              <Link
                href={clientRoutes.signature}
                className="font-semibold underline"
              >
                Deseja assinar?
              </Link>
            </p>
          </div>
        )}
      </AlertTitle>
    </Alert>
  );
}

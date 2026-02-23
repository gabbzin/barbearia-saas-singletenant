"use client";
import type { Plan } from "@prisma/client";
import { Check } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { createSignature } from "@/features/signature/actions/create-signature";
import { cn } from "@/lib/utils";
import { convertCapitalize } from "@/utils/convertCapitalize";
import { AuroraText } from "../../../shared/components/ui/aurora-text";
import { Button } from "../../../shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card";
import { CarouselItem } from "../../../shared/components/ui/carousel";
import { ShimmerButton } from "../../../shared/components/ui/shimmer-button";

type SignatureItemProps = {
  plan: Plan;
  myPlanName?: string | null;
};

const SignatureItem = ({ plan, myPlanName }: SignatureItemProps) => {
  const { executeAsync, isPending } = useAction(createSignature);

  // const priceInReais = convertBRL(plan.priceInCents);

  const isCurrentPlan = myPlanName === plan.name;

  const handleConfirm = async () => {
    const data = {
      planId: plan.id,
    };

    const result = await executeAsync(data);

    if (result.serverError || result.validationErrors) {
      toast.error(result.validationErrors?._errors?.[0]);
      return;
    }

    if (result.data && "url" in result.data) {
      if (result.data.url) {
        window.location.href = result.data.url;
        return;
      }
    }
    toast.success("Assinatura realizada com sucesso!");
  };

  return (
    <CarouselItem className="relative p-4 md:basis-1/2 lg:basis-1/3">
      <Card
        className={cn(
          "relative flex h-full flex-col transition-all duration-300 hover:shadow-2xl",
          isCurrentPlan
            ? "z-20 scale-105 border-primary shadow-primary/20"
            : "border-border shadow-md",
        )}
      >
        {isCurrentPlan && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 font-bold text-[10px] text-primary-foreground uppercase tracking-widest shadow-lg">
            Plano Atual
          </div>
        )}

        <CardHeader className="space-y-2 pt-8 text-center">
          <CardTitle className="font-bold text-2xl uppercase tracking-tight">
            {isCurrentPlan ? (
              convertCapitalize(plan.name)
            ) : (
              <AuroraText>{convertCapitalize(plan.name)}</AuroraText>
            )}
          </CardTitle>

          <div className="flex items-baseline justify-center gap-1">
            <span className="font-bold text-2xl">R$</span>
            <span className="font-extrabold text-5xl tracking-tighter">
              {plan.priceInCents / 100}
            </span>
            <span className="font-medium text-muted-foreground">/mês</span>
          </div>
          <CardDescription className="text-xs">
            Ideal para quem está{" "}
            {plan.name === "PRO" ? "escalando" : "começando"}
          </CardDescription>
        </CardHeader>

        <CardContent className="flex-1 py-6">
          <div className="space-y-4">
            <p className="font-semibold text-foreground/70 text-sm">
              O que está incluso:
            </p>
            <ul className="space-y-3">
              {/* Aqui você pode mapear uma array de benefícios vinda do banco ou mockada */}
              {[
                plan.description,
                "Suporte prioritário",
                "Relatórios mensais",
              ].map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="mt-1 rounded-full bg-emerald-500/10 p-0.5">
                    <Check className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>

        <CardFooter className="pb-8">
          {isCurrentPlan ? (
            <Button
              className="w-full cursor-default bg-muted text-muted-foreground hover:bg-muted"
              variant="outline"
            >
              Plano Ativo
            </Button>
          ) : (
            <ShimmerButton
              onClick={handleConfirm}
              disabled={isPending}
              className="w-full shadow-2xl transition-transform active:scale-95"
            >
              <span className="whitespace-pre-wrap text-center font-medium text-sm text-white leading-none tracking-tight lg:text-lg dark:from-white dark:to-slate-900/10">
                Fazer Upgrade
              </span>
            </ShimmerButton>
          )}
        </CardFooter>
      </Card>
    </CarouselItem>
  );
};

export default SignatureItem;

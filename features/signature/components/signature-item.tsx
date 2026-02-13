"use client";
import type { Plan } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { createSignature } from "@/features/signature/actions/create-signature";
import { convertBRL } from "@/utils/convertBRL";
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
import { Separator } from "../../../shared/components/ui/separator";
import { ShimmerButton } from "../../../shared/components/ui/shimmer-button";

type SignatureItemProps = {
  plan: Plan;
  myPlanName?: string | null;
};

const SignatureItem = ({ plan, myPlanName }: SignatureItemProps) => {
  const { executeAsync, isPending } = useAction(createSignature);

  const priceInReais = convertBRL(plan.priceInCents);

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
    <CarouselItem className="relative md:basis-1/2 lg:basis-1/3">
      {myPlanName?.toLowerCase() === plan.name.toLowerCase() ? (
        <div className="absolute m-auto rounded-tl-2xl rounded-br-lg bg-foreground px-2 font-semibold text-background text-sm">
          Plano atual
        </div>
      ) : (
        ""
      )}
      <Card className="z-10 border-2 shadow-lg dark:border-white">
        <CardHeader className="mt-5 text-center">
          <CardTitle className="font-bold text-4xl">
            <AuroraText className="font-geist">
              {convertCapitalize(plan.name)}
            </AuroraText>
          </CardTitle>
          <CardDescription>
            <p className="whitespace-pre font-bold text-3xl text-card-foreground text-md leading-[1.4]">
              {priceInReais.split(",")[0]}/mês
            </p>
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-2">
          <Separator className="my-6 py-px" />
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
            <li>{plan.description}</li>
            <li>2º Beneficio</li>
            <li>3º Beneficio</li>
            <li>4º Beneficio</li>
            <li>5º Beneficio</li>
          </ul>
        </CardContent>

        <CardFooter className="mt-6 flex items-end justify-between">
          <Button className="w-full" asChild>
            <ShimmerButton
              onClick={handleConfirm}
              disabled={isPending}
              className="dark:bg-white dark:text-white"
            >
              Assine aqui
            </ShimmerButton>
          </Button>
        </CardFooter>
      </Card>
    </CarouselItem>
  );
};

export default SignatureItem;

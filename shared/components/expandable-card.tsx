"use client";

import { CheckIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { createSignature } from "@/features/signature/actions/create-signature";
import type { SubscriptionInfo } from "@/features/user/repository/user.repository";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

interface ExpandableCardProps {
  plans: {
    name: string;
    imageUrl: string | null;
    id: string;
    benefits: string[];
    createdAt: Date;
    updatedAt: Date;
    priceInCents: number;
    description: string;
    stripePriceId: string | null;
  }[];

  myPlan: SubscriptionInfo;
}

export default function ExpandableCard({ plans, myPlan }: ExpandableCardProps) {
  const { executeAsync, isPending } = useAction(createSignature);

  const MotionButton = motion(Button);

  const [active, setActive] = useState<(typeof plans)[number] | boolean | null>(
    null,
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const imageFallback = "/banner-barber.png";

  const handleConfirm = async (planId: string) => {
    const result = await executeAsync({ planId });

    if (result.serverError || result.validationErrors) {
      toast.error(
        result.validationErrors?._errors?.[0] || "Erro ao processar assinatura",
      );
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
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full bg-black/20"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 z-100 grid place-items-center">
            {/* Botão de fechar o card */}
            <MotionButton
              key={`button-${active.name}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white lg:hidden"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </MotionButton>
            {/* Conteúdo do card expandido */}
            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={ref}
              className="flex h-full w-full max-w-125 flex-col overflow-hidden bg-white sm:rounded-3xl md:h-fit md:max-h-[90%] dark:bg-neutral-900"
            >
              {/* Imagem do card */}
              <motion.div layoutId={`image-${active.name}-${id}`}>
                <Image
                  width={200}
                  height={200}
                  src={active.imageUrl ?? imageFallback}
                  alt={active.name}
                  className="h-60 w-full object-cover object-top sm:rounded-tl-lg sm:rounded-tr-lg lg:h-60"
                />
              </motion.div>

              {/* Header do card */}
              <div>
                <div className="flex items-start justify-between p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.name}-${id}`}
                      className="font-bold text-neutral-700 text-xl dark:text-neutral-200"
                    >
                      Plano {active.name}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>
                </div>

                <Separator className="p-0.5" />

                {/* Body do card */}
                <div className="relative px-4 pt-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-50 flex-col items-start gap-4 overflow-auto pb-10 text-neutral-600 text-sm [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] md:h-fit md:text-sm lg:text-base dark:text-neutral-400"
                  >
                    <p className="font-bold">Beneficios:</p>
                    {active.benefits ? (
                      active.benefits.map((benefit, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: <Aqui pode usar index como key porque a lista de benefícios é estática e não sofre alterações dinâmicas>
                        <div key={index} className="flex items-start gap-2">
                          <CheckIcon className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs">Benefícios não informados</p>
                    )}
                  </motion.div>
                  <MotionButton
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    variant={"default"}
                    className="absolute right-4 bottom-4 rounded-full"
                    onClick={() => handleConfirm(active.id)}
                    disabled={myPlan.name === active.name || isPending}
                  >
                    {myPlan.name === active.name
                      ? "Plano Atual"
                      : isPending
                        ? "Processando..."
                        : "Assinar Plano"}
                  </MotionButton>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      {/* Lista de assinaturas (Card não expandido) */}
      <ul className="mx-auto grid w-full max-w-2xl gap-4">
        {plans.map((card, _index) => (
          <motion.div
            layoutId={`card-${card.name}-${id}`}
            key={`card-${card.name}-${id}`}
            onClick={() => setActive(card)}
            className="flex cursor-pointer flex-col items-center justify-between rounded-xl border-2 p-4 shadow-lg hover:bg-neutral-50 md:flex-row dark:hover:bg-neutral-800"
          >
            <div className="flex w-full flex-col items-center gap-4 md:flex-row">
              <motion.div layoutId={`image-${card.name}-${id}`}>
                <Image
                  width={100}
                  height={100}
                  src={card.imageUrl ?? imageFallback}
                  alt={card.name}
                  className="h-40 w-full rounded-lg object-cover object-center md:h-20 md:w-20"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.name}-${id}`}
                  className="text-center font-semibold text-lg text-neutral-800 md:text-left dark:text-neutral-200"
                >
                  Plano {card.name}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-center text-neutral-600 md:text-left dark:text-neutral-400"
                >
                  {card.description} e outros benefícios incríveis!
                </motion.p>
                <motion.p
                  layoutId={`price-${card.priceInCents}-${id}`}
                  className="text-center font-bold text-black md:text-left dark:text-neutral-400"
                >
                  R$ {card.priceInCents / 100}/mês
                </motion.p>
              </div>
            </div>
            <MotionButton
              layoutId={`button-${card.name}-${id}`}
              className="mt-4 rounded-full md:mt-0"
              variant={"default"}
              disabled={myPlan.name === card.name}
            >
              {myPlan.name === card.name ? "Plano Atual" : "Ver detalhes"}
            </MotionButton>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: <Relaxa paizão>
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

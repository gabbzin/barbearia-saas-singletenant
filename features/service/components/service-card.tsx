"use client";

import type { BarberService } from "@prisma/client";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { convertBRL } from "@/utils/convertBRL";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ArrowRightIcon, ShoppingCartIcon } from "lucide-react";
import { useCartStore } from "@/features/cart/store/cart.store";
import { toast } from "sonner";

interface ServiceCardProps {
  service: BarberService;
}

interface handleAddToCartProps {
  serviceId: string;
  serviceName: string;
  price: number;
  duration: number;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const addItem = useCartStore(state => state.addItem);
  const priceInReais = convertBRL(service.priceInCents);
  const priceAgreed =
    service.priceInCents === 0 ? "Valor a combinar" : priceInReais;

  const handleAddToCart = (item: handleAddToCartProps, barberId: string) => {
    const { success, message } = addItem(item, barberId);
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <Card variant={"basic"} className="relative p-2 font-inter">
      <CardContent className="flex items-center justify-center gap-5 p-0">
        <div className="relative size-27.5 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex grow basis-0 flex-row items-center self-stretch py-1">
          <div className="mt-2 flex w-full flex-col items-start gap-1 self-start text-sm leading-[1.4]">
            <p className="w-full font-bold text-card-foreground text-md xl:text-lg">
              {service.name}
            </p>
            <p className="line-clamp-2 w-full font-normal text-muted-foreground text-xs">
              {service.description}
            </p>
          </div>

          <div className="self-end">
            <div className="absolute top-4 right-0 rounded-l-sm border border-border border-r-0 bg-gold px-2 py-1 font-bold font-inter text-background text-sm">
              <p className="line-clamp-2 font-inter">{priceAgreed}</p>
            </div>
            <Button
              className="ml-6 rounded-full font-bold text-xs sm:ml-1"
              variant={"forest"}
              size={"sm"}
              onClick={() =>
                handleAddToCart(
                  {
                    serviceId: service.id,
                    serviceName: service.name,
                    price: service.priceInCents,
                    duration: service.durationInMinutes,
                  },
                  service.barberId,
                )
              }
            >
              <span className="hidden sm:block">Reservar</span>
              <ShoppingCartIcon className="size-4 sm:hidden" />
              <ArrowRightIcon className="hidden size-4 sm:block" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

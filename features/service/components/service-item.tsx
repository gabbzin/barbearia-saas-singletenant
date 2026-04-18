"use client";

import { useCartStore, type CartItem } from "@/features/cart/store/cart.store";
import { Button } from "@/shared/components/ui/button";
import { convertBRL } from "@/utils/convertBRL";
import { toast } from "sonner";

interface ServiceItemProps {
  item: CartItem;
}

function ServiceItemContainer({ children }: { children: React.ReactNode }) {
  return <div className="flex justify-between px-2">{children}</div>;
}

export function ServiceItem({ item }: ServiceItemProps) {
  const { serviceId: id, serviceName: name, duration, price } = item;

  const removeItem = useCartStore(state => state.removeItem);
  const priceInReais = convertBRL(price);

  const handleRemoveToCart = (id: string) => {
    const { success, message } = removeItem(id);

    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="flex flex-col border-b py-3 font-poppins">
      <ServiceItemContainer>
        <p className="font-newsreader font-semibold text-lg sm:text-xl">
          {name}
        </p>
        <p className="font-bold font-inter text-gold-strong text-sm sm:text-base">
          {priceInReais}
        </p>
      </ServiceItemContainer>
      <ServiceItemContainer>
        <p className="text-muted-foreground text-xs sm:text-sm">
          Duração: {duration}min
        </p>
        <Button
          variant={"ghost"}
          className="h-fit w-fit p-0 font-semibold text-destructive text-xs uppercase"
          onClick={() => handleRemoveToCart(id)}
        >
          Remover
        </Button>
      </ServiceItemContainer>
    </div>
  );
}

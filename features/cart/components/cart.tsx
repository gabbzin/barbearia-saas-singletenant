"use client";

import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Button } from "@/shared/components/ui/button";
import { CartButton } from "./cart-button";
import { Separator } from "@/shared/components/ui/separator";
import { ServiceItem } from "@/features/service/components/service-item";
import { useCartStore } from "../store/cart.store";
import { FrownIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { convertBRL } from "@/utils/convertBRL";
import { CheckoutView } from "./checkout-view";

type CheckoutStep = "CART" | "CHECKOUT" | "CONFIRMATION";

export function Cart() {
  // Variáveis de estado para controlar o carrinho e o processo de checkout (formulário)
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("CART");

  // Variável de estado para armazenar os itens do carrinho
  const {
    items: itemsInCart,
    getTotalPrice,
    getTotalDuration,
    clearCart,
  } = useCartStore();
  const itemsCount = itemsInCart.length;

  const totalPrice = convertBRL(getTotalPrice());
  const totalDuration = getTotalDuration();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    if (!open) {
      setTimeout(() => setCurrentStep("CART"), 300);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <CartButton className={isOpen ? "hidden" : ""} items={itemsCount} />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="font-inter font-semibold text-xl tracking-tight">
            {currentStep === "CART" ? "Meu Carrinho" : "Checkout"}
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <main className="flex-1 overflow-y-auto px-4 py-1">
          {currentStep === "CART" &&
            (itemsCount === 0 ? (
              <div className="grid h-full place-items-center text-muted-foreground">
                <div className="flex flex-col items-center">
                  <FrownIcon />
                  <h4 className="mt-2 font-inter font-semibold text-lg">
                    Seu carrinho está vazio.
                  </h4>
                  <p className="text-center font-inter text-xs">
                    Adicione serviços para agendar um horário.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col">
                <div className="flex-1 overflow-y-auto">
                  {itemsInCart.map(item => (
                    <ServiceItem key={item.serviceId} item={item} />
                  ))}
                </div>

                <SheetFooter className="p-0 py-2">
                  <Card variant={"basic"}>
                    <CardContent className="font-inter">
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-muted-foreground">Duração Total:</p>
                        <p>{totalDuration} minutos</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <p className="text-muted-foreground">Valor Total:</p>
                        <p>{totalPrice}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-6 space-y-2">
                    <Button
                      className="w-full"
                      onClick={() => setCurrentStep("CHECKOUT")}
                      disabled={itemsCount === 0}
                    >
                      Avançar para agendamento
                    </Button>
                    <SheetClose asChild>
                      <Button
                        className="w-full"
                        variant={"destructive"}
                        onClick={() => clearCart()}
                      >
                        Limpar carrinho
                      </Button>
                    </SheetClose>
                  </div>
                </SheetFooter>
              </div>
            ))}

          {currentStep === "CHECKOUT" && <CheckoutView />}
        </main>
      </SheetContent>
    </Sheet>
  );
}

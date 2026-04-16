"use client";

import { ShoppingCartIcon } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { useBookingCart } from "../store/cart.store";

export function Cart() {
  const itemsInCart = useBookingCart(state => state.items.length);

  return (
    <div className="fixed right-8 bottom-8 z-1000 cursor-pointer rounded-full border border-border/50 bg-background p-4 text-white shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-110">
      <ShoppingCartIcon className="size-5 text-foreground" />
      <Badge className="absolute -top-1 -right-2 size-5 rounded-full bg-red-500 px-1 font-bold text-white text-xs">
        {itemsInCart}
      </Badge>
    </div>
  );
}

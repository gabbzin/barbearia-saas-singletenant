import type { ComponentProps } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";

type CartButtonProps = ComponentProps<typeof Button> & { items: number };

export function CartButton(props: CartButtonProps) {
  return (
    <Button
      {...props}
      className={`fixed right-8 bottom-8 z-1000 cursor-pointer rounded-full border border-border/50 bg-background p-5 text-white shadow-lg shadow-primary/30 transition-transform duration-300 hover:scale-110 ${props.className}`}
      variant={"ghost"}
      size={"icon-lg"}
    >
      <ShoppingCartIcon className="size-5 text-foreground" />
      <Badge className="absolute -top-1 -right-2 size-5 rounded-full bg-red-500 px-1 font-bold text-white text-xs">
        {props.items}
      </Badge>
    </Button>
  );
}

"use client";

import { UserIcon } from "lucide-react";
import { useUserStore } from "@/stores/user.store";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";
import { Button } from "../components/ui/button";
import { PhotoAndName } from "./photo-and-name";

export function Header() {
  const user = useUserStore(s => s.user);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 bg-background p-4 md:px-6 lg:px-8">
      <PhotoAndName
        emoji="👋"
        name={user?.name ?? "Usuário"}
        imageUrl={user?.imageUrl}
        mutedPhrase="Bem vindo de volta!"
        enabledGoldEffect={true}
      />
      <div className="flex items-center gap-2">
        <AnimatedThemeToggler />
        <Button variant={"outline"}>
          <div className="flex items-center gap-2">
            <UserIcon />
            Meu perfil
          </div>
        </Button>
      </div>
    </header>
  );
}

"use client";

import { UserIcon } from "lucide-react";
import Image from "next/image";
import { useUserStore } from "@/stores/user.store";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";
import { Button } from "../components/ui/button";

export function Header() {
  const user = useUserStore(s => s.user);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 bg-background p-4 md:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <Image
          src={user?.imageUrl || "/default-avatar.png"}
          width={40}
          height={40}
          alt="Avatar"
          className="rounded-full border-2 border-foreground object-cover shadow-gold/20 shadow-lg dark:border-gold"
        />
        <div className="flex flex-col leading-none">
          <p className="text-muted-foreground text-xs">Bem vindo de volta!</p>
          <h2 className="font-sans font-semibold text-md">
            {user?.name} <span className="font-sans">👋</span>
          </h2>
        </div>
      </div>
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

"use client";

import { UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user.store";
import { publicRoutes } from "../constants/routes";
import { PhotoAndName } from "./photo-and-name";
import { SidebarMenu } from "./sidebar-menu";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import { Button } from "./ui/button";

export function Header() {
  const user = useUserStore(s => s.user);
  const { replace } = useRouter();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
        <Button
          variant={"outline"}
          className="flex items-center gap-2"
          onClick={() => replace(publicRoutes.profile)}
        >
          <UserIcon />
          {width > 640 && "Meu Perfil"}
        </Button>
        <SidebarMenu
          isSubscriber={user?.subscription?.hasPlan ?? false}
          role={user?.role ?? "USER"}
        />
      </div>
    </header>
  );
}

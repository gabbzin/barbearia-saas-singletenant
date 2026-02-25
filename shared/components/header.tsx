"use client";

import { useHeaderData } from "@/shared/hooks/useHeaderData";
import { LogoLink } from "./logo-link";
import { SidebarMenu } from "./sidebar-menu";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

const Header = () => {
  const { data } = useHeaderData();

  const barbers = data?.barbers || [];
  const isSubscriber = data?.isSubscriber || { hasPlan: false };
  const role = data?.session?.role ?? "USER";

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b-2 bg-background px-5 py-2">
      <LogoLink />
      <div className="flex items-center gap-2">
        <AnimatedThemeToggler />
        <SidebarMenu
          barbers={barbers}
          isSubscriber={isSubscriber.hasPlan}
          role={role}
        />
      </div>
    </header>
  );
};

export default Header;

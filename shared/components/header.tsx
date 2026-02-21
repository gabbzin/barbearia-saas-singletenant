"use client";

import type { userRole } from "@prisma/client";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";
import { getHeaderData } from "@/shared/actions/get-header-data";
import { LogoLink } from "./logo-link";
import { SidebarMenu } from "./sidebar-menu";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";

const Header = () => {
  // biome-ignore lint/suspicious/noExplicitAny: <Tá podendo>
  const [barbers, setBarbers] = useState<any[]>([]);
  const [isSubscriber, setIsSubscriber] = useState<{ hasPlan: boolean }>({
    hasPlan: false,
  });
  const [role, setRole] = useState<userRole | string | undefined>("USER");

  const { executeAsync } = useAction(getHeaderData);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const result = await executeAsync();
      if (!mounted) return;
      if (result?.serverError || result?.validationErrors) return;

      const data = result?.data;
      setBarbers(data?.barbers || []);
      setIsSubscriber(data?.isSubscriber || { hasPlan: false });
      setRole(data?.session?.role ?? "USER");
    })();

    return () => {
      mounted = false;
    };
  }, [executeAsync]);

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

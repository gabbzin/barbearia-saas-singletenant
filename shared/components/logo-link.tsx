"use client";

import Image from "next/image";
import { redirect } from "next/navigation";

export function LogoLink() {
  const handleLogoClick = () => {
    redirect("/");
  };

  return (
    <h1 onClick={handleLogoClick} className="cursor-pointer font-bold text-2xl">
      Barbearia X
    </h1>
  );
}

"use client";

import Image from "next/image";
import { redirect } from "next/navigation";
import { imagePaths } from "@/shared/constants/images";

export function LogoLink() {
  const handleLogoClick = () => {
    redirect("/");
  };

  const pixels = 50;

  return (
    <Image
      src={imagePaths.logoRedonda}
      alt="Logo da Barbearia"
      // fill
      width={pixels}
      height={pixels}
      className="fill cursor-pointer rounded-full object-center"
      onClick={handleLogoClick}
    />
  );
}

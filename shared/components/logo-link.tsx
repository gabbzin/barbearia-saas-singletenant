"use client";

import Image from "next/image";
import { redirect } from "next/navigation";

export function LogoLink() {
  const handleLogoClick = () => {
    redirect("/");
  };

  const pixels = 70;

  return (
    <Image
      src={"/logo.png"}
      alt="Logo da Barbearia 2W"
      // fill
      width={pixels}
      height={pixels}
      className="fill cursor-pointer rounded-full object-center"
      onClick={handleLogoClick}
    />
    // <h1 onClick={handleLogoClick} className="cursor-pointer font-bold text-2xl">
    //   Barbearia X
    // </h1>
  );
}

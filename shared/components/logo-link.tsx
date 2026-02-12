"use client";

import Image from "next/image";
import { redirect } from "next/navigation";

export function LogoLink() {
  const handleLogoClick = () => {
    redirect("/");
  };

  return (
    <Image
      src={"/logo.jpeg"}
      alt="Logo da Barbearia 2W"
      width={75}
      height={75}
      className="rounded-full self-center cursor-pointer object-center"
    />
    // <h1 onClick={handleLogoClick} className="cursor-pointer font-bold text-2xl">
    //   Barbearia X
    // </h1>
  );
}

import Image from "next/image";
import { imagePaths } from "@/shared/constants/images";
import RecoverPassword from "./recover-form";

export default function RecoverPasswordPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <Image
        src={imagePaths.authBackground}
        alt="Background"
        fill
        className="-z-10 object-cover brightness-50"
      />
      <RecoverPassword />
    </main>
  );
}

import Image from "next/image";
import { imagePaths } from "@/shared/constants/images";
import LoginForm from "./login-form";

export default function LoginPage() {

  const src = imagePaths.authBackground;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <Image
        src={src}
        alt="background"
        fill
        className="-z-10 object-cover brightness-50"
      />
      <LoginForm />
    </main>
  );
}

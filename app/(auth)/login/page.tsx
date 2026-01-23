import Image from "next/image";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-4">
      <Image
        src={"/Background.png"}
        alt="Background"
        fill
        className="-z-10 object-cover brightness-50"
      />
      <LoginForm />
    </main>
  );
}

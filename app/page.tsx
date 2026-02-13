import { redirect } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";

export default async function Home() {
  const session = await verifySession();

  if (!session) {
    return redirect("/login");
  }

  if (session.role === "BARBER") {
    return redirect("/barber/dashboard");
  }

  return redirect("/(user)");
}

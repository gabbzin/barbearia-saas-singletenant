import { notFound } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import { PageSection } from "@/shared/components/ui/page";
import { ExceptionsCard } from "./components/exceptions-card";

export default async function BarberExceptionsPage() {
  const session = await verifySession();

  if (!session || (session.role !== "BARBER" && session.role !== "ADMIN")) {
    return notFound();
  }

  if (!session.barberId) {
    return (
      <main>
        <PageSection>
          <h1 className="mb-4 font-bold text-xl">Exceções de Agenda</h1>
          <p className="text-muted-foreground text-sm">
            Nenhum barbeiro vinculado à sua conta.
          </p>
        </PageSection>
      </main>
    );
  }

  return (
    <main>
      <PageSection>
        <h1 className="mb-4 font-bold text-xl">Exceções de Agenda</h1>
        <ExceptionsCard barberId={session.barberId} />
      </PageSection>
    </main>
  );
}

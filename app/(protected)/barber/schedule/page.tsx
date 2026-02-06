import { notFound } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import Header from "@/shared/components/header";
import { PageContainer } from "@/shared/components/ui/page";
import { ScheduleCard } from "./components/schedule-card";

export default async function BarberSchedulePage() {
  const session = await verifySession();

  if (!session || session.role !== "BARBER" || !session.barberId) {
    return notFound();
  }

  return (
    <div>
      <Header />
      <main>
        <PageContainer>
          <h1 className="mb-4 font-bold text-xl">Agenda Completa</h1>
          <ScheduleCard barberId={session.barberId} />
        </PageContainer>
      </main>
    </div>
  );
}

import { notFound } from "next/navigation";
import { verifySession } from "@/features/user/repository/user.repository";
import { PageSection } from "@/shared/components/ui/page";
import { ScheduleCard } from "./components/schedule-card";

export default async function BarberSchedulePage() {
  const session = await verifySession();

  if (!session || session.role !== "BARBER" || !session.barberId) {
    return notFound();
  }

  return (
    <main>
      <PageSection>
        <h1 className="mb-4 font-bold text-xl">Agenda Completa</h1>
        <ScheduleCard />
      </PageSection>
    </main>
  );
}

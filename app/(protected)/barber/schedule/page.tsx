import { PageSection } from "@/shared/components/ui/page";
import { ScheduleCard } from "./components/schedule-card";

export default async function BarberSchedulePage() {
  return (
    <main>
      <PageSection>
        <h1 className="mb-4 font-bold text-xl">Agenda Completa</h1>
        <ScheduleCard />
      </PageSection>
    </main>
  );
}

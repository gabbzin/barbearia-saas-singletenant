import { BookingSkeleton } from "@/features/booking/components/booking-skeleton";
import { PageContainer, PageSection } from "@/shared/components/ui/page";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-1 flex-col justify-between">
      <div>
        <PageContainer>
          {/* Título estático para não pular layout */}
          <h1 className="mb-4 font-bold text-xl">Agendamentos</h1>

          {/* Simulando as Tabs (Opcional, mas fica chique) */}
          <div className="mb-6 flex gap-4">
            <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
          </div>

          <PageSection>
            <div className="space-y-4">
              {/* Coloca uns 3 ou 4 skeletons para simular uma lista */}
              <BookingSkeleton />
              <BookingSkeleton />
              <BookingSkeleton />
              <BookingSkeleton />
            </div>
          </PageSection>
        </PageContainer>
      </div>
    </div>
  );
}

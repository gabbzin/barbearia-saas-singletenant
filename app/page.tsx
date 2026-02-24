import { Hero } from "@/features/landing_page/hero";
import { HowItWork } from "@/features/landing_page/how-it-work";
import { Navbar } from "@/features/landing_page/navbar";

export default function Page() {
  return (
    <div className="min-h-screen bg-foreground">
      <Navbar />
      <main>
        <Hero />
        <HowItWork />
      </main>
    </div>
  );
}

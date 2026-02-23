import { SpinLoader } from "@/shared/components/spinLoader";

export default async function Loading() {
  return (
    <main className="flex h-screen items-center justify-center">
      <SpinLoader />
    </main>
  );
}

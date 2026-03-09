import { Header } from "@/shared/components/header";

interface ProtectedUserLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedUserLayout({
  children,
}: ProtectedUserLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {children}
    </div>
  );
}

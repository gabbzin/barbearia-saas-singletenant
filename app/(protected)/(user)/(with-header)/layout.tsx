import Header from "@/shared/components/header";
import Footer from "@/shared/components/footer";

interface ProtectedUserLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedUserLayout({
  children,
}: ProtectedUserLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

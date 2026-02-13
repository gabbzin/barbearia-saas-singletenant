import Header from "@/shared/components/header";
import Footer from "@/shared/components/footer";

interface ProtectedUserLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedUserLayout({
  children,
}: ProtectedUserLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

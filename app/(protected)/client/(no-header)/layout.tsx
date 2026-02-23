import Footer from "@/shared/components/footer";

interface BarberLayoutProps {
  children: React.ReactNode;
}

export default function BarberLayout({ children }: BarberLayoutProps) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

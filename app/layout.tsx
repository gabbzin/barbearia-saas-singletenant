import type { Metadata } from "next";
import { Geist, Inter, Manrope, Poppins, Roboto } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import { verifySession } from "@/features/user/repository/user.repository";
import { getInfosBarbershop } from "@/shared/actions/get-infos-barbershop";
import { AppHydrator } from "@/stores/hydrator/app.hydrator";
import QueryProvider from "../providers/query-provider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const info = await getInfosBarbershop();
  return {
    title: info?.name ?? "Barbearia",
    description: "Agende seu horário na melhor barbearia da cidade!",
    icons: {
      icon: info?.imageUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const barbershop = await getInfosBarbershop();
  const user = await verifySession();

  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${manrope.variable} ${geist.variable} ${roboto.variable} ${poppins.variable} antialiased`}
      >
        <AppHydrator barbershopData={barbershop} userData={user} />
        <QueryProvider>
          {children}
          <Toaster />
          <SpeedInsights />
        </QueryProvider>
      </body>
    </html>
  );
}

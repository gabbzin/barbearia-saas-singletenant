import type { Metadata } from "next";
import {
  Geist,
  Inter,
  Manrope,
  Newsreader,
  Poppins,
  Roboto,
} from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "sonner";
import { verifySession } from "@/features/user/repository/user.repository";
import { getInfosBarbershop } from "@/shared/actions/get-infos-barbershop";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
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

const newsReader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const info = await getInfosBarbershop();
  return {
    title: info?.name ?? "Barbearia",
    description: "Agende seu horário na melhor barbearia da cidade!",
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
        className={`${inter.variable} ${manrope.variable} ${geist.variable} ${roboto.variable} ${poppins.variable} ${newsReader.variable} antialiased`}
      >
        <AppHydrator barbershopData={barbershop} userData={user} />
        <QueryProvider>
          <TooltipProvider>
            {children}
            <Toaster position={"top-right"} />
            <SpeedInsights />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

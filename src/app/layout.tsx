import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "@/redux/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SessionBootstrap from "@/components/session/SessionBootstrap";
import { isAuthenticatedServer } from "@/lib/auth/server";
import DevBanner from "@/components/dev/DevBanner";

export const metadata: Metadata = {
  title: { default: "Educasem", template: "%s | Educasem" },
  description: "Plataforma educativa de Cecasem",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const hasSession = await isAuthenticatedServer();
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <html lang="es">
      <body className="bg-[rgb(var(--bg))] text-[rgb(var(--fg))] antialiased">
        <Providers>
          {hasSession && <SessionBootstrap />}
          <Navbar />
          <main className="container mx-auto max-w-7xl px-4 py-6">{children}</main>
          <Footer />
          {/* Banner solo en desarrollo */}
          {isDev && <DevBanner />}
        </Providers>
      </body>
    </html>
  );
}
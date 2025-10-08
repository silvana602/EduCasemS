// src/app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "@/redux/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SessionBootstrap from "@/components/session/SessionBootstrap";
import { isAuthenticatedServer } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: { default: "Educasem", template: "%s | Educasem" },
  description: "Plataforma educativa de Cecasem",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // ✅ En Next 15, cookies() es async; isAuthenticatedServer ya hace el await
  const hasSession = await isAuthenticatedServer();

  return (
    <html lang="es">
      <body className="bg-[rgb(var(--bg))] text-[rgb(var(--fg))] antialiased">
        <Providers>
          {/* Solo hidratar Redux desde /auth/me si hay cookie de sesión */}
          {hasSession && <SessionBootstrap />}
          <Navbar />
          <main className="container mx-auto max-w-7xl px-4 py-6">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
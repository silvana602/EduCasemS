import type { Metadata } from "next";
import "@/app/globals.css";
import { Providers } from "@/redux/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SessionBootstrap from "@/components/session/SessionBootstrap";
import DevBanner from "@/components/dev/DevBanner";
import ThemeProvider from "@/components/theme/ThemeProvider";

export const metadata: Metadata = {
  title: { default: "Educasem", template: "%s | Educasem" },
  description: "Plataforma educativa de Cecasem",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <html lang="es" data-theme="light" suppressHydrationWarning>
      <body className="bg-[rgb(var(--bg))] text-[rgb(var(--fg))] antialiased">
        {/* Inyección de tema temprana para evitar FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try {
    var saved = localStorage.getItem('theme');
    var theme = saved ? saved : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {}
})();
          `.trim(),
          }}
        />

        <ThemeProvider>
          <Providers>
            {/* Siempre montamos el bootstrap para que hidrate Redux al entrar por URL directa */}
            <SessionBootstrap />

            <Navbar />
            <main className="container mx-auto max-w-7xl px-4 py-6">
              {children}
            </main>
            <Footer />
            {isDev && <DevBanner />}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
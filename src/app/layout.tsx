import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/hooks/useToast";
import { SiteChrome } from "@/components/layout/SiteChrome";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Showroom — Premium Cars & Custom Builds",
    template: "%s — Showroom",
  },
  description:
    "A premium automotive showroom and modification studio. Browse the collection, configure your build, and connect with our team directly on WhatsApp.",
  openGraph: {
    type: "website",
    title: "Showroom — Premium Cars & Custom Builds",
    description:
      "A premium automotive showroom and modification studio. Browse the collection, configure your build, and connect with our team directly on WhatsApp.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="font-body bg-ink-900 text-bone antialiased">
        <ToastProvider>
          <SiteChrome>{children}</SiteChrome>
        </ToastProvider>
      </body>
    </html>
  );
}

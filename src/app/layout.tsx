import type { Metadata } from "next";
import { Inter_Tight, Manrope } from "next/font/google";
import "./globals.css";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { createMetadata, organizationJsonLd } from "@/lib/metadata";

const interTight = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = createMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${interTight.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-ink)]">
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}

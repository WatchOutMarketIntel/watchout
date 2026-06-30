import type { Metadata } from "next";
import { EB_Garamond, Instrument_Sans } from "next/font/google";

// Self-hosted at build time by next/font (no runtime Google Fonts request).
// Exposed as CSS variables the page reads: --font-serif (headlines / watch
// names) and --font-sans (body / UI / tabular numbers).
const serif = EB_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-serif",
  display: "swap",
});
const sans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WatchOut — Watch Market Intelligence",
  description: "Real-time watch market intelligence. Live prices, hourly updates, instant alerts.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}

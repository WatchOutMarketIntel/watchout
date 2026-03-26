import type { Metadata } from "next";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
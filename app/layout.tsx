import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PharmSim Pro — Medication Safety Lab",
  description:
    "A simulated medication-safety decision lab for pharmacy learners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
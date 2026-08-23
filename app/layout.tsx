import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Canberra Property Scanner",
  description: "ACT residential property investment analysis dashboard",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}

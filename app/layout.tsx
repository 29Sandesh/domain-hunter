import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DomainHunter AI - Best Domain Finder & Real-Time Availability Engine",
  description:
    "Find high-brandability domain names for your startup or venture and verify live DNS and registry availability in real time.",
  keywords: [
    "domain finder",
    "ai domain generator",
    "domain availability checker",
    "whois lookup",
    "brand name generator",
    "best domain names",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}

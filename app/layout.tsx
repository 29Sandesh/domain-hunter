import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Domen — Instant Domain Finder by Codehtml",
  description:
    "Find available .com, .ai, and .io domains in sub-50ms using Cloudflare DNS over HTTPS. 100% free, zero-config, with live registrar price comparisons. Built by Codehtml.",
  keywords: [
    "Domen",
    "Domain Finder",
    "Domain Search",
    "Available Domains",
    "Codehtml",
    "Cloudflare DNS",
    "Namecheap",
    "Porkbun",
    "GoDaddy",
  ],
  authors: [{ name: "Codehtml", url: "https://codehtml.in" }],
  openGraph: {
    title: "Domen — Instant Domain Finder by Codehtml",
    description:
      "Find available .com, .ai, and .io domains in sub-50ms using Cloudflare DNS over HTTPS. 100% free by Codehtml.",
    url: "https://github.com/29Sandesh/domain-hunter",
    siteName: "Domen",
    type: "website",
  },
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

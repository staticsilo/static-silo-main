import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Static Silo",
  description:
    "Static Silo builds custom software, web applications, mobile applications, SaaS platforms, integrations, automation, and reporting systems for Malaysian businesses.",
  icons: {
    icon: "/StaticSilo-1on1.png",
    shortcut: "/StaticSilo-1on1.png",
    apple: "/StaticSilo-1on1.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth bg-[#030405] antialiased">
      <body className="min-h-full bg-[#030405] text-[#F5F7FA]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

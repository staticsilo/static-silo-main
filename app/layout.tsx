import type { Metadata } from "next";
import { Cinzel, EB_Garamond, Special_Elite } from "next/font/google";
import "./globals.css";

const display = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-cinzel",
});

const body = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
});

const type = Special_Elite({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-elite",
});

export const metadata: Metadata = {
  title: "Static Silo",
  description:
    "Static Silo is an independent game studio from Malaysia. Our first game, Fathomless Maw, is a dark isometric action RPG coming to PC, with Android and iOS in development.",
  icons: {
    icon: "/brand/seal-icon.png",
    shortcut: "/brand/seal-icon.png",
    apple: "/brand/seal-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${type.variable} h-full scroll-smooth bg-[#0b0a08] antialiased`}
    >
      <body className="min-h-full bg-[#0b0a08] text-[#e8dcc0]">
        {children}
        <div aria-hidden="true" className="silo-grain" />
        <div aria-hidden="true" className="silo-scanlines" />
      </body>
    </html>
  );
}

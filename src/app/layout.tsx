import type { Metadata } from "next";
import { Geist, Geist_Mono, Darker_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/ui/navbar";
import AdSense from "@/components/adsense/AdSense";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const darkerGrotesque = Darker_Grotesque({
  variable: "--font-darker-grotesque",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "QuickDevTools",
  description: "A collection of useful developer tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${darkerGrotesque.variable} antialiased`}
      >
        <Toaster richColors position="top-right" />
        <Navbar />
        {children}
        {/* TODO: Replace with your own Google AdSense publisher ID */}
        <AdSense publisherId="ca-pub-xxxxxxxxxxxxxxxx" />
      </body>
    </html>
  );
}

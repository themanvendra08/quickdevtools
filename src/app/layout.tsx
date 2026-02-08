import type { Metadata } from "next";
import { Geist, Geist_Mono, Darker_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
        <SidebarProvider>
          <AppSidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
            </header>
            <Toaster richColors position="top-right" />
            <main className="flex-1 p-6 md:p-8 overflow-y-auto">
              {children}
              <div className="mt-8">
                {/* TODO: Replace with your own Google AdSense publisher ID */}
                <AdSense publisherId="ca-pub-xxxxxxxxxxxxxxxx" />
              </div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}

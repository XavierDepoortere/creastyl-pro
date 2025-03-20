import "./globals.css";
import { Header } from "../components/layout/header";
import { Sidebar } from "../components/layout/sidebar";
import { DeviceDetector } from "../components/layout/DeviceDetector";
import { getCurrentUser } from "../src/lib/auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "../components/theme-provider";
import { FooterBar } from "@/components/layout/footerBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin System",
  description: "Next.js Admin System with Email Invitations",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col md:flex-row">
            <DeviceDetector
              mobileComponent={
                user ? (
                  <>
                    <Sidebar user={user} />
                    <FooterBar />
                  </>
                ) : null
              }
              desktopComponent={user ? <Header user={user} /> : null}
            />
            <main className="flex-1 p-4">{children}</main>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

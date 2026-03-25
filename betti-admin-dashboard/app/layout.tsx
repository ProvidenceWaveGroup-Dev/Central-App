import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { UserProfileBanner } from "@/components/user-profile-banner";
import { LiveDataSummary } from "@/components/live-data-summary";
import { Toaster } from "@/components/ui/sonner";
import { AiAssistantFab } from "@/components/ai-assistant-fab";
import { AuthBootstrap } from "@/components/auth-bootstrap";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Betti Admin Dashboard",
  description: "Centralized administration for Betti care monitoring system",
  icons: {
    icon: "/images/betti-logo.png",
    shortcut: "/images/betti-logo.png",
    apple: "/images/betti-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthBootstrap />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <UserProfileBanner />
          <LiveDataSummary />
          {children}
          <AiAssistantFab />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

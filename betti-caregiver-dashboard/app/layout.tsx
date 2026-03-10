import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { AiAssistantFab } from "@/components/ai-assistant-fab"
import { AuthBootstrap } from "@/components/auth-bootstrap"
import "./globals.css"

export const metadata: Metadata = {
  title: "Betti Caregiver Dashboard",
  description: "Professional caregiver monitoring and communication platform"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthBootstrap />
        <ThemeProvider>
          <Suspense fallback={<div>Loading...</div>}>
            {children}
            <Analytics />
          </Suspense>
          <AiAssistantFab />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

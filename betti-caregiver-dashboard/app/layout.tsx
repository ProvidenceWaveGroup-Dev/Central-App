import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { RouteLoaderWrapper } from "@/components/route-loader-wrapper"
import BettiLoadingFallback from "@/components/BettiLoadingFallback"
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
        <ThemeProvider>
          <RouteLoaderWrapper>
            <Suspense fallback={<BettiLoadingFallback />}>
              {children}
              <Analytics />
            </Suspense>
          </RouteLoaderWrapper>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

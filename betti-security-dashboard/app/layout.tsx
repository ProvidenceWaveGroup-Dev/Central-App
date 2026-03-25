import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SecurityLayoutShell } from "@/components/security-layout-shell"
import "./globals.css"

export const metadata: Metadata = {
  title: "Betti Security Dashboard",
  description: "Comprehensive security monitoring and incident management",
  generator: "v0.app",
  icons: {
    icon: "/betti-logo.png",
    shortcut: "/betti-logo.png",
    apple: "/betti-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SecurityLayoutShell>
          <Suspense fallback={null}>{children}</Suspense>
        </SecurityLayoutShell>
        <Analytics />
      </body>
    </html>
  )
}

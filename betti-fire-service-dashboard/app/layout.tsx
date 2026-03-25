import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { FireLayoutShell } from "@/components/fire-layout-shell"
import "./globals.css"

export const metadata: Metadata = {
  title: "Betti FIRE/RESCUE Dashboard",
  description: "Environmental & Occupancy Monitoring Dashboard",
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
      <body className="font-sans">
        <FireLayoutShell>
          <Suspense fallback={null}>{children}</Suspense>
        </FireLayoutShell>
        <Analytics />
      </body>
    </html>
  )
}

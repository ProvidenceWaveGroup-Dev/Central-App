import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/next"
import { EmsLayoutShell } from "@/components/ems-layout-shell"
import "./globals.css"

export const metadata: Metadata = {
  title: "Betti Dashboard - Medical & Health Centre",
  description: "Real-time patient monitoring and incident response dashboard",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <EmsLayoutShell>
          <Suspense fallback={null}>{children}</Suspense>
        </EmsLayoutShell>
        <Analytics />
      </body>
    </html>
  )
}

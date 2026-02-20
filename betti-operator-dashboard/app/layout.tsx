import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { OperatorLayoutShell } from "@/components/operator-layout-shell"
import { BettiLoader } from "@/components/betti-loader"
import "./globals.css"

export const metadata: Metadata = {
  title: "Betti Facility Operator Dashboard",
  description: "Day-to-day resident monitoring, alert response, and care management",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <OperatorLayoutShell>
          <Suspense fallback={<BettiLoader isLoading={true} minDisplayTime={0} />}>{children}</Suspense>
        </OperatorLayoutShell>
        <Analytics />
      </body>
    </html>
  )
}

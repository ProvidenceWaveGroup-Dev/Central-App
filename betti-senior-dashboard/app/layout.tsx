import type React from "react"
import type { Metadata } from "next"
import { Inter, Georama as Georgia } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { SeniorLayoutShell } from "@/components/senior-layout-shell"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const georgia = Georgia({
  subsets: ["latin"],
  variable: "--font-georgia",
  weight: ["400", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Betti - User Dashboard",
  description: "Be Empowered Through Technology and Innovation - Health and wellness monitoring for seniors",
  generator: "v0.app",
  icons: {
    icon: "/images/betti-logo.png",
    shortcut: "/images/betti-logo.png",
    apple: "/images/betti-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${georgia.variable}`}>
        <SeniorLayoutShell>
          <Suspense fallback={null}>{children}</Suspense>
        </SeniorLayoutShell>
        <Analytics />
      </body>
    </html>
  )
}

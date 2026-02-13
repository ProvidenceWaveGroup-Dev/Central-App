"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { Suspense, useState, useEffect } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { TopNav } from "@/components/top-nav"

function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector("aside")
      if (sidebar) {
        const width = sidebar.offsetWidth
        setSidebarCollapsed(width <= 64)
      }
    }

    handleResize()

    const observer = new ResizeObserver(handleResize)
    const sidebar = document.querySelector("aside")
    if (sidebar) {
      observer.observe(sidebar)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <SidebarNav />
      <TopNav />
      <main
        className={`mt-16 md:mt-20 min-h-screen bg-white transition-all duration-300 ${
          isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </main>
      <Analytics />
    </>
  )
}

export { ClientLayout }
export default ClientLayout

"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { DashboardHeader } from "@/components/dashboard-header"
import { Sidebar } from "@/components/sidebar-nav"
import { DashboardPage } from "@/components/pages/dashboard-page"
import { PropertiesPage } from "@/components/pages/properties-page"
import { AlertsPage } from "@/components/pages/alerts-page"
import { CompliancePage } from "@/components/pages/compliance-page"
import { ResidentsPage } from "@/components/pages/residents-page"
import { HealthWellnessPage } from "@/components/pages/health-wellness-page"
import { MessagesPage } from "@/components/pages/messages-page"
import { SettingsPage } from "@/components/pages/settings-page"

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  // Start closed (avoids SSR/hydration mismatch).
  // After mount, open automatically on desktop (≥ 768px).
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (window.innerWidth >= 768) setSidebarOpen(true)
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case "properties": return <PropertiesPage />
      case "alerts":     return <AlertsPage />
      case "compliance": return <CompliancePage />
      case "residents":  return <ResidentsPage />
      case "health":     return <HealthWellnessPage />
      case "messages":   return <MessagesPage />
      case "settings":   return <SettingsPage />
      default:           return <DashboardPage />
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader onMenuClick={() => setSidebarOpen((v) => !v)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onNavigate={(page) => setCurrentPage(page)}
          currentPage={currentPage}
          onToggle={() => setSidebarOpen((v) => !v)}
        />
        {/*
          Mobile (< md):  ml-0  — sidebar is a translateX overlay, content fills full width.
          Desktop (md+):  ml-20 when sidebar collapsed, ml-64 when expanded.
          The transition mirrors the sidebar's own duration-300.
        */}
        <main
          className={cn(
            "flex-1 overflow-auto transition-all duration-300",
            sidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-20",
          )}
        >
          {renderPage()}
        </main>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Bell,
  Home,
  Activity,
  MapPin,
  Settings,
  AlertTriangle,
  BarChart3,
  Menu,
  ChevronLeft,
  ChevronRight,
  User,
  MessageSquare,
  HelpCircle,
  FileText,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Activity, label: "Live Monitoring", href: "/monitoring" },
  { icon: AlertTriangle, label: "Incidents", href: "/incidents" },
  { icon: MapPin, label: "Occupancy", href: "/occupancy" },
  { icon: MessageSquare, label: "Communication", href: "/communication" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: Lock, label: "Security", href: "/security" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

const notifications = [
  { id: 1, type: "critical", message: "Smoke detected in Kitchen", time: "2 min ago" },
  { id: 2, type: "warning", message: "Temperature rising in Living Room", time: "5 min ago" },
  { id: 3, type: "info", message: "Device battery low - Bedroom sensor", time: "15 min ago" },
  { id: 4, type: "success", message: "AI Check-in completed successfully", time: "30 min ago" },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 transform bg-sidebar border-r border-sidebar-border transition-all duration-200 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "w-16" : "w-64",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div
            className={cn(
              "flex h-16 items-center border-b border-sidebar-border",
              sidebarCollapsed ? "justify-center px-2" : "gap-3 px-6",
            )}
          >
            <Image src="/betti-logo.png" alt="Betti Logo" width={40} height={40} className="object-contain shrink-0" />
            {!sidebarCollapsed && (
              <span className="font-serif text-lg font-semibold text-sidebar-foreground">Betti Dashboard</span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    sidebarCollapsed && "justify-center",
                  )}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && item.label}
                </a>
              )
            })}
          </nav>

          <div className="border-t border-sidebar-border p-2">
            <Button variant="ghost" size="sm" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="w-full">
              {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-serif text-lg md:text-xl font-semibold text-foreground">FIRE/RESCUE Dashboard</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Environmental & Occupancy Monitoring</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative bg-transparent">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {notifications.length}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                    <div className="flex w-full items-start justify-between">
                      <span className="text-sm font-medium">{notification.message}</span>
                      <Badge
                        variant={
                          notification.type === "critical"
                            ? "destructive"
                            : notification.type === "warning"
                              ? "default"
                              : "secondary"
                        }
                        className="ml-2 shrink-0"
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Icon */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="bg-transparent">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                <DropdownMenuItem>Preferences</DropdownMenuItem>
                <DropdownMenuItem>Help & Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">Log Out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import {
  Bell,
  User,
  Home,
  Activity,
  AlertTriangle,
  Settings,
  FileText,
  MapPin,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const notifications = [
  {
    id: 1,
    title: "Distress Alert",
    message: "Voice trigger detected in Room 204",
    time: "2 min ago",
    type: "critical",
  },
  {
    id: 2,
    title: "Check-in Missed",
    message: "No response from morning check-in",
    time: "15 min ago",
    type: "warning",
  },
  {
    id: 3,
    title: "Caregiver Confirmed",
    message: "Sarah Johnson acknowledged alert",
    time: "20 min ago",
    type: "info",
  },
  {
    id: 4,
    title: "Routine Deviation",
    message: "Medication reminder not completed",
    time: "1 hour ago",
    type: "warning",
  },
]

// const menuItems = [
//   { icon: Home, label: "Dashboard", href: "/" },
//   { icon: Activity, label: "Live Monitoring", href: "/monitoring" },
//   { icon: AlertTriangle, label: "Incidents", href: "/incidents" },
//   { icon: MapPin, label: "Location Tracking", href: "/locations" },
//   { icon: MessageSquare, label: "Communication", href: "/communication" },
//   { icon: FileText, label: "Reports", href: "/reports" },
//   { icon: Settings, label: "Security", href: "/security" },
//   { icon: Settings, label: "Settings", href: "/settings" },
// ]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Mobile Sidebar */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar collapsed={false} onItemClick={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Desktop Sidebar */}
        <aside
          className={`hidden border-r border-border bg-sidebar md:block transition-all duration-300 fixed left-0 top-0 h-screen z-40 ${desktopSidebarCollapsed ? "w-20" : "w-64"}`}
        >
          <Sidebar
            collapsed={desktopSidebarCollapsed}
            onToggleCollapse={() => setDesktopSidebarCollapsed(!desktopSidebarCollapsed)}
          />
        </aside>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${desktopSidebarCollapsed ? "md:ml-20" : "md:ml-64"}`}
        >
          <header className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
            <div className="flex h-16 items-center gap-4 px-4 md:px-6">
              {/* Mobile Menu Toggle */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <ChevronRight className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
              </Sheet>

              <div className="flex-1" />

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-destructive p-0 text-[10px] text-white">
                      {notifications.length}
                    </Badge>
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <ScrollArea className="h-[300px]">
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                        <div className="flex w-full items-start justify-between">
                          <span className="font-semibold text-sm">{notification.title}</span>
                          <Badge
                            variant={notification.type === "critical" ? "destructive" : "secondary"}
                            className="text-xs"
                          >
                            {notification.type}
                          </Badge>
                        </div>
                        <span className="text-muted-foreground text-sm">{notification.message}</span>
                        <span className="text-muted-foreground text-xs">{notification.time}</span>
                      </DropdownMenuItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  )
}

function Sidebar({
  collapsed,
  onItemClick,
  onToggleCollapse,
}: { collapsed?: boolean; onItemClick?: () => void; onToggleCollapse?: () => void }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center border-b border-border p-4">
        {!collapsed && (
          <Image src="/betti-logo.png" alt="Betti Logo" width={120} height={40} className="h-10 w-auto" priority />
        )}
        {collapsed && (
          <Image
            src="/betti-logo.png"
            alt="Betti Logo"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
        )}
      </div>

      {/* Menu Items */}
      {/* <div className="flex-1 py-4">
        <div className="px-3 py-2">
          {!collapsed && (
            <h2 className="mb-2 px-4 font-serif text-lg font-semibold tracking-tight text-sidebar-foreground">
              Security Dashboard
            </h2>
          )}
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.label} href={item.href} onClick={onItemClick}>
                  <Button
                    variant="ghost"
                    className={`w-full ${collapsed ? "justify-center" : "justify-start"} ${
                      isActive ? "bg-primary text-white hover:bg-primary/90 hover:text-white" : ""
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={`h-4 w-4 ${collapsed ? "" : "mr-2"} ${isActive ? "text-white" : ""}`} />
                    {!collapsed && item.label}
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </div> */}

      {/* Collapse Button */}
      {/* {onToggleCollapse && (
        <div className="border-t border-border p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hidden w-full md:flex justify-center"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      )} */}
    </div>
  )
}

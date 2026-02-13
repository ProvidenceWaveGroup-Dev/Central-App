"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Activity,
  Calendar,
  MessageSquare,
  MapPin,
  TrendingUp,
  Settings,
  Heart,
  ChevronLeft,
  ChevronRight,
  Home,
  Menu,
  X,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Health & Wellness",
    href: "/health-wellness",
    icon: Heart,
  },
  {
    title: "Activity Feed",
    href: "/activity-feed",
    icon: Activity,
  },
  {
    title: "Monitoring",
    href: "/occupancy",
    icon: MapPin,
  },
  {
    title: "Communication",
    href: "/communication",
    icon: MessageSquare,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: Calendar,
  },
  {
    title: "Insights & Reports",
    href: "/insights",
    icon: TrendingUp,
  },
  {
    title: "Security",
    href: "/security",
    icon: Lock,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function SidebarNav() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      )}

      {isMobile && mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-neutral-200 bg-white transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          isMobile && !mobileMenuOpen && "-translate-x-full",
          isMobile && mobileMenuOpen && "translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 md:h-20 items-center justify-between border-b border-neutral-200 px-4">
            {!collapsed && (
              <div className="flex items-center gap-3">
                <img
                  src="/images/betti-logo.png"
                  alt="Betti Logo"
                  className="h-10 md:h-12 w-10 md:w-12 object-contain"
                />
                <span className="font-serif text-lg md:text-xl font-bold text-primary">Betti</span>
              </div>
            )}
            {collapsed && (
              <img src="/images/betti-logo.png" alt="Betti Logo" className="h-8 md:h-10 w-8 md:w-10 object-contain" />
            )}
          </div>

          <nav className="flex-1 space-y-1 p-2 md:p-3 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 md:py-3 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-[#5C7F39] text-white shadow-md"
                      : "text-neutral-700 hover:bg-[#5C7F39] hover:text-white hover:shadow-sm hover-scale",
                    collapsed && "justify-center",
                  )}
                  onClick={() => isMobile && setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm md:text-base">{item.title}</span>}
                </Link>
              )
            })}
          </nav>

          {!isMobile && (
            <div className="border-t border-neutral-200 p-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCollapsed(!collapsed)}
                className="w-full justify-center"
              >
                {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
              </Button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

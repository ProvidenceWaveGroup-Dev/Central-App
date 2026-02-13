"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Home,
  Activity,
  Heart,
  Shield,
  MessageCircle,
  Calendar,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Lock
  
} from "lucide-react"

const navigationItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    description: "real-time overview",
  },
  {
    id: "activity",
    label: "Activity Feed",
    icon: Activity,
    description: "logs & last seen",
  },
  {
    id: "health",
    label: "Health & Wellness",
    icon: Heart,
    description: "meds, hydration, meals, sleep",
  },
  {
    id: "location",
    label: "Location",
    href: "/occupancy",
    icon: MapPin,
    description: "current location",
  },
  {
    id: "alerts",
    label: "Alerts & Safety",
    icon: Shield,
    description: "falls, inactivity, emergencies",
  },
  {
    id: "communication",
    label: "Communication",
    icon: MessageCircle,
    description: "messaging, video calls",
  },
  {
    id: "reminders",
    label: "Reminders & Scheduling",
    icon: Calendar,
    description: "calendar + reminders",
  },
  {
    id: "reports",
    label: "Reports/Insights",
    icon: BarChart3,
    description: "weekly/monthly summaries",
  },
  {
    id: "security",
    label: "Security",
    icon: Lock,
    description: "home security status",
  },
];

interface SidebarNavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function SidebarNavigation({ activeSection, onSectionChange }: SidebarNavigationProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-full w-60", // use h-full (parent is h-screen)
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border flex-shrink-0 w-full">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <Image
                src="/betti-logo.png"
                alt="Betti"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <div>
                <h1 className="font-serif font-bold text-lg text-sidebar-foreground">
                  Betti
                </h1>
                <p className="text-xs text-muted-foreground">
                  Caregiver Dashboard
                </p>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              {isCollapsed ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start text-left h-auto p-3",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs opacity-70">
                      {item.description}
                    </span>
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

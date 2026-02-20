"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  UserCog,
  Bell,
  Cpu,
  BarChart3,
  FileText,
  Settings,
  Shield,
  Activity,
  Building2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Brain,
  Siren,
  MessageSquare,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { useTheme } from "next-themes";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  isMobile?: boolean;
}

const menuItems = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: "patients",
    label: "Patients",
    icon: Users,
    badge: "156",
  },
  {
    id: "caregivers",
    label: "Caregivers",
    icon: UserCog,
    badge: "24",
  },
  {
    id: "alerts",
    label: "Alerts & Incidents",
    icon: Bell,
    badge: "8",
    badgeVariant: "destructive" as const,
  },
  {
    id: "devices",
    label: "Devices & Sensors",
    icon: Cpu,
    badge: null,
  },
  {
    id: "fall-monitoring",
    label: "Fall Monitoring",
    icon: Activity,
    badge: "3",
    badgeVariant: "destructive" as const,
  },
  {
    id: "ai-rules",
    label: "AI & Rules",
    icon: Brain,
    badge: null,
  },
  {
    id: "emergency",
    label: "Emergency Response",
    icon: Siren,
    badge: null,
  },
  {
    id: "security-agencies",
    label: "Security Agencies",
    icon: ShieldCheck,
    badge: "5",
  },
  {
    id: "fire-service",
    label: "Fire Service Units",
    icon: Flame,
    badge: "5",
  },
  {
    id: "communications",
    label: "Communications",
    icon: MessageSquare,
    badge: "2",
  },
  {
    id: "reports",
    label: "Reports & Analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    id: "billing",
    label: "Billing & RPM",
    icon: FileText,
    badge: null,
  },
  {
    id: "facilities",
    label: "Facilities",
    icon: Building2,
    badge: null,
  },
  {
    id: "security",
    label: "Security & Access",
    icon: Shield,
    badge: null,
  },
  {
    id: "admin-management",
    label: "Admin Management",
    icon: UserCog,
    badge: null,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    badge: null,
  },
];

export function AdminSidebar({
  activeSection,
  onSectionChange,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  isMobile = false
}: AdminSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const handleLogoutConfirm = () => {
    if (typeof window !== "undefined") {
      window.location.href = "http://localhost:3000";
    }
  };
  const handleLogoutCancel = () => setShowLogoutConfirm(false);

  // Use controlled state if provided, otherwise use internal state
  // On mobile, sidebar is never collapsed (always shows full menu)
  const collapsed = isMobile ? false : (controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed);
  const setCollapsed = (value: boolean) => {
    if (onCollapsedChange) {
      onCollapsedChange(value);
    } else {
      setInternalCollapsed(value);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar transition-all duration-300",
        isMobile ? "w-64 h-full border-l border-sidebar-border" : "sticky top-0 h-screen border-r border-sidebar-border",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header - hidden on mobile since we have a separate mobile header */}
      {!isMobile && (
        <div className={cn(
          "flex items-center border-b border-sidebar-border",
          collapsed ? "justify-center p-3" : "justify-between p-4"
        )}>
          <div className={cn("flex items-center", collapsed ? "gap-0" : "gap-3")}>
            <Image
              src="/images/betti-logo.png"
              alt="Betti Logo"
              width={collapsed ? 32 : 40}
              height={collapsed ? 32 : 40}
              className="rounded-lg"
            />
            {!collapsed && (
              <div>
                <h1 className="font-bold text-lg text-sidebar-foreground">Betti</h1>
                <p className="text-xs text-muted-foreground">Admin Portal</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="text-sidebar-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(!collapsed)}
              className="text-sidebar-foreground absolute top-3 -right-3 bg-sidebar border border-sidebar-border rounded-full h-6 w-6"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Navigation - internal scrolling with hidden scrollbar */}
      <div className="flex-1 py-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-0.5 px-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full gap-3 h-9 justify-start",
                collapsed && "justify-center px-2",
                activeSection === item.id && "bg-sidebar-accent text-sidebar-accent-foreground"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badgeVariant || "secondary"}
                      className="ml-auto text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className={cn("w-full", !collapsed && "justify-start gap-3")}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          {!collapsed && <span>Toggle Theme</span>}
        </Button>
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          className={cn("w-full text-destructive hover:text-destructive", !collapsed && "justify-start gap-3")}
          onClick={handleLogoutClick}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>

      {/* Logout Confirmation Modal - Portal with blurred background */}
      {showLogoutConfirm &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
              background: "rgba(9, 16, 32, 0.35)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
          >
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <LogOut className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-gray-900">Confirm Logout</h3>
                  <p className="text-sm text-gray-500">Are you sure you want to logout?</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleLogoutCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleLogoutConfirm}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

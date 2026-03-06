"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAlerts } from "@/components/alerts-context";
import type { LucideIcon } from "lucide-react";
import {
  Home,
  Activity,
  Heart,
  MapPin,
  Shield,
  MessageCircle,
  Calendar,
  BarChart3,
  Lock,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge: string | null;
  badgeVariant?: "destructive" | "secondary";
}

interface CaregiverSidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  isMobile?: boolean;
  onNavigate?: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Home,
    badge: null,
  },
  {
    id: "activity",
    label: "Activity Feed",
    icon: Activity,
    badge: null,
  },
  {
    id: "health",
    label: "Health & Wellness",
    icon: Heart,
    badge: null,
  },
  {
    id: "location",
    label: "Location",
    icon: MapPin,
    badge: null,
  },
  {
    id: "alerts",
    label: "Alerts & Safety",
    icon: Shield,
    badge: "2",
    badgeVariant: "destructive" as const,
  },
];

const toolItems: MenuItem[] = [
  {
    id: "communication",
    label: "Communication",
    icon: MessageCircle,
    badge: null,
  },
  {
    id: "reminders",
    label: "Reminders & Scheduling",
    icon: Calendar,
    badge: null,
  },
  {
    id: "reports",
    label: "Reports/Insights",
    icon: BarChart3,
    badge: null,
  },
  {
    id: "security",
    label: "Security",
    icon: Lock,
    badge: null,
  },
];

export function CaregiverSidebar({
  collapsed: controlledCollapsed,
  onCollapsedChange,
  isMobile = false,
  onNavigate,
  activeSection,
  onSectionChange,
}: CaregiverSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { unreadCount } = useAlerts();

  const collapsed = isMobile
    ? false
    : controlledCollapsed !== undefined
      ? controlledCollapsed
      : internalCollapsed;

  const setCollapsed = (value: boolean) => {
    if (onCollapsedChange) {
      onCollapsedChange(value);
    } else {
      setInternalCollapsed(value);
    }
  };

  const handleItemClick = (id: string) => {
    onSectionChange(id);
    if (onNavigate) onNavigate();
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    if (typeof window !== "undefined") {
      sessionStorage.clear();
      localStorage.clear();
      const hubUrl = process.env.NEXT_PUBLIC_CENTRAL_HUB_URL?.trim() || "http://localhost:3000";
      window.location.href = hubUrl;
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const renderItem = (item: MenuItem) => (
    <Button
      key={item.id}
      onClick={() => handleItemClick(item.id)}
      variant={activeSection === item.id ? "secondary" : "ghost"}
      className={cn(
        "w-full gap-3 h-10 justify-start text-sm",
        collapsed && "justify-center px-2",
        activeSection === item.id &&
          "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
      )}
    >
        <item.icon
          className={cn(
            "h-5 w-5 flex-shrink-0",
            activeSection === item.id ? "text-green-600" : "text-gray-500"
          )}
        />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {(item.id === "alerts" ? unreadCount > 0 : !!item.badge) && (
              <Badge
                variant={item.badgeVariant || "secondary"}
                className="ml-auto text-xs"
              >
                {item.id === "alerts" ? unreadCount : item.badge}
              </Badge>
            )}
          </>
        )}
    </Button>
  );

  return (
    <div
      className={cn(
        "flex flex-col bg-white transition-all duration-300",
        isMobile
          ? "w-72 h-full border-l border-gray-200"
          : "sticky top-0 h-screen border-r border-gray-200",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Header */}
      {!isMobile && (
        <div
          className={cn(
            "flex items-center border-b border-gray-200 relative",
            collapsed ? "justify-center p-3" : "justify-between p-4"
          )}
        >
          <div
            className={cn(
              "flex items-center",
              collapsed ? "gap-0" : "gap-3"
            )}
          >
            <Image
              src="/betti-logo.png"
              alt="Betti Logo"
              width={40}
              height={40}
              className="rounded-lg flex-shrink-0"
            />
            {!collapsed && (
              <div>
                <h1 className="font-bold text-lg text-blue-800 font-serif">
                  Betti
                </h1>
                <p className="text-xs text-gray-500">Caregiver Dashboard</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          {collapsed && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCollapsed(false)}
              className="absolute top-3 -right-3 bg-white border border-gray-200 rounded-full h-6 w-6 shadow-sm hover:shadow"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 py-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-0.5 px-2">
          {menuItems.map(renderItem)}

          {/* Tools & Reports Separator */}
          <div
            className={cn(
              "pt-4 pb-2",
              collapsed ? "px-0" : "px-3"
            )}
          >
            {!collapsed ? (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Tools & Reports
              </p>
            ) : (
              <div className="border-t border-gray-200" />
            )}
          </div>

          {toolItems.map(renderItem)}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        <Button
          variant="ghost"
          size={collapsed ? "icon" : "default"}
          onClick={handleLogoutClick}
          className={cn(
            "w-full text-red-500 hover:text-red-600 hover:bg-red-50",
            !collapsed && "justify-start gap-3"
          )}
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

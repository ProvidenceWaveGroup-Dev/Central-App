"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useAlerts } from "@/components/alerts-context";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Bell,
  Users,
  ClipboardList,
  CalendarClock,
  Activity,
  Cpu,
  MessageSquare,
  Settings,
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

interface OperatorSidebarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  isMobile?: boolean;
  onNavigate?: () => void;
}

const menuItems: MenuItem[] = [
  {
    id: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    id: "/alerts",
    label: "Alert Queue",
    icon: Bell,
    badge: "5",
    badgeVariant: "destructive" as const,
  },
  {
    id: "/residents",
    label: "Residents",
    icon: Users,
    badge: null,
  },
  {
    id: "/incidents",
    label: "Incidents",
    icon: ClipboardList,
    badge: "2",
    badgeVariant: "destructive" as const,
  },
  {
    id: "/shifts",
    label: "Shift View",
    icon: CalendarClock,
    badge: null,
  },
];

const toolItems: MenuItem[] = [
  {
    id: "/vitals",
    label: "Vitals & Trends",
    icon: Activity,
    badge: null,
  },
  {
    id: "/devices",
    label: "Device Health",
    icon: Cpu,
    badge: "1",
    badgeVariant: "secondary" as const,
  },
  {
    id: "/communication",
    label: "Communication",
    icon: MessageSquare,
    badge: null,
  },
  {
    id: "/settings",
    label: "Settings",
    icon: Settings,
    badge: null,
  },
];

export function OperatorSidebar({
  collapsed: controlledCollapsed,
  onCollapsedChange,
  isMobile = false,
  onNavigate,
}: OperatorSidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const pathname = usePathname();
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

  const isActive = (id: string) => {
    if (id === "/") return pathname === "/";
    return pathname.startsWith(id);
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
    <Link
      key={item.id}
      href={item.id}
      onClick={onNavigate}
    >
      <div
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
          collapsed && "justify-center px-2",
          isActive(item.id)
            ? "bg-green-50 text-green-700"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        )}
      >
        <item.icon
          className={cn(
            "h-5 w-5 flex-shrink-0",
            isActive(item.id) ? "text-green-600" : "text-gray-400"
          )}
        />
        {!collapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {(item.id === "/alerts" ? unreadCount > 0 : !!item.badge) && (
              <span
                className={cn(
                  "ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                  item.badgeVariant === "destructive"
                    ? "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                )}
              >
                {item.id === "/alerts" ? unreadCount : item.badge}
              </span>
            )}
          </>
        )}
      </div>
    </Link>
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
                <h1 className="font-bold text-lg text-[#233E7D] font-serif">
                  Betti
                </h1>
                <p className="text-xs text-gray-500">Facility Operator</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              className="absolute top-3 -right-3 bg-white border border-gray-200 rounded-full h-6 w-6 flex items-center justify-center shadow-sm hover:shadow"
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 py-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <nav className="space-y-0.5 px-2">
          {menuItems.map(renderItem)}

          {/* Tools & Settings Separator */}
          <div
            className={cn(
              "pt-4 pb-2",
              collapsed ? "px-0" : "px-3"
            )}
          >
            {!collapsed ? (
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Tools & Settings
              </p>
            ) : (
              <div className="border-t border-gray-200" />
            )}
          </div>

          {toolItems.map(renderItem)}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={handleLogoutClick}
          className={cn(
            "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </button>
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
                <button
                  onClick={handleLogoutCancel}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm font-medium text-white transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

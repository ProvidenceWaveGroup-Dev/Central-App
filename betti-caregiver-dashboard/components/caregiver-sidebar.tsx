"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ChevronDown,
  LogOut,
  Utensils,
  Droplets,
  PersonStanding,
  Pill,
} from "lucide-react";

interface SubMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge: string | null;
  badgeVariant?: "destructive" | "secondary";
  subItems?: SubMenuItem[];
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
    badge: null,
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
    label: "Appointments",
    icon: Calendar,
    badge: null,
    subItems: [
      { id: "meal", label: "Meal", icon: Utensils },
      { id: "hydration", label: "Hydration", icon: Droplets },
      { id: "restroom", label: "Restroom", icon: PersonStanding },
      { id: "medication", label: "Medication", icon: Pill },
    ],
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

const SIDEBAR_BADGE_POLL_MS = Number(process.env.NEXT_PUBLIC_CAREGIVER_BADGE_POLL_MS || "30000");
const SIDEBAR_ALERTS_LIMIT = 50;

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
  const [dynamicBadges, setDynamicBadges] = useState<Record<string, string>>({});
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(["reminders"]));

  useEffect(() => {
    // TODO: re-enable when backend is available
    /*
    let mounted = true;
    const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const token = typeof window !== "undefined"
      ? localStorage.getItem("betti_token") || params?.get("betti_token") || params?.get("token")
      : null;
    const userId = typeof window !== "undefined"
      ? localStorage.getItem("betti_user_id") || params?.get("betti_user_id") || params?.get("user_id")
      : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      if (typeof window !== "undefined" && !localStorage.getItem("betti_token")) {
        localStorage.setItem("betti_token", token);
      }
    }
    if (userId && typeof window !== "undefined" && !localStorage.getItem("betti_user_id")) {
      localStorage.setItem("betti_user_id", userId);
    }

    const loadBadges = async () => {
      try {
        let alertCount = 0;
        let assignedPatientIds = new Set<number>();
        if (userId) {
          const assignedRes = await fetch(`${apiUrl}/api/users/${userId}/assigned-patients?active_only=true`, { headers });
          if (assignedRes.ok) {
            const assignedRows = (await assignedRes.json()) as Array<{ active_alerts?: number; patient_id?: number }>;
            alertCount = (assignedRows || []).reduce((sum, row) => sum + Number(row?.active_alerts || 0), 0);
            assignedPatientIds = new Set(
              (assignedRows || [])
                .map((row) => Number(row?.patient_id || 0))
                .filter((id) => id > 0),
            );
          }
        }

        if (alertCount === 0) {
          const alertsRes = await fetch(`${apiUrl}/api/alerts?limit=${SIDEBAR_ALERTS_LIMIT}`, { headers });
          if (alertsRes.ok) {
            const alertRows = (await alertsRes.json()) as Array<{ status?: string | null; patient_id?: number | null }>;
            alertCount = (alertRows || []).filter(
              (row) =>
                String(row?.status || "active").toLowerCase() === "active" &&
                (assignedPatientIds.size === 0 || assignedPatientIds.has(Number(row?.patient_id || 0))),
            ).length;
          }
        }

        if (mounted) {
          if (alertCount > 0) {
            setDynamicBadges({ alerts: String(alertCount) });
          } else {
            setDynamicBadges({});
          }
        }
      } catch {
        if (mounted) {
          setDynamicBadges({});
        }
      }
    };

    void loadBadges();
    const intervalId = window.setInterval(() => {
      void loadBadges();
    }, SIDEBAR_BADGE_POLL_MS);
    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
    */
  }, []);

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
      window.location.href = `${window.location.origin}/`;
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isSubItemActive = (item: MenuItem) =>
    item.subItems?.some((s) => s.id === activeSection) ?? false;

  const renderItem = (item: MenuItem) => {
    const hasChildren = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isActive = activeSection === item.id || isSubItemActive(item);

    return (
      <div key={item.id}>
        <Button
          onClick={() => {
            if (hasChildren && !collapsed) {
              toggleExpanded(item.id);
            }
            handleItemClick(item.id);
          }}
          variant={isActive ? "secondary" : "ghost"}
          className={cn(
            "w-full gap-3 h-10 justify-start text-sm",
            collapsed && "justify-center px-2",
            isActive && "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
          )}
        >
          <item.icon
            className={cn(
              "h-5 w-5 flex-shrink-0",
              isActive ? "text-green-600" : "text-gray-500"
            )}
          />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">{item.label}</span>
              {(dynamicBadges[item.id] || item.badge) && (
                <Badge
                  variant={item.badgeVariant || "secondary"}
                  className="ml-auto text-xs"
                >
                  {dynamicBadges[item.id] || item.badge}
                </Badge>
              )}
              {hasChildren && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0",
                    isExpanded && "rotate-180"
                  )}
                />
              )}
            </>
          )}
        </Button>

        {/* Sub-items */}
        {hasChildren && !collapsed && isExpanded && (
          <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-green-100 pl-3">
            {item.subItems!.map((sub) => (
              <Button
                key={sub.id}
                onClick={() => handleItemClick(sub.id)}
                variant={activeSection === sub.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full gap-2.5 h-9 justify-start text-sm",
                  activeSection === sub.id
                    ? "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                <sub.icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0",
                    activeSection === sub.id ? "text-green-600" : "text-gray-400"
                  )}
                />
                <span className="flex-1 text-left">{sub.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

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

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg">
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
        </div>
      )}
    </div>
  );
}

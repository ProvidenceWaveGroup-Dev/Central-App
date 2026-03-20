"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  Calendar,
  type LucideIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  isMobile?: boolean;
}

type MenuItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string | null;
  badgeVariant?: "destructive" | "secondary";
};

const menuItems: MenuItem[] = [
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
    badge: null,
  },
  {
    id: "appointments",
    label: "Appointments",
    icon: Calendar,
    badge: null,
  },
  {
    id: "caregivers",
    label: "Caregivers",
    icon: UserCog,
    badge: null,
  },
  {
    id: "alerts",
    label: "Alerts & Incidents",
    icon: Bell,
    badge: null,
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
    badge: null,
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
    badge: null,
  },
  {
    id: "fire-service",
    label: "Fire Service Units",
    icon: Flame,
    badge: null,
  },
  {
    id: "communications",
    label: "Communications",
    icon: MessageSquare,
    badge: null,
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
  const router = useRouter();
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [dynamicBadges, setDynamicBadges] = useState<Record<string, string>>({});
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // TODO: re-enable when backend is available
    /*
    let mounted = true;
    const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
    const token = typeof window !== "undefined" ? localStorage.getItem("betti_token") : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const loadBadges = async () => {
      try {
        const [patientsRes, caregiversRes, alertsRes, fallsRes] = await Promise.all([
          fetch(`${apiUrl}/api/patients?home_only=true`, { headers }),
          fetch(`${apiUrl}/api/caregivers?home_only=true`, { headers }),
          fetch(`${apiUrl}/api/alerts?limit=200&home_only=true`, { headers }),
          fetch(`${apiUrl}/api/fall-incidents?limit=200&home_only=true`, { headers }),
        ]);

        const badgeMap: Record<string, string> = {};
        if (patientsRes.ok) {
          const rows = (await patientsRes.json()) as Array<unknown>;
          badgeMap.patients = String((rows || []).length);
        }
        if (caregiversRes.ok) {
          const rows = (await caregiversRes.json()) as Array<unknown>;
          badgeMap.caregivers = String((rows || []).length);
        }
        if (alertsRes.ok) {
          const rows = (await alertsRes.json()) as Array<{ status?: string | null }>;
          const active = (rows || []).filter(
            (row) => String(row?.status || "active").toLowerCase() === "active",
          ).length;
          badgeMap.alerts = String(active);
        }
        if (fallsRes.ok) {
          const rows = (await fallsRes.json()) as Array<unknown>;
          badgeMap["fall-monitoring"] = String((rows || []).length);
        }

        if (mounted) {
          setDynamicBadges(badgeMap);
        }
      } catch {
        if (mounted) {
          setDynamicBadges({});
        }
      }
    };

    void loadBadges();
    return () => {
      mounted = false;
    };
    */
  }, []);

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

  const handleLogout = () => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem("betti_token");
    localStorage.removeItem("betti_user_id");
    localStorage.removeItem("betti_user_role");
    localStorage.removeItem("betti_user_email");
    sessionStorage.removeItem("betti_admin_authenticated");
    sessionStorage.removeItem("betti_admin_email");
    router.replace("/login");
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
                  {(dynamicBadges[item.id] || item.badge) && (
                    <Badge
                      variant={item.badgeVariant || "secondary"}
                      className="ml-auto text-xs"
                    >
                      {dynamicBadges[item.id] || item.badge}
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
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}

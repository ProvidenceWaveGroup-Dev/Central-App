"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SeniorSidebar } from "@/components/senior-sidebar";
import { AlertsProvider } from "@/components/alerts-context";
import { BettiLoader, usePageLoader } from "@/components/betti-loader";
import type { NotificationAlert } from "@/components/alerts-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu, X, Wind, Flame, Droplets, Pill, Thermometer, AlertTriangle } from "lucide-react";

// Centralised alerts data — replace with API fetch
type DbAlert = {
  alert_id?: number | string;
  description?: string | null;
  status?: string | null;
  event_time?: string | null;
  recorded_time?: string | null;
};

const toRelativeTime = (iso?: string | null): string => {
  if (!iso) return "just now";
  const dt = new Date(iso);
  if (!Number.isFinite(dt.getTime())) return "just now";
  const seconds = Math.max(0, Math.floor((Date.now() - dt.getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

const sanitizeAlertText = (value?: string | null): string => {
  const text = String(value || "").trim();
  return text.length > 0 ? text : "Live alert from Betti monitoring";
};

const iconForAlert = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("co2") || lower.includes("air")) return Wind;
  if (lower.includes("voc") || lower.includes("smoke")) return Flame;
  if (lower.includes("humid") || lower.includes("water")) return Droplets;
  if (lower.includes("med")) return Pill;
  if (lower.includes("temp") || lower.includes("thermal")) return Thermometer;
  return AlertTriangle;
};

const severityForAlert = (status?: string | null): "critical" | "warning" | "info" => {
  const value = String(status || "").toLowerCase();
  if (value.includes("critical")) return "critical";
  if (value.includes("ack") || value.includes("warning")) return "warning";
  return "info";
};

const iconColorsForSeverity = (severity: "critical" | "warning" | "info") => {
  if (severity === "critical") return { iconBg: "bg-red-100", iconColor: "text-red-600" };
  if (severity === "warning") return { iconBg: "bg-amber-100", iconColor: "text-amber-600" };
  return { iconBg: "bg-blue-100", iconColor: "text-blue-600" };
};

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/alerts": "Alerts",
  "/profile": "Profile",
  "/settings": "Settings",
  "/device-status": "Device Status",
  "/logs/restroom": "Restroom Activity",
  "/logs/appointments": "Appointments",
  "/logs/meals": "Meals",
  "/logs/pt-exercise": "PT & Exercise",
  "/logs/medications": "Medications",
  "/logs/hydration": "Hydration",
  "/reports": "Reports & Analysis",
};

const PREFETCH_ROUTES = ["/", "/alerts", "/profile", "/settings", "/device-status", "/logs/restroom", "/logs/appointments", "/logs/meals", "/logs/pt-exercise", "/logs/medications", "/logs/hydration", "/reports"];

export function SeniorLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState<NotificationAlert[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const loadLiveAlerts = useCallback(async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
      const token = typeof window !== "undefined" ? window.localStorage.getItem("betti_token") || "" : "";
      if (!token) {
        setLiveAlerts([]);
        return;
      }

      const res = await fetch(`${apiUrl}/api/alerts?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      if (!res.ok) {
        setLiveAlerts([]);
        return;
      }

      const payload = (await res.json()) as unknown;
      const rows = Array.isArray(payload) ? (payload as DbAlert[]) : [];
      const mapped: NotificationAlert[] = rows.slice(0, 20).map((row, idx) => {
        const description = sanitizeAlertText(row.description);
        const severity = severityForAlert(row.status);
        const colors = iconColorsForSeverity(severity);
        return {
          id: String(row.alert_id ?? `db-${idx}`),
          icon: iconForAlert(description),
          title: description.length > 40 ? `${description.slice(0, 40)}...` : description,
          description,
          time: toRelativeTime(row.recorded_time || row.event_time),
          severity,
          iconBg: colors.iconBg,
          iconColor: colors.iconColor,
        };
      });
      setLiveAlerts(mapped);
    } catch {
      setLiveAlerts([]);
    }
  }, []);

  // Prefetch all routes immediately for instant navigation (no spinner between pages)
  useEffect(() => {
    PREFETCH_ROUTES.forEach((route) => router.prefetch(route));
  }, [router]);

  useEffect(() => {
    loadLiveAlerts();
    const timer = window.setInterval(loadLiveAlerts, 30000);
    return () => window.clearInterval(timer);
  }, [loadLiveAlerts]);

  const pageTitle = pageTitles[pathname] || "Dashboard";
  const isInitialLoad = usePageLoader(120);

  return (
    <AlertsProvider alerts={liveAlerts}>
      <BettiLoader isLoading={isInitialLoad} minDisplayTime={80} />
      <div className="min-h-screen bg-white flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <SeniorSidebar
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          />
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/images/betti-logo.png"
                alt="Betti Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <span className="font-bold text-base text-blue-800 font-serif">
                Betti
              </span>
            </div>

            {/* Page Title */}
            <h1 className="font-semibold text-base text-gray-700 truncate max-w-[150px] sm:max-w-none">
              {pageTitle}
            </h1>

            {/* Hamburger Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 top-16 bg-black/30 backdrop-blur-sm z-40 flex justify-end animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="h-full animate-in slide-in-from-right duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <SeniorSidebar
                isMobile
                onNavigate={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto pt-16 lg:pt-0">
          {children}
        </main>
      </div>
    </AlertsProvider>
  );
}

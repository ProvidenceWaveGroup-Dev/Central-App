"use client";

import { useState } from "react";
import { CaregiverSidebar } from "@/components/caregiver-sidebar";
import { AlertsProvider, useAlerts } from "@/components/alerts-context";
import type { NotificationAlert } from "@/components/alerts-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu, X, Bell, Wind, Flame, Droplets, Pill, Thermometer } from "lucide-react";

// Centralised alerts data -- replace with API fetch
const NOTIFICATION_ALERTS: NotificationAlert[] = [
  { id: "n1", icon: Wind, title: "CO\u2082 Level Critical", description: "Bathroom CO\u2082 at 1,350 ppm \u2014 ventilation needed", time: "Just now", severity: "critical", iconBg: "bg-red-100", iconColor: "text-red-600" },
  { id: "n2", icon: Flame, title: "VOC Trend Rising", description: "VOC levels increased 18.5% in the last 24 hours", time: "30 min ago", severity: "warning", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  { id: "n3", icon: Droplets, title: "Mold Risk \u2014 Bathroom", description: "Humidity at 72% for 3h 45m. Mold growth risk elevated.", time: "1 hr ago", severity: "warning", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  { id: "n4", icon: Pill, title: "Medication Reminder", description: "Afternoon pills are due \u2014 2:00 PM scheduled", time: "2 hrs ago", severity: "info", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
  { id: "n5", icon: Thermometer, title: "Warm Zone Alert", description: "Bathroom temperature at 82\u00B0F \u2014 approaching heat risk", time: "3 hrs ago", severity: "info", iconBg: "bg-orange-100", iconColor: "text-orange-600" },
];

const sectionTitles: Record<string, string> = {
  dashboard: "Dashboard",
  activity: "Activity Feed",
  health: "Health & Wellness",
  location: "Location",
  alerts: "Alerts & Safety",
  communication: "Communication",
  reminders: "Reminders & Scheduling",
  reports: "Reports/Insights",
  security: "Security",
};

// Notification bell — rendered inside AlertsProvider so it can call useAlerts()
function NotificationBellHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const { alerts: notificationAlerts, readAlertIds, unreadCount, markAsRead } = useAlerts();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-gray-200 bg-white shadow-xl z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-base font-semibold text-gray-900">Alerts</h3>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button onClick={() => setShowNotifications(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
              {notificationAlerts.map((alert) => {
                const isUnread = !readAlertIds.includes(alert.id);
                return (
                  <div
                    key={alert.id}
                    onClick={() => markAsRead(alert.id)}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer ${isUnread ? "bg-blue-50/40" : ""}`}
                  >
                    <div className="flex-shrink-0 flex items-center pt-3">
                      <span className={`h-2 w-2 rounded-full ${isUnread ? "bg-[#233E7D]" : "bg-transparent"}`} />
                    </div>
                    <div className={`flex-shrink-0 w-9 h-9 rounded-full ${alert.iconBg} flex items-center justify-center mt-0.5`}>
                      <alert.icon className={`h-4 w-4 ${alert.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm truncate ${isUnread ? "font-bold text-gray-900" : "font-normal text-gray-600"}`}>{alert.title}</span>
                        {alert.severity === "critical" && (
                          <span className="inline-flex rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">Critical</span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 line-clamp-2 ${isUnread ? "font-semibold text-gray-700" : "font-normal text-gray-500"}`}>{alert.description}</p>
                      <span className="text-[11px] text-gray-400 mt-1 block">{alert.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface CaregiverLayoutShellProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function CaregiverLayoutShell({
  children,
  activeSection,
  onSectionChange,
}: CaregiverLayoutShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const pageTitle = sectionTitles[activeSection] || "Dashboard";

  return (
    <AlertsProvider alerts={NOTIFICATION_ALERTS}>
    <div className="min-h-screen bg-white flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <CaregiverSidebar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
        />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/betti-logo.png"
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
          <h1 className="font-semibold text-base text-gray-700 truncate max-w-[100px] sm:max-w-none">
            {pageTitle}
          </h1>

          {/* Bell + Hamburger */}
          <div className="flex items-center gap-2">
            <NotificationBellHeader />
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
            <CaregiverSidebar
              isMobile
              onNavigate={() => setMobileMenuOpen(false)}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        {/* Desktop Bell Bar */}
        <div className="hidden lg:flex items-center justify-end px-8 py-3 border-b border-gray-100">
          <NotificationBellHeader />
        </div>
        {children}
      </main>
    </div>
    </AlertsProvider>
  );
}

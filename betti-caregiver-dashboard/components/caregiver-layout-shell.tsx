"use client";

import { useState } from "react";
import { CaregiverSidebar } from "@/components/caregiver-sidebar";
import { UserProfileBanner } from "@/components/user-profile-banner";
import { LiveDataSummary } from "@/components/live-data-summary";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu, X } from "lucide-react";

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
        <UserProfileBanner />
        <LiveDataSummary />
        {children}
      </main>
    </div>
  );
}

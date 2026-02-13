"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { EmsSidebar } from "@/components/ems-sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/health-wellness": "Health & Wellness",
  "/activity-feed": "Activity Feed",
  "/occupancy": "Monitoring",
  "/communication": "Communication",
  "/appointments": "Appointments",
  "/insights": "Insights & Reports",
  "/security": "Security",
  "/settings": "Settings",
};

export function EmsLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();

  const pageTitle = pageTitles[pathname] || "Dashboard";

  return (
    <div className="min-h-screen bg-white flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <EmsSidebar
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
            <EmsSidebar
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
  );
}

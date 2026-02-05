"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { OverviewSection } from "@/components/sections/overview-section";
import { PatientsSection } from "@/components/sections/patients-section";
import { CaregiversSection } from "@/components/sections/caregivers-section";
import { AlertsSection } from "@/components/sections/alerts-section";
import { DevicesSection } from "@/components/sections/devices-section";
import { FallMonitoringSection } from "@/components/sections/fall-monitoring-section";
import { AIRulesSection } from "@/components/sections/ai-rules-section";
import { EmergencySection } from "@/components/sections/emergency-section";
import { SecurityAgenciesSection } from "@/components/sections/security-agencies-section";
import { FireServiceSection } from "@/components/sections/fire-service-section";
import { CommunicationsSection } from "@/components/sections/communications-section";
import { ReportsSection } from "@/components/sections/reports-section";
import { BillingSection } from "@/components/sections/billing-section";
import { FacilitiesSection } from "@/components/sections/facilities-section";
import { SecuritySection } from "@/components/sections/security-section";
import { AdminManagementSection } from "@/components/sections/admin-management-section";
import { SettingsSection } from "@/components/sections/settings-section";
import { BettiLoader, usePageLoader } from "@/components/betti-loader";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";

// Section titles for mobile header
const sectionTitles: Record<string, string> = {
  overview: "Overview",
  patients: "Patients",
  caregivers: "Caregivers",
  alerts: "Alerts & Incidents",
  devices: "Devices & Sensors",
  "fall-monitoring": "Fall Monitoring",
  "ai-rules": "AI & Rules",
  emergency: "Emergency Response",
  "security-agencies": "Security Agencies",
  "fire-service": "Fire Service Units",
  communications: "Communications",
  reports: "Reports & Analytics",
  billing: "Billing & RPM",
  facilities: "Facilities",
  security: "Security & Access",
  "admin-management": "Admin Management",
  settings: "Settings",
};

export default function AdminDashboard() {
  const isPageLoading = usePageLoader(1500);
  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <OverviewSection onNavigate={setActiveSection} />;
      case "patients":
        return <PatientsSection />;
      case "caregivers":
        return <CaregiversSection />;
      case "alerts":
        return <AlertsSection />;
      case "devices":
        return <DevicesSection />;
      case "fall-monitoring":
        return <FallMonitoringSection />;
      case "ai-rules":
        return <AIRulesSection />;
      case "emergency":
        return <EmergencySection />;
      case "security-agencies":
        return <SecurityAgenciesSection />;
      case "fire-service":
        return <FireServiceSection />;
      case "communications":
        return <CommunicationsSection />;
      case "reports":
        return <ReportsSection />;
      case "billing":
        return <BillingSection />;
      case "facilities":
        return <FacilitiesSection />;
      case "security":
        return <SecuritySection />;
      case "admin-management":
        return <AdminManagementSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <BettiLoader isLoading={isPageLoading} />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
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
            <span className="font-bold text-base">Betti</span>
          </div>

          {/* Page Title */}
          <h1 className="font-semibold text-base truncate max-w-[150px] sm:max-w-none">
            {sectionTitles[activeSection] || "Dashboard"}
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
          className="lg:hidden fixed inset-0 top-16 bg-black/50 z-40 flex justify-end"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <AdminSidebar
              activeSection={activeSection}
              onSectionChange={(section) => {
                setActiveSection(section);
                setMobileMenuOpen(false);
              }}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 lg:pt-0">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}

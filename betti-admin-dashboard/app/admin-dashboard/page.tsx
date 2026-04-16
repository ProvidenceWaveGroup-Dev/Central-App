"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar";
import { OverviewSection } from "@/components/sections/overview-section";
import { PatientsSection } from "@/components/sections/patients-section";
import { AppointmentsSection } from "@/components/sections/appointments-section";
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
import { HousingSection } from "@/components/sections/housing-section";
import { ComplianceSection } from "@/components/sections/compliance-section";
import { AuditLogSection } from "@/components/sections/audit-log-section";
import { SocialImpactSection } from "@/components/sections/social-impact-section";
import { BettiLoader, usePageLoader } from "@/components/betti-loader";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";

// Section titles for mobile header
const sectionTitles: Record<string, string> = {
  overview: "Overview",
  patients: "Residents",
  appointments: "Appointments",
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
  housing: "Housing & Transitional Living",
  compliance: "Compliance",
  "audit-log": "Audit Log",
  "social-impact": "Social Impact",
  settings: "Settings",
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
};

const tokenExpired = (token: string): boolean => {
  const payload = decodeJwtPayload(token);
  const exp = Number(payload?.exp);
  if (!Number.isFinite(exp) || exp <= 0) {
    return false;
  }
  return Date.now() >= exp * 1000;
};

export default function AdminDashboard() {
  const router = useRouter();
  const isPageLoading = usePageLoader(1500);
  const [activeSection, setActiveSection] = useState("overview");
  const [mountedSections, setMountedSections] = useState<Record<string, boolean>>({ overview: true });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // TODO: re-enable auth check when backend is available
    // if (typeof window === "undefined") {
    //   return;
    // }
    // const params = new URLSearchParams(window.location.search);
    // const queryToken = params.get("betti_token") || params.get("token");
    // const queryRole = params.get("betti_role") || params.get("role");
    // const queryUserId = params.get("betti_user_id") || params.get("user_id");
    // const queryEmail = params.get("betti_email") || params.get("email");
    // if (queryToken) { localStorage.setItem("betti_token", queryToken); }
    // if (queryRole) { localStorage.setItem("betti_user_role", queryRole); }
    // if (queryUserId) { localStorage.setItem("betti_user_id", queryUserId); }
    // if (queryEmail) { localStorage.setItem("betti_user_email", queryEmail); }
    // const token = localStorage.getItem("betti_token") || "";
    // const roleFromStorage = String(localStorage.getItem("betti_user_role") || "").toLowerCase();
    // const decodedRole = String(decodeJwtPayload(token)?.role || "").toLowerCase();
    // const role = roleFromStorage || decodedRole;
    // if (role && !roleFromStorage) { localStorage.setItem("betti_user_role", role); }
    // const authenticated = token && role === "admin" && !tokenExpired(token);
    // if (!authenticated) {
    //   localStorage.removeItem("betti_token");
    //   localStorage.removeItem("betti_user_id");
    //   localStorage.removeItem("betti_user_role");
    //   localStorage.removeItem("betti_user_email");
    //   sessionStorage.removeItem("betti_admin_authenticated");
    //   sessionStorage.removeItem("betti_admin_email");
    //   router.replace("/login");
    //   return;
    // }

    // Bypass auth — allow direct access
    setAuthReady(true);
  }, [router]);

  useEffect(() => {
    setMountedSections((prev) => (prev[activeSection] ? prev : { ...prev, [activeSection]: true }));
  }, [activeSection]);

  const sectionViews: Record<string, JSX.Element> = {
    overview: <OverviewSection onNavigate={setActiveSection} />,
    patients: <PatientsSection />,
    appointments: <AppointmentsSection />,
    caregivers: <CaregiversSection />,
    alerts: <AlertsSection />,
    devices: <DevicesSection />,
    "fall-monitoring": <FallMonitoringSection />,
    "ai-rules": <AIRulesSection />,
    emergency: <EmergencySection />,
    "security-agencies": <SecurityAgenciesSection />,
    "fire-service": <FireServiceSection />,
    communications: <CommunicationsSection />,
    reports: <ReportsSection />,
    billing: <BillingSection />,
    facilities: <FacilitiesSection />,
    security: <SecuritySection />,
    "admin-management": <AdminManagementSection />,
    housing: <HousingSection />,
    compliance: <ComplianceSection />,
    "audit-log": <AuditLogSection />,
    "social-impact": <SocialImpactSection />,
    settings: <SettingsSection />,
  };

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Validating admin session...
      </div>
    );
  }

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
          {Object.entries(sectionViews).map(([sectionKey, sectionComponent]) => {
            if (!mountedSections[sectionKey]) {
              return null;
            }
            return (
              <div
                key={sectionKey}
                className={activeSection === sectionKey ? "block" : "hidden"}
                aria-hidden={activeSection !== sectionKey}
              >
                {sectionComponent}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

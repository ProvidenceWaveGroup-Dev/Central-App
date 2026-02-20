"use client";

import { useState } from "react";
import { CaregiverLayoutShell } from "@/components/caregiver-layout-shell";
import { RealTimeStatus } from "@/components/real-time-status";
import { ActivityFeed } from "@/components/activity-feed";
import { AlertsSafety } from "@/components/alerts-safety";
import { HealthSummary } from "@/components/health-summary";
import { CommunicationTools } from "@/components/communication-tools";
import { RemindersScheduling } from "@/components/reminders-scheduling";
import { InsightsTrends } from "@/components/insights-trends";
import { MentalHealthCard } from "@/components/mental-health-card";
import { OccupancyCard } from "@/components/occupancy-card";
import { FallAlertCard } from "@/components/fall-alert-card";
import { EnvironmentCard } from "@/components/environment-card";
import { CO2MonitoringCard } from "@/components/co2-monitoring-card";
import { VOCHazardCard } from "@/components/voc-hazard-card";
import { ThermalRiskCard } from "@/components/thermal-risk-card";
import { HumidityRiskCard } from "@/components/humidity-risk-card";
import SecurityPage from "./security/page";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <RealTimeStatus />

            {/* Fall Alert Card - Priority placement */}
            <FallAlertCard />

            <MentalHealthCard />

            <EnvironmentCard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <CO2MonitoringCard />
              <VOCHazardCard />
              <ThermalRiskCard />
              <HumidityRiskCard />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              {/* Top Row */}
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <AlertsSafety />
                <ActivityFeed />
              </div>
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <HealthSummary />
                <CommunicationTools />
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              <RemindersScheduling />
              <InsightsTrends />
            </div>
          </div>
        );
      case "activity":
        return <ActivityFeed />;
      case "health":
        return <HealthSummary />;
      case "alerts":
        return <AlertsSafety />;
      case "communication":
        return <CommunicationTools />;
      case "reminders":
        return <RemindersScheduling />;
      case "reports":
        return <InsightsTrends />;
      case "location":
        return <OccupancyCard />;
      case "security":
        return <SecurityPage />;
      default:
        return <div>Section not found</div>;
    }
  };

  return (
    <CaregiverLayoutShell
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{renderMainContent()}</div>
        </div>
      </CaregiverLayoutShell>
  );
}

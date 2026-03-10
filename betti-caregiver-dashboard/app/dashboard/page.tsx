"use client";

import { useState } from "react";
import { CaregiverLayoutShell } from "@/components/caregiver-layout-shell";
import { RealTimeStatus } from "@/components/real-time-status";
import { HealthSummary } from "@/components/health-summary";
import { AlertsSafety } from "@/components/alerts-safety";
import { ActivityFeed } from "@/components/activity-feed";
import { CommunicationTools } from "@/components/communication-tools";
import { RemindersScheduling } from "@/components/reminders-scheduling";
import { InsightsTrends } from "@/components/insights-trends";

export default function CaregiverDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RealTimeStatus />
              </div>
              <div>
                <HealthSummary />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <AlertsSafety />
              <ActivityFeed />
            </div>
          </div>
        );
      case "communication":
        return <CommunicationTools />;
      case "reminders":
        return <RemindersScheduling />;
      case "reports":
        return <InsightsTrends />;
      default:
        return (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <RealTimeStatus />
              </div>
              <div>
                <HealthSummary />
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <AlertsSafety />
              <ActivityFeed />
            </div>
          </div>
        );
    }
  };

  return (
    <CaregiverLayoutShell
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      <div className="p-6 lg:p-8">
        {renderContent()}
      </div>
    </CaregiverLayoutShell>
  );
}

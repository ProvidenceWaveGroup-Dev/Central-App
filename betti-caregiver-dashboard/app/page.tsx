"use client";

import { useEffect, useState } from "react";
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
import { BettiLoader, usePageLoader } from "@/components/betti-loader";
import { DisclaimerBar } from "@/components/disclaimer-bar";
import SecurityPage from "./security/page";

type AssignedPatient = {
  patient_id: number;
  patient_name: string;
  facility_name: string;
  active_alerts: number;
  medications: string[];
};

export default function Dashboard() {
  const isPageLoading = usePageLoader(400);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [assignedPatients, setAssignedPatients] = useState<AssignedPatient[]>([]);

  useEffect(() => {
    // TODO: re-enable backend fetch when API is available
    // if (typeof window === "undefined") return;
    // let mounted = true;
    // ... (fetch assigned patients from API) ...
    // fetch(`${apiUrl}/api/users/${userId}/assigned-patients?active_only=true`, { headers })
    //   .then(...).catch(() => { if (mounted) setAssignedPatients([]); });
    // return () => { mounted = false; };
  }, []);

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <RealTimeStatus />
            <FallAlertCard />
            <MentalHealthCard />
            <EnvironmentCard />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <AlertsSafety />
                <ActivityFeed />
              </div>
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <HealthSummary />
                <CommunicationTools />
              </div>
            </div>

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
    <>
      <BettiLoader isLoading={isPageLoading} minDisplayTime={300} />
      <CaregiverLayoutShell activeSection={activeSection} onSectionChange={setActiveSection}>
        <div className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{renderMainContent()}</div>
        </div>
        <DisclaimerBar />
      </CaregiverLayoutShell>
    </>
  );
}

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
import { User } from "lucide-react";
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
    if (typeof window === "undefined") {
      return;
    }
    let mounted = true;
    const params = new URLSearchParams(window.location.search);
    const queryToken = params.get("betti_token") || params.get("token") || "";
    const queryUserId = params.get("betti_user_id") || params.get("user_id") || "";
    // Query bootstrap values are authoritative for role-launch flows.
    if (queryToken) {
      localStorage.setItem("betti_token", queryToken);
    }
    if (queryUserId) {
      localStorage.setItem("betti_user_id", queryUserId);
    }

    const decodeJwtSub = (token: string): string | null => {
      if (!token) return null;
      try {
        const payloadPart = token.split(".")[1];
        if (!payloadPart) return null;
        const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
        const decoded = atob(padded);
        const payload = JSON.parse(decoded) as { sub?: unknown };
        const sub = Number(payload?.sub);
        return Number.isFinite(sub) && sub > 0 ? String(sub) : null;
      } catch {
        return null;
      }
    };

    let userId = localStorage.getItem("betti_user_id");
    const tokenFromStorage = localStorage.getItem("betti_token") || queryToken;
    if (!userId && tokenFromStorage) {
      const sub = decodeJwtSub(tokenFromStorage);
      if (sub) {
        userId = sub;
        localStorage.setItem("betti_user_id", sub);
      }
    }
    if (!userId) {
      return;
    }
    const token = tokenFromStorage || "";
    const headers: Record<string, string> = token
      ? { Authorization: `Bearer ${token}` }
      : {};
    const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
    const toArray = <T,>(payload: unknown): T[] => {
      if (Array.isArray(payload)) {
        return payload as T[];
      }
      if (payload && typeof payload === "object") {
        const objectPayload = payload as { value?: unknown; items?: unknown; data?: unknown };
        if (Array.isArray(objectPayload.value)) {
          return objectPayload.value as T[];
        }
        if (Array.isArray(objectPayload.items)) {
          return objectPayload.items as T[];
        }
        if (Array.isArray(objectPayload.data)) {
          return objectPayload.data as T[];
        }
      }
      return [];
    };
    fetch(`${apiUrl}/api/users/${userId}/assigned-patients?active_only=true`, { headers })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("assignment fetch failed");
        }
        return res.json();
      })
      .then(
        async (
          rows: Array<{
            patient_id?: number;
            patient_name?: string;
            facility_name?: string;
            active_alerts?: number;
            medications?: string[];
          }>,
        ) => {
          const mapped = toArray<{
            patient_id?: number;
            patient_name?: string;
            facility_name?: string;
            active_alerts?: number;
            medications?: string[];
          }>(rows)
            .map((row) => ({
              patient_id: Number(row.patient_id || 0),
              patient_name: row.patient_name || "Unknown patient",
              facility_name: row.facility_name || "Unassigned home",
              active_alerts: Number(row.active_alerts || 0),
              medications: Array.isArray(row.medications) ? row.medications.filter(Boolean) : [],
            }))
            .filter((row) => Number.isFinite(row.patient_id) && row.patient_id > 0);
          if (mapped.length > 0) {
            if (mounted) {
              setAssignedPatients(mapped);
            }
            return;
          }

          const fallbackRes = await fetch(`${apiUrl}/api/patients`, { headers });
          if (!fallbackRes.ok) {
            if (mounted) {
              setAssignedPatients([]);
            }
            return;
          }
          const fallbackRows = toArray<{
            patient_id?: number;
            first_name?: string;
            last_name?: string;
            facility_id?: number;
          }>(await fallbackRes.json());
          const fallbackMapped = (fallbackRows || []).slice(0, 6).map((row) => ({
            patient_id: Number(row.patient_id || 0),
            patient_name: `${row.first_name || ""} ${row.last_name || ""}`.trim() || "Unknown patient",
            facility_name: row.facility_id ? `Facility ${row.facility_id}` : "Unassigned home",
            active_alerts: 0,
            medications: [],
          }));
          if (mounted) {
            setAssignedPatients(fallbackMapped.filter((row) => row.patient_id > 0));
          }
        },
      )
      .catch(() => {
        if (mounted) {
          setAssignedPatients([]);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const renderMainContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {assignedPatients.length > 0 && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-[#233E7D]" />
                  <h2 className="font-serif text-lg font-semibold text-[#233E7D]">Assigned Patients (Live)</h2>
                </div>
                <div className="grid gap-2 md:grid-cols-2">
                  {assignedPatients.slice(0, 6).map((patient) => (
                    <div key={patient.patient_id} className="rounded-lg border border-blue-100 bg-white px-3 py-2">
                      <div className="text-sm font-medium text-gray-800">{patient.patient_name}</div>
                      <div className="text-xs text-gray-600">
                        {patient.facility_name} - active alerts: {patient.active_alerts}
                      </div>
                      {patient.medications.length > 0 && (
                        <div className="text-xs text-gray-600">
                          Shared meds: {patient.medications.slice(0, 2).join(", ")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
      </CaregiverLayoutShell>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  AlertTriangle,
  Search,
  Bell,
  CheckCircle,
  Clock,
  PersonStanding,
  Pill,
  Activity,
  Phone,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

// Schema-aligned: alerts, alert_details, severity_levels, alert_types
interface Alert {
  alert_id: number;
  patient_id: number;
  patient_name: string; // Joined from patients table
  alert_type_id: number;
  alert_type: "fall" | "medication" | "inactivity" | "panic" | "vital" | "wandering";
  severity_level_id: number;
  severity: {
    level_name: "Critical" | "High" | "Medium" | "Low";
    priority: number;
    color_code: string;
  };
  description: string;
  status: "active" | "acknowledged" | "resolved" | "escalated";
  feedback_status: "unreviewed" | "confirmed" | "true_positive" | "false_positive" | "false_alarm";
  event_time: string;
  // From alert_details
  details: { key: string; value: string; confidence: number }[];
  // Joined data
  location: string;
  assigned_caregiver: string;
}

type AlertRow = {
  alert_id: number;
  patient_id: number;
  alert_type_id: number;
  severity_level_id: number;
  description?: string;
  status?: Alert["status"];
  feedback_status?: Alert["feedback_status"];
  event_time: string;
};

type PatientRow = {
  patient_id: number;
  first_name?: string;
  last_name?: string;
};

type ProfileRow = {
  patient_id: number;
  facility_name?: string;
  primary_caregiver?: string;
};

const severityLevels = {
  1: { level_name: "Critical" as const, priority: 1, color_code: "#FF0000" },
  2: { level_name: "High" as const, priority: 2, color_code: "#FF9900" },
  3: { level_name: "Medium" as const, priority: 3, color_code: "#FFCC00" },
  4: { level_name: "Low" as const, priority: 4, color_code: "#00CC00" },
};

const alertTypeById: Record<number, Alert["alert_type"]> = {
  1: "panic",
  2: "medication",
  3: "fall",
  4: "inactivity",
  5: "vital",
  6: "wandering",
};

const getAlertIcon = (type: Alert["alert_type"]) => {
  switch (type) {
    case "fall":
      return PersonStanding;
    case "medication":
      return Pill;
    case "inactivity":
      return Clock;
    case "panic":
      return Phone;
    case "vital":
      return Activity;
    case "wandering":
      return PersonStanding;
    default:
      return Bell;
  }
};

// Helper to format time ago
const formatTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  // Use ISO format for consistency between server and client
  return date.toISOString().split("T")[0];
};

const ITEMS_PER_PAGE = 4;

export function AlertsSection() {
  const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [alertsData, setAlertsData] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const authHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("betti_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

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

  useEffect(() => {
    let isMounted = true;

    const loadAlerts = async () => {
      try {
        const headers = authHeaders();
        if (!headers.Authorization) {
          throw new Error("Login session not found. Please sign in again.");
        }
        const [alertsRes, patientsRes, profileRes] = await Promise.all([
          fetch(`${apiUrl}/api/alerts?limit=50&home_only=true`, { headers }),
          fetch(`${apiUrl}/api/patients?home_only=true`, { headers }),
          fetch(`${apiUrl}/api/patient-profiles?limit=500&home_only=true`, { headers }),
        ]);

        if (!alertsRes.ok) {
          throw new Error("Failed to load alerts");
        }

        const alerts = toArray<AlertRow>(await alertsRes.json().catch(() => []));
        const patients = patientsRes.ok
          ? toArray<PatientRow>(await patientsRes.json().catch(() => []))
          : [];
        const profiles = profileRes.ok
          ? toArray<ProfileRow>(await profileRes.json().catch(() => []))
          : [];
        const patientMap = new Map(
          (patients || []).map((p) => [p.patient_id, `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim()])
        );
        const profileMap = new Map(
          (profiles || []).map((profile) => [profile.patient_id, profile]),
        );

        const mapped: Alert[] = (alerts || []).map((alert) => {
          const severity = severityLevels[alert.severity_level_id as keyof typeof severityLevels] || severityLevels[3];
          const alertType = alertTypeById[alert.alert_type_id] || "vital";
          const profile = profileMap.get(alert.patient_id);
          return {
            alert_id: alert.alert_id,
            patient_id: alert.patient_id,
            patient_name: patientMap.get(alert.patient_id) || `Patient ${alert.patient_id}`,
            alert_type_id: alert.alert_type_id,
            alert_type: alertType,
            severity_level_id: alert.severity_level_id,
            severity,
            description: alert.description || "Alert",
            status: alert.status || "active",
            feedback_status: alert.feedback_status || "unreviewed",
            event_time: alert.event_time,
            details: [],
            location: profile?.facility_name || "N/A",
            assigned_caregiver: profile?.primary_caregiver || "Unassigned",
          };
        });

        if (isMounted) setAlertsData(mapped);
        if (isMounted && (!patientsRes.ok || !profileRes.ok)) {
          const missing: string[] = [];
          if (!patientsRes.ok) missing.push("patients");
          if (!profileRes.ok) missing.push("profiles");
          setLoadError(`Partial alert context loaded. Missing: ${missing.join(", ")}.`);
        } else if (isMounted) {
          setLoadError("");
        }
      } catch (error) {
        if (isMounted) {
          setLoadError("Unable to load alerts.");
          setAlertsData([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadAlerts();

    return () => {
      isMounted = false;
    };
  }, [apiUrl]);

  const handleResolveAlert = async (alertId: number) => {
    setIsSaving(true);
    try {
      const response = await fetch(`${apiUrl}/api/alerts/${alertId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          status: "resolved",
          feedback_status: "true_positive",
        }),
      });
      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update alert");
      }
      setAlertsData((prev) =>
        prev.map((alert) =>
          alert.alert_id === alertId
            ? { ...alert, status: "resolved" as const, feedback_status: "true_positive" as const }
            : alert,
        ),
      );
      toast.success("Alert updated", {
        description: `Alert #${alertId} marked as resolved.`,
      });
    } catch (error) {
      toast.error("Failed to update alert", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewAlert = (alert: Alert) => {
    toast.info(`Alert #${alert.alert_id}`, {
      description: `${alert.patient_name} - ${alert.description}`,
      duration: 5000,
    });
  };

  const filteredAlerts = alertsData.filter((alert) => {
    const matchesSearch =
      alert.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.alert_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || alert.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Reset to page 1 when search or filter changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilter = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredAlerts.length / ITEMS_PER_PAGE);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const criticalAlerts = alertsData.filter(a => a.severity.level_name === "Critical" && a.status !== "resolved");
  const activeAlerts = alertsData.filter(a => a.status === "active");
  const acknowledgedAlerts = alertsData.filter(a => a.status === "acknowledged" || a.status === "escalated");
  const resolvedToday = alertsData.filter(a => a.status === "resolved");

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {loadError && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {loadError}
        </div>
      )}
      {isLoading && !loadError && (
        <div className="mb-4 rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
          Loading alerts...
        </div>
      )}
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alerts & Incidents</h1>
            <p className="text-muted-foreground">
              Monitor and manage all system alerts
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${filter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilter("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{criticalAlerts.length}</div>
                <div className="text-xs text-muted-foreground">Critical</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${filter === "active" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilter("active")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeAlerts.length}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${filter === "acknowledged" || filter === "escalated" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilter("acknowledged")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{acknowledgedAlerts.length}</div>
                <div className="text-xs text-muted-foreground">In Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${filter === "resolved" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilter("resolved")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{resolvedToday.length}</div>
                <div className="text-xs text-muted-foreground">Resolved</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "active", "acknowledged", "escalated", "resolved"].map((status) => (
              <Button
                key={status}
                variant={filter === status ? "default" : "outline"}
                size="sm"
                onClick={() => handleFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Alerts List */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        <div className="space-y-4 pb-4">
        {paginatedAlerts.map((alert) => {
          const AlertIcon = getAlertIcon(alert.alert_type);
          const isCritical = alert.severity.level_name === "Critical";
          const isHigh = alert.severity.level_name === "High";
          return (
            <Card
              key={alert.alert_id}
              className={`bg-white dark:bg-card ${
                isCritical
                  ? "border-red-300 dark:border-red-800"
                  : isHigh
                  ? "border-orange-300 dark:border-orange-800"
                  : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        isCritical
                          ? "bg-red-100 dark:bg-red-900/50"
                          : isHigh
                          ? "bg-orange-100 dark:bg-orange-900/50"
                          : "bg-muted"
                      }`}
                    >
                      <AlertIcon
                        className={`h-5 w-5 ${
                          isCritical
                            ? "text-red-600"
                            : isHigh
                            ? "text-orange-600"
                            : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{alert.patient_name}</span>
                        <Badge
                          variant={
                            alert.status === "resolved"
                              ? "secondary"
                              : alert.status === "acknowledged"
                              ? "default"
                              : alert.status === "escalated"
                              ? "destructive"
                              : "destructive"
                          }
                        >
                          {alert.status}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {alert.alert_type}
                        </Badge>
                        <Badge
                          variant="outline"
                          style={{ borderColor: alert.severity.color_code, color: alert.severity.color_code }}
                          className="text-xs"
                        >
                          {alert.severity.level_name}
                        </Badge>
                        {alert.feedback_status !== "unreviewed" && (
                          <Badge
                            variant={
                              alert.feedback_status === "confirmed" || alert.feedback_status === "true_positive"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {alert.feedback_status === "confirmed" || alert.feedback_status === "true_positive"
                              ? "Confirmed"
                              : alert.feedback_status === "false_alarm"
                              ? "False Alarm"
                              : "False Positive"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                        <span>Location: {alert.location}</span>
                        <span>Caregiver: {alert.assigned_caregiver}</span>
                        <span>{formatTimeAgo(alert.event_time)}</span>
                      </div>
                      {alert.details.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {alert.details.map((detail, idx) => (
                            <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                              {detail.key}: {detail.value} ({(detail.confidence * 100).toFixed(0)}%)
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => handleViewAlert(alert)}>
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    {alert.status !== "resolved" && (
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => void handleResolveAlert(alert.alert_id)}
                        disabled={isSaving}
                      >
                        <CheckCircle className="h-3 w-3" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>
      </div>

      {/* Fixed Pagination at Bottom */}
      <div className="flex-shrink-0 pt-4 border-t bg-background">
        <PaginationControlled
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredAlerts.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}

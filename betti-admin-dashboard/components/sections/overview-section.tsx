"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Heart,
  PersonStanding,
  TrendingDown,
  TrendingUp,
  UserCog,
  Users,
  XCircle,
} from "lucide-react";

type PatientRow = {
  patient_id: number;
  first_name: string;
  last_name: string;
  facility_id: number | null;
};

type CaregiverRow = {
  user_id: number;
  status?: string | null;
  is_active?: boolean | null;
};

type AlertRow = {
  alert_id: number;
  patient_id: number;
  facility_id: number | null;
  alert_type_id: number;
  severity_level_id: number;
  status?: string | null;
  event_time?: string | null;
  recorded_time?: string | null;
  description?: string | null;
};

type FacilityRow = {
  facility_id: number;
  name: string;
  facility_type?: string | null;
  status?: string | null;
  is_active?: boolean | null;
};

type VitalRow = {
  patient_id: number;
};

type PatientProfileRow = {
  patient_id: number;
  latest_risk_score?: number | null;
  falls_90d?: number | null;
};

const alertTypeById: Record<number, string> = {
  1: "panic",
  2: "medication",
  3: "fall",
  4: "inactivity",
  5: "vital",
  6: "wandering",
};

const severityById: Record<number, "Critical" | "High" | "Medium" | "Low"> = {
  1: "Critical",
  2: "High",
  3: "Medium",
  4: "Low",
};

const formatTimeAgo = (dateStr: string | null | undefined): string => {
  if (!dateStr) {
    return "N/A";
  }
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return date.toISOString().split("T")[0];
};

const percent = (num: number, den: number): number => {
  if (!den) return 0;
  return Math.max(0, Math.min(100, Math.round((num / den) * 100)));
};

const OVERVIEW_ALERTS_LIMIT = 50;
const OVERVIEW_PROFILES_LIMIT = 120;
const OVERVIEW_DEFAULT_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_ADMIN_OVERVIEW_TIMEOUT_MS || "30000");
const OVERVIEW_CAREGIVERS_TIMEOUT_MS = Number(
  process.env.NEXT_PUBLIC_ADMIN_OVERVIEW_CAREGIVER_TIMEOUT_MS || "25000",
);
const OVERVIEW_CACHE_KEY = "betti_admin_overview_section_v1";
const OVERVIEW_CACHE_TTL_MS = 120000;

interface OverviewSectionProps {
  onNavigate?: (section: string) => void;
}

export function OverviewSection({ onNavigate }: OverviewSectionProps) {
  const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [caregivers, setCaregivers] = useState<CaregiverRow[]>([]);
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [facilities, setFacilities] = useState<FacilityRow[]>([]);
  const [vitals, setVitals] = useState<VitalRow[]>([]);
  const [profiles, setProfiles] = useState<PatientProfileRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");

  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    const token = typeof window !== "undefined" ? localStorage.getItem("betti_token") : null;
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

  const fetchWithTimeout = async (
    url: string,
    init: RequestInit,
    timeoutMs = OVERVIEW_DEFAULT_TIMEOUT_MS,
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const readCachedOverview = (): {
    patients: PatientRow[];
    caregivers: CaregiverRow[];
    alerts: AlertRow[];
    facilities: FacilityRow[];
    vitals: VitalRow[];
    profiles: PatientProfileRow[];
  } | null => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const raw = sessionStorage.getItem(OVERVIEW_CACHE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as {
        ts?: number;
        patients?: unknown;
        caregivers?: unknown;
        alerts?: unknown;
        facilities?: unknown;
        vitals?: unknown;
        profiles?: unknown;
      };
      const ts = Number(parsed.ts || 0);
      if (!Number.isFinite(ts) || Date.now() - ts > OVERVIEW_CACHE_TTL_MS) {
        return null;
      }
      return {
        patients: Array.isArray(parsed.patients) ? (parsed.patients as PatientRow[]) : [],
        caregivers: Array.isArray(parsed.caregivers) ? (parsed.caregivers as CaregiverRow[]) : [],
        alerts: Array.isArray(parsed.alerts) ? (parsed.alerts as AlertRow[]) : [],
        facilities: Array.isArray(parsed.facilities) ? (parsed.facilities as FacilityRow[]) : [],
        vitals: Array.isArray(parsed.vitals) ? (parsed.vitals as VitalRow[]) : [],
        profiles: Array.isArray(parsed.profiles) ? (parsed.profiles as PatientProfileRow[]) : [],
      };
    } catch {
      return null;
    }
  };

  const writeCachedOverview = (payload: {
    patients: PatientRow[];
    caregivers: CaregiverRow[];
    alerts: AlertRow[];
    facilities: FacilityRow[];
    vitals: VitalRow[];
    profiles: PatientProfileRow[];
  }) => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      sessionStorage.setItem(
        OVERVIEW_CACHE_KEY,
        JSON.stringify({
          ts: Date.now(),
          ...payload,
        }),
      );
    } catch {
      // ignore cache write failures
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const cached = readCachedOverview();
      let hasCachedData = false;
      if (cached && mounted) {
        setPatients(cached.patients);
        setCaregivers(cached.caregivers);
        setAlerts(cached.alerts);
        setFacilities(cached.facilities);
        setVitals(cached.vitals);
        setProfiles(cached.profiles);
        setIsLoading(false);
        setIsRefreshing(true);
        hasCachedData = true;
      } else if (mounted) {
        setIsLoading(true);
        setIsRefreshing(false);
      }
      setLoadError("");
      try {
        const authHeaders = getAuthHeaders();
        if (!authHeaders.Authorization) {
          setLoadError(
            hasCachedData
              ? "Session missing. Showing recently loaded overview data."
              : "Login session not found. Please sign in again.",
          );
          if (!hasCachedData) {
            setPatients([]);
            setCaregivers([]);
            setAlerts([]);
            setFacilities([]);
            setVitals([]);
            setProfiles([]);
          }
          setIsRefreshing(false);
          setIsLoading(false);
          return;
        }
        const fetchArray = async <T,>(
          url: string,
          retry = 0,
          timeoutMs = OVERVIEW_DEFAULT_TIMEOUT_MS,
        ): Promise<{ ok: boolean; rows: T[]; status: number }> => {
          try {
            const response = await fetchWithTimeout(url, { headers: authHeaders }, timeoutMs);
            if (!response.ok) {
              if (retry > 0) {
                return fetchArray<T>(url, retry - 1, timeoutMs);
              }
              return { ok: false, rows: [], status: response.status };
            }
            const payload = await response.json().catch(() => []);
            return { ok: true, rows: toArray<T>(payload), status: response.status };
          } catch {
            if (retry > 0) {
              return fetchArray<T>(url, retry - 1, timeoutMs);
            }
            return { ok: false, rows: [], status: 0 };
          }
        };

        const fetchArrayWithFallback = async <T,>(
          primaryUrl: string,
          fallbackUrl?: string,
          timeoutMs = OVERVIEW_DEFAULT_TIMEOUT_MS,
        ): Promise<{ ok: boolean; rows: T[]; status: number }> => {
          const primaryResult = await fetchArray<T>(primaryUrl, 1, timeoutMs);
          if (primaryResult.ok || !fallbackUrl) {
            return primaryResult;
          }
          return fetchArray<T>(fallbackUrl, 1, timeoutMs);
        };

        const caregiversPromise = fetchArray<CaregiverRow>(
          `${apiUrl}/api/caregivers?home_only=true`,
          0,
          OVERVIEW_CAREGIVERS_TIMEOUT_MS,
        );

        const [patientsResult, alertsResult, facilitiesResult, vitalsResult, profilesResult] = await Promise.all([
          fetchArrayWithFallback<PatientRow>(
            `${apiUrl}/api/patients?home_only=true`,
            `${apiUrl}/api/patients`,
          ),
          fetchArray<AlertRow>(`${apiUrl}/api/alerts?limit=${OVERVIEW_ALERTS_LIMIT}&home_only=true`),
          fetchArrayWithFallback<FacilityRow>(
            `${apiUrl}/api/facilities?home_only=true`,
            `${apiUrl}/api/facilities`,
          ),
          fetchArray<VitalRow>(`${apiUrl}/api/vitals`),
          fetchArray<PatientProfileRow>(
            `${apiUrl}/api/patient-profiles?limit=${OVERVIEW_PROFILES_LIMIT}&home_only=true`,
          ),
        ]);

        if (!mounted) return;
        setPatients(patientsResult.rows);
        setAlerts(alertsResult.rows);
        setFacilities(facilitiesResult.rows);
        setVitals(vitalsResult.rows);
        setProfiles(profilesResult.rows);

        const failedFeeds = new Set<string>();
        if (!patientsResult.ok) failedFeeds.add("patients");
        if (!alertsResult.ok) failedFeeds.add("alerts");
        if (!facilitiesResult.ok) failedFeeds.add("facilities");
        if (!vitalsResult.ok) failedFeeds.add("vitals");
        if (!profilesResult.ok) failedFeeds.add("profiles");

        if (!patientsResult.ok) {
          setLoadError("Unable to load live overview data.");
        } else if (failedFeeds.size > 0) {
          setLoadError("Live overview loaded with some delayed feeds.");
        } else {
          setLoadError("");
        }

        setIsLoading(false);

        const caregiversResult = await caregiversPromise;
        if (!mounted) return;
        setCaregivers(caregiversResult.rows);
        if (!caregiversResult.ok) {
          failedFeeds.add("caregivers");
        } else {
          failedFeeds.delete("caregivers");
        }

        if (!patientsResult.ok) {
          setLoadError("Unable to load live overview data.");
        } else if (failedFeeds.size > 0) {
          setLoadError("Live overview loaded with some delayed feeds.");
        } else {
          setLoadError("");
        }

        writeCachedOverview({
          patients: patientsResult.rows,
          caregivers: caregiversResult.rows,
          alerts: alertsResult.rows,
          facilities: facilitiesResult.rows,
          vitals: vitalsResult.rows,
          profiles: profilesResult.rows,
        });
      } catch {
        if (!mounted) return;
        if (hasCachedData) {
          setLoadError("Live refresh timed out. Showing recently loaded overview data.");
        } else {
          setLoadError("Unable to load live overview data.");
          setPatients([]);
          setCaregivers([]);
          setAlerts([]);
          setFacilities([]);
          setVitals([]);
          setProfiles([]);
        }
      } finally {
        if (mounted) {
          setIsRefreshing(false);
          setIsLoading(false);
        }
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [apiUrl]);

  const patientNameById = useMemo(() => {
    const map = new Map<number, string>();
    patients.forEach((p) => {
      map.set(p.patient_id, `${p.first_name || ""} ${p.last_name || ""}`.trim() || `Patient ${p.patient_id}`);
    });
    return map;
  }, [patients]);

  const patientCountByFacility = useMemo(() => {
    const map = new Map<number, number>();
    patients.forEach((p) => {
      if (!p.facility_id) return;
      map.set(p.facility_id, (map.get(p.facility_id) || 0) + 1);
    });
    return map;
  }, [patients]);

  const activeCaregiverCount = caregivers.filter((c) => {
    const status = String(c.status || "").toLowerCase();
    return status === "active" && c.is_active !== false;
  }).length;
  const activeAlertCount = alerts.filter((a) => String(a.status || "active").toLowerCase() === "active").length;
  const resolvedAlertCount = alerts.filter((a) => String(a.status || "").toLowerCase() === "resolved").length;
  const highRiskCount = profiles.filter((profile) => {
    const risk = Number(profile.latest_risk_score ?? 0);
    const falls = Number(profile.falls_90d ?? 0);
    return risk >= 0.8 || falls > 0;
  }).length;
  const telemetryPatientCount = new Set(vitals.map((v) => v.patient_id)).size;

  const avgResponseMinutes = useMemo(() => {
    const deltas = alerts
      .map((alert) => {
        if (!alert.event_time || !alert.recorded_time) return null;
        const start = new Date(alert.event_time).getTime();
        const end = new Date(alert.recorded_time).getTime();
        if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
        return (end - start) / 60000;
      })
      .filter((value): value is number => value !== null);
    if (!deltas.length) return null;
    const total = deltas.reduce((sum, value) => sum + value, 0);
    return Math.round((total / deltas.length) * 10) / 10;
  }, [alerts]);

  const sortedRecentAlerts = [...alerts]
    .sort((a, b) => new Date(b.recorded_time || b.event_time || 0).getTime() - new Date(a.recorded_time || a.event_time || 0).getTime())
    .slice(0, 6)
    .map((alert) => ({
      alert_id: alert.alert_id,
      patient_name: patientNameById.get(alert.patient_id) || `Patient ${alert.patient_id}`,
      alert_type: alertTypeById[alert.alert_type_id] || "alert",
      severity: severityById[alert.severity_level_id] || "Medium",
      status: String(alert.status || "active").toLowerCase(),
      location: alert.facility_id ? `Facility ${alert.facility_id}` : "N/A",
      event_time: alert.recorded_time || alert.event_time,
    }));

  const facilityCards = facilities.map((facility) => {
    const facilityStatus = String(facility.status || "").toLowerCase();
    const online = facilityStatus === "active" && facility.is_active !== false;
    return {
      name: facility.name,
      status: online ? "online" : "offline",
      facility_type: String(facility.facility_type || "facility"),
      patient_count: patientCountByFacility.get(facility.facility_id) || 0,
    };
  });

  const metrics = {
    alertResolutionRate: percent(resolvedAlertCount, alerts.length),
    activeAlertRate: percent(activeAlertCount, alerts.length || 1),
    facilitiesOnlineRate: percent(
      facilityCards.filter((facility) => facility.status === "online").length,
      facilityCards.length || 1,
    ),
    telemetryCoverage: percent(telemetryPatientCount, patients.length || 1),
  };

  const statsCards = [
    {
      title: "Total Patients",
      value: `${patients.length}`,
      change: patients.length > 0 ? "Live" : "0",
      trend: "up" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      navigateTo: "patients",
    },
    {
      title: "Active Caregivers",
      value: `${activeCaregiverCount}`,
      change: caregivers.length > 0 ? "Live" : "0",
      trend: "up" as const,
      icon: UserCog,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      navigateTo: "caregivers",
    },
    {
      title: "Active Alerts",
      value: `${activeAlertCount}`,
      change: `${alerts.length} total`,
      trend: activeAlertCount > 0 ? ("up" as const) : ("down" as const),
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
      navigateTo: "alerts",
    },
    {
      title: "High Risk Patients",
      value: `${highRiskCount}`,
      change: "risk/fall driven",
      trend: highRiskCount > 0 ? ("up" as const) : ("down" as const),
      icon: PersonStanding,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      navigateTo: "fall-monitoring",
    },
    {
      title: "Telemetry Feeds",
      value: `${telemetryPatientCount}`,
      change: `${metrics.telemetryCoverage}% coverage`,
      trend: "up" as const,
      icon: Cpu,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      navigateTo: "devices",
    },
    {
      title: "Avg Ingest Lag",
      value: avgResponseMinutes === null ? "N/A" : `${avgResponseMinutes}m`,
      change: "event to record",
      trend: "down" as const,
      icon: Clock,
      color: "text-teal-600",
      bgColor: "bg-teal-100 dark:bg-teal-900/30",
      navigateTo: "reports",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Live operational view of homes, patients, alerts, and telemetry.</p>
      </div>

      {loadError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {loadError}
        </div>
      )}
      {isLoading && !loadError && (
        <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
          Loading live overview...
        </div>
      )}
      {isRefreshing && !isLoading && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">
          Refreshing live overview feeds...
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards.map((stat) => (
          <Card
            key={stat.title}
            className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/50"
            onClick={() => onNavigate?.(stat.navigateTo)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-green-500" />
                  )}
                  <span className="text-green-500">{stat.change}</span>
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedRecentAlerts.length === 0 ? (
                <div className="text-sm text-muted-foreground">No live alerts available.</div>
              ) : (
                sortedRecentAlerts.map((alert) => (
                  <div key={alert.alert_id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          alert.severity === "Critical"
                            ? "bg-red-500 animate-pulse"
                            : alert.severity === "High"
                            ? "bg-orange-500"
                            : alert.severity === "Medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-sm">{alert.patient_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {alert.alert_type} • {alert.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          alert.status === "resolved"
                            ? "secondary"
                            : alert.status === "acknowledged"
                            ? "default"
                            : "destructive"
                        }
                        className="text-xs"
                      >
                        {alert.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">{formatTimeAgo(alert.event_time)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Facility Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {facilityCards.length === 0 ? (
                <div className="text-sm text-muted-foreground">No facilities available.</div>
              ) : (
                facilityCards.map((facility) => (
                  <div key={facility.name} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {facility.status === "online" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <span className="font-medium text-sm">{facility.name}</span>
                        <div className="text-xs text-muted-foreground capitalize">
                          {facility.facility_type.replaceAll("_", " ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{facility.patient_count} patients</span>
                      <Badge variant={facility.status === "online" ? "default" : "destructive"} className="text-xs">
                        {facility.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Live Care Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Alert Resolution Rate</span>
                <span className="text-sm text-muted-foreground">{metrics.alertResolutionRate}%</span>
              </div>
              <Progress value={metrics.alertResolutionRate} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">Resolved / total alerts</div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Active Alert Rate</span>
                <span className="text-sm text-muted-foreground">{metrics.activeAlertRate}%</span>
              </div>
              <Progress value={metrics.activeAlertRate} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">Active / total alerts</div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Facilities Online</span>
                <span className="text-sm text-muted-foreground">{metrics.facilitiesOnlineRate}%</span>
              </div>
              <Progress value={metrics.facilitiesOnlineRate} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">Active facilities</div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Telemetry Coverage</span>
                <span className="text-sm text-muted-foreground">{metrics.telemetryCoverage}%</span>
              </div>
              <Progress value={metrics.telemetryCoverage} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">Patients with latest vitals</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  PersonStanding,
  AlertOctagon,
  Clock,
  CheckCircle,
  Phone,
  MapPin,
  Activity,
  TrendingDown,
  Users,
  Shield,
  Search,
} from "lucide-react";

type FallIncident = {
  id: number;
  patient: string;
  location: string;
  time: string;
  status: "responding" | "resolved";
  severity: "low" | "medium" | "high" | "critical";
  responseTime: string | null;
  responseTimeMinutes: number | null;
  caregiver: string;
  sensorType: string;
};

type ApiFallIncident = {
  alert_id: number;
  patient_name: string;
  location: string;
  event_time?: string;
  recorded_time?: string;
  status: string;
  severity: string;
  caregiver_name?: string | null;
  sensor_type?: string | null;
  response_time_minutes?: number | null;
};

// HARDWARE_READINESS: frontend fallback for demo continuity when live fall incident API fails.
const fallbackFallIncidents: FallIncident[] = [
  {
    id: 1,
    patient: "Margaret Johnson",
    location: "Living Room",
    time: "2 min ago",
    status: "responding",
    severity: "high",
    responseTime: null,
    caregiver: "Sarah Williams",
    sensorType: "Motion + Impact",
  },
  {
    id: 2,
    patient: "Robert Smith",
    location: "Bathroom",
    time: "3 hours ago",
    status: "resolved",
    severity: "medium",
    responseTime: "4.2 min",
    caregiver: "John Davis",
    sensorType: "Wearable",
  },
  {
    id: 3,
    patient: "Helen Davis",
    location: "Bedroom",
    time: "Yesterday 8:30 PM",
    status: "resolved",
    severity: "low",
    responseTime: "2.8 min",
    caregiver: "Emily Brown",
    sensorType: "Motion",
  },
];

const ITEMS_PER_PAGE = 5;

type FilterType = "all" | "responding" | "resolved";

const formatTimeAgo = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) {
    return "just now";
  }
  if (diffMins < 60) {
    return `${diffMins} min ago`;
  }
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  }
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
};

export function FallMonitoringSection() {
  // TODO: re-enable when backend is available
  // const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [incidents, setIncidents] = useState<FallIncident[]>(fallbackFallIncidents);
  const [monitoredPatients, setMonitoredPatients] = useState(0);
  const [activeSensors, setActiveSensors] = useState(0);
  const [offlineSensors, setOfflineSensors] = useState(0);
  const [coverageRate, setCoverageRate] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // TODO: re-enable when backend is available
  /*
  const authHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("betti_token") : null;
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };
  */

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
    // TODO: re-enable when backend is available
    /*
    let isMounted = true;
    const loadFallIncidents = async () => {
      try {
        setLoadError("");
        const headers = authHeaders();
        const [fallRes, patientsRes, vitalsRes] = await Promise.all([
          fetch(`${apiUrl}/api/fall-incidents?limit=200&home_only=true`, { headers }),
          fetch(`${apiUrl}/api/patients?home_only=true`, { headers }),
          fetch(`${apiUrl}/api/vitals`, { headers }),
        ]);
        if (!fallRes.ok) {
          throw new Error("failed");
        }
        const payload = toArray<ApiFallIncident>(await fallRes.json().catch(() => []));
        const patientsPayload = patientsRes.ok
          ? toArray<{ patient_id?: number }>(await patientsRes.json().catch(() => []))
          : [];
        const vitalsPayload = vitalsRes.ok
          ? toArray<{ patient_id?: number }>(await vitalsRes.json().catch(() => []))
          : [];
        const patientCount = (patientsPayload || []).length;
        const vitalsPatientIds = new Set(
          (vitalsPayload || [])
            .map((row) => Number(row?.patient_id || 0))
            .filter((id) => Number.isFinite(id) && id > 0),
        );
        const activeSensorCount = vitalsPatientIds.size;
        const offlineSensorCount = Math.max(patientCount - activeSensorCount, 0);
        const coveragePercent = patientCount > 0 ? Math.round((activeSensorCount / patientCount) * 1000) / 10 : 0;
        const mapped: FallIncident[] = (payload || []).map((row) => ({
          id: Number(row.alert_id || 0),
          patient: row.patient_name || "Unknown Patient",
          location: row.location || "Home",
          time: formatTimeAgo(row.event_time || row.recorded_time || ""),
          status: row.status === "responding" ? "responding" : "resolved",
          severity: (["low", "medium", "high", "critical"].includes((row.severity || "").toLowerCase())
            ? row.severity.toLowerCase()
            : "medium") as FallIncident["severity"],
          responseTime:
            row.response_time_minutes !== null && row.response_time_minutes !== undefined
              ? `${Number(row.response_time_minutes).toFixed(1)} min`
              : null,
          responseTimeMinutes:
            row.response_time_minutes !== null && row.response_time_minutes !== undefined
              ? Number(row.response_time_minutes)
              : null,
          caregiver: row.caregiver_name || "Unassigned",
          sensorType: row.sensor_type || "Ambient Sensor",
        }));
        if (isMounted) {
          setIncidents(mapped);
          setMonitoredPatients(patientCount);
          setActiveSensors(activeSensorCount);
          setOfflineSensors(offlineSensorCount);
          setCoverageRate(coveragePercent);
        }
      } catch {
        if (isMounted) {
          setLoadError("Unable to load live fall incidents.");
          setIncidents([]);
          setMonitoredPatients(0);
          setActiveSensors(0);
          setOfflineSensors(0);
          setCoverageRate(0);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadFallIncidents();
    return () => {
      isMounted = false;
    };
    */
  }, []);

  // Filter incidents based on search and filter
  const filteredIncidents = incidents.filter(incident => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      incident.patient.toLowerCase().includes(query) ||
      incident.location.toLowerCase().includes(query) ||
      incident.status.toLowerCase().includes(query) ||
      incident.severity.toLowerCase().includes(query) ||
      incident.caregiver.toLowerCase().includes(query) ||
      incident.sensorType.toLowerCase().includes(query)
    );

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "responding":
        return incident.status === "responding";
      case "resolved":
        return incident.status === "resolved";
      default:
        return true;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredIncidents.length / ITEMS_PER_PAGE);
  const paginatedIncidents = filteredIncidents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const activeIncidents = incidents.filter(i => i.status === "responding");
  const resolvedIncidents = incidents.filter(i => i.status === "resolved");
  const resolvedWithResponse = incidents.filter(
    (incident) =>
      incident.status === "resolved" &&
      incident.responseTimeMinutes !== null &&
      Number.isFinite(incident.responseTimeMinutes),
  );
  const under3Count = resolvedWithResponse.filter((incident) => Number(incident.responseTimeMinutes) < 3).length;
  const threeToFiveCount = resolvedWithResponse.filter((incident) => {
    const response = Number(incident.responseTimeMinutes);
    return response >= 3 && response <= 5;
  }).length;
  const over5Count = resolvedWithResponse.filter((incident) => Number(incident.responseTimeMinutes) > 5).length;
  const totalResponseCount = resolvedWithResponse.length;
  const under3Pct = totalResponseCount ? Math.round((under3Count / totalResponseCount) * 100) : 0;
  const threeToFivePct = totalResponseCount ? Math.round((threeToFiveCount / totalResponseCount) * 100) : 0;
  const over5Pct = totalResponseCount ? Math.round((over5Count / totalResponseCount) * 100) : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fall Monitoring</h1>
            <p className="text-muted-foreground">
              Real-time fall detection and response tracking
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loadError && (
          <Alert variant="destructive">
            <AlertDescription>{loadError}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Alert>
            <AlertDescription>Loading fall incidents...</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "responding" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("responding")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertOctagon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeIncidents.length}</div>
                <div className="text-xs text-muted-foreground">Active Fall Alert</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <PersonStanding className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{incidents.length}</div>
                <div className="text-xs text-muted-foreground">Falls Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "resolved" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("resolved")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{resolvedIncidents.length}</div>
                <div className="text-xs text-muted-foreground">Resolved</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingDown className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">-15%</div>
                <div className="text-xs text-muted-foreground">vs Last Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">
        {/* Active Incidents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PersonStanding className="h-5 w-5 text-primary" />
                Fall Incidents ({filteredIncidents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paginatedIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`p-4 rounded-lg border ${
                    incident.status === "responding"
                      ? "border-red-300 bg-red-50"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          incident.status === "responding"
                            ? "bg-red-100 animate-pulse"
                            : "bg-muted"
                        }`}
                      >
                        <PersonStanding
                          className={`h-5 w-5 ${
                            incident.status === "responding"
                              ? "text-red-600"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{incident.patient}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {incident.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          incident.status === "responding"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {incident.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {incident.time}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Severity:</span>
                      <Badge
                        variant="outline"
                        className={`ml-2 ${
                          incident.severity === "high"
                            ? "text-red-600 border-red-300"
                            : incident.severity === "medium"
                            ? "text-orange-600 border-orange-300"
                            : "text-green-600 border-green-300"
                        }`}
                      >
                        {incident.severity}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Response:</span>
                      <span className="ml-2 font-medium">
                        {incident.responseTime || "In progress..."}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sensor:</span>
                      <span className="ml-2">{incident.sensorType}</span>
                    </div>
                  </div>

                  {incident.status === "responding" && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="destructive" className="gap-1">
                        <Phone className="h-3 w-3" />
                        Contact EMS
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Mark Resolved
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <PaginationControlled
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredIncidents.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </CardContent>
          </Card>
        </div>

        {/* Monitoring Status */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Monitoring Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Patients Monitored</span>
                <span className="font-medium">{monitoredPatients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Sensors</span>
                <span className="font-medium text-green-600">{activeSensors}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Offline Sensors</span>
                <span className="font-medium text-red-600">{offlineSensors}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Coverage Rate</span>
                <span className="font-medium">{coverageRate.toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Response Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Under 3 min</span>
                  <span className="font-medium">{under3Pct}%</span>
                </div>
                <Progress value={under3Pct} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>3-5 min</span>
                  <span className="font-medium">{threeToFivePct}%</span>
                </div>
                <Progress value={threeToFivePct} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Over 5 min</span>
                  <span className="font-medium">{over5Pct}%</span>
                </div>
                <Progress value={over5Pct} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
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
  feedback_status: "unreviewed" | "confirmed" | "false_positive";
  event_time: string;
  // From alert_details
  details: { key: string; value: string; confidence: number }[];
  // Joined data
  location: string;
  assigned_caregiver: string;
}

const severityLevels = {
  1: { level_name: "Critical" as const, priority: 1, color_code: "#FF0000" },
  2: { level_name: "High" as const, priority: 2, color_code: "#FF9900" },
  3: { level_name: "Medium" as const, priority: 3, color_code: "#FFCC00" },
  4: { level_name: "Low" as const, priority: 4, color_code: "#00CC00" },
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

const initialAlerts: Alert[] = [
  {
    alert_id: 9021,
    patient_id: 501,
    patient_name: "Margaret Johnson",
    alert_type_id: 3,
    alert_type: "fall",
    severity_level_id: 1,
    severity: severityLevels[1],
    description: "Possible fall detected in bathroom",
    status: "active",
    feedback_status: "unreviewed",
    event_time: "2026-02-01T06:47:30Z",
    details: [
      { key: "impact_force", value: "2.1g", confidence: 0.89 },
      { key: "position_change", value: "vertical_to_horizontal", confidence: 0.92 },
    ],
    location: "Room 214 - Bathroom",
    assigned_caregiver: "Angela Reyes"
  },
  {
    alert_id: 9018,
    patient_id: 502,
    patient_name: "Robert Smith",
    alert_type_id: 2,
    alert_type: "medication",
    severity_level_id: 3,
    severity: severityLevels[3],
    description: "Missed afternoon medication - Metformin 500mg",
    status: "resolved",
    feedback_status: "confirmed",
    event_time: "2026-02-01T06:32:00Z",
    details: [
      { key: "medication", value: "Metformin 500mg", confidence: 1.0 },
      { key: "scheduled_time", value: "14:00", confidence: 1.0 },
    ],
    location: "Room 118",
    assigned_caregiver: "John Davis"
  },
  {
    alert_id: 9015,
    patient_id: 503,
    patient_name: "Helen Davis",
    alert_type_id: 4,
    alert_type: "inactivity",
    severity_level_id: 2,
    severity: severityLevels[2],
    description: "No movement detected for 3 hours in monitored zone",
    status: "acknowledged",
    feedback_status: "unreviewed",
    event_time: "2026-02-01T06:15:00Z",
    details: [
      { key: "last_motion", value: "03:15:00", confidence: 1.0 },
      { key: "zone", value: "bedroom", confidence: 0.95 },
    ],
    location: "Room 305 - Bedroom",
    assigned_caregiver: "Emily Brown"
  },
  {
    alert_id: 9012,
    patient_id: 504,
    patient_name: "James Wilson",
    alert_type_id: 5,
    alert_type: "vital",
    severity_level_id: 4,
    severity: severityLevels[4],
    description: "Slightly elevated heart rate detected during rest",
    status: "resolved",
    feedback_status: "false_positive",
    event_time: "2026-02-01T05:45:00Z",
    details: [
      { key: "heart_rate", value: "95 bpm", confidence: 0.88 },
      { key: "baseline", value: "72 bpm", confidence: 0.95 },
    ],
    location: "Room 122",
    assigned_caregiver: "Michael Lee"
  },
  {
    alert_id: 9008,
    patient_id: 505,
    patient_name: "Patricia Brown",
    alert_type_id: 1,
    alert_type: "panic",
    severity_level_id: 1,
    severity: severityLevels[1],
    description: "Panic button activated - patient requesting assistance",
    status: "resolved",
    feedback_status: "confirmed",
    event_time: "2026-02-01T05:30:00Z",
    details: [
      { key: "button_type", value: "wearable", confidence: 1.0 },
      { key: "resolution", value: "assistance_provided", confidence: 1.0 },
    ],
    location: "Room 210 - Bathroom",
    assigned_caregiver: "Angela Reyes"
  },
  {
    alert_id: 9005,
    patient_id: 503,
    patient_name: "Helen Davis",
    alert_type_id: 6,
    alert_type: "wandering",
    severity_level_id: 2,
    severity: severityLevels[2],
    description: "Patient detected outside designated area during night hours",
    status: "escalated",
    feedback_status: "confirmed",
    event_time: "2026-02-01T02:15:00Z",
    details: [
      { key: "zone_exit", value: "floor_3_boundary", confidence: 0.97 },
      { key: "time_outside", value: "8 minutes", confidence: 0.90 },
    ],
    location: "Floor 3 - Hallway",
    assigned_caregiver: "Emily Brown"
  },
];

export function AlertsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [alertsData, setAlertsData] = useState<Alert[]>(initialAlerts);

  const handleResolveAlert = (alertId: number) => {
    setAlertsData(prev => prev.map(alert =>
      alert.alert_id === alertId
        ? { ...alert, status: "resolved" as const, feedback_status: "confirmed" as const }
        : alert
    ));
    toast.success("Alert Resolved", {
      description: `Alert #${alertId} has been marked as resolved.`,
    });
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
                          <Badge variant={alert.feedback_status === "confirmed" ? "default" : "secondary"} className="text-xs">
                            {alert.feedback_status === "confirmed" ? "Confirmed" : "False Positive"}
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
                      <Button size="sm" className="gap-1" onClick={() => handleResolveAlert(alert.alert_id)}>
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

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  UserCog,
  AlertTriangle,
  Activity,
  Cpu,
  Heart,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  PersonStanding,
} from "lucide-react";

// Schema-aligned metrics derived from database tables
const statsCards = [
  {
    title: "Total Patients",
    value: "283",
    change: "+12",
    trend: "up" as const,
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    source: "patients table",
    navigateTo: "patients",
  },
  {
    title: "Active Caregivers",
    value: "92",
    change: "+5",
    trend: "up" as const,
    icon: UserCog,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    source: "users + facility_memberships",
    navigateTo: "caregivers",
  },
  {
    title: "Active Alerts",
    value: "6",
    change: "-2",
    trend: "down" as const,
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    source: "alerts (status=active)",
    navigateTo: "alerts",
  },
  {
    title: "High Risk Patients",
    value: "12",
    change: "+1",
    trend: "up" as const,
    icon: PersonStanding,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    source: "patient_risk_scores (≥0.8)",
    navigateTo: "fall-monitoring",
  },
  {
    title: "Connected Sensors",
    value: "318",
    change: "99%",
    trend: "up" as const,
    icon: Cpu,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    source: "device_status (connected)",
    navigateTo: "devices",
  },
  {
    title: "Avg Response Time",
    value: "3.8m",
    change: "-0.4m",
    trend: "down" as const,
    icon: Clock,
    color: "text-teal-600",
    bgColor: "bg-teal-100 dark:bg-teal-900/30",
    source: "computed from alerts",
    navigateTo: "emergency",
  },
];

// Schema-aligned: alerts with severity_levels
const recentAlerts = [
  {
    alert_id: 9021,
    alert_type: "fall",
    patient_name: "Margaret Johnson",
    location: "Room 214 - Bathroom",
    event_time: "2026-02-01T06:47:30Z",
    status: "active",
    severity: "Critical",
  },
  {
    alert_id: 9018,
    alert_type: "medication",
    patient_name: "Robert Smith",
    location: "Room 118",
    event_time: "2026-02-01T06:32:00Z",
    status: "resolved",
    severity: "Medium",
  },
  {
    alert_id: 9015,
    alert_type: "inactivity",
    patient_name: "Helen Davis",
    location: "Room 305 - Bedroom",
    event_time: "2026-02-01T06:15:00Z",
    status: "acknowledged",
    severity: "High",
  },
  {
    alert_id: 9005,
    alert_type: "wandering",
    patient_name: "Helen Davis",
    location: "Floor 3 - Hallway",
    event_time: "2026-02-01T02:15:00Z",
    status: "escalated",
    severity: "High",
  },
];

// Schema-aligned: facilities table status
const systemHealth = [
  { name: "Sunrise Assisted Living", status: "online", facility_type: "assisted_living", patient_count: 45 },
  { name: "Golden Oaks Senior Living", status: "online", facility_type: "senior_living", patient_count: 38 },
  { name: "Palm Beach Regional Hospital", status: "online", facility_type: "hospital", patient_count: 128 },
  { name: "Coastal Home Care Services", status: "online", facility_type: "home_care", patient_count: 72 },
];

// Schema-aligned: daily_adherence metrics
const careMetrics = {
  medicationAdherence: 87, // medications_taken / (medications_taken + medications_missed)
  checkInResponseRate: 94, // computed from sensor_readings response times
  alertResolutionRate: 91, // resolved alerts / total alerts
  deviceOnlineRate: 98,    // connected sensors / total sensors
};

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

interface OverviewSectionProps {
  onNavigate?: (section: string) => void;
}

export function OverviewSection({ onNavigate }: OverviewSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of the Betti care monitoring system
        </p>
      </div>

      {/* Stats Grid */}
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
                  <span className="text-green-500">
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.alert_id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
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
                        {alert.alert_type.charAt(0).toUpperCase() + alert.alert_type.slice(1)} • {alert.location}
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
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatTimeAgo(alert.event_time)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Facility Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Facility Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((facility) => (
                <div
                  key={facility.name}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {facility.status === "online" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <div>
                      <span className="font-medium text-sm">{facility.name}</span>
                      <div className="text-xs text-muted-foreground capitalize">
                        {facility.facility_type.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {facility.patient_count} patients
                    </span>
                    <Badge
                      variant={facility.status === "online" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {facility.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Care Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Care Metrics Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Medication Adherence</span>
                <span className="text-sm text-muted-foreground">{careMetrics.medicationAdherence}%</span>
              </div>
              <Progress value={careMetrics.medicationAdherence} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">From daily_adherence</div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Check-in Response Rate</span>
                <span className="text-sm text-muted-foreground">{careMetrics.checkInResponseRate}%</span>
              </div>
              <Progress value={careMetrics.checkInResponseRate} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">From sensor_readings</div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Alert Resolution Rate</span>
                <span className="text-sm text-muted-foreground">{careMetrics.alertResolutionRate}%</span>
              </div>
              <Progress value={careMetrics.alertResolutionRate} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">From alerts table</div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Device Online Rate</span>
                <span className="text-sm text-muted-foreground">{careMetrics.deviceOnlineRate}%</span>
              </div>
              <Progress value={careMetrics.deviceOnlineRate} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1">From device_status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useAlerts } from "@/components/alerts-context";
import { EnvironmentCard } from "@/components/environment-card";
import { CO2MonitoringCard } from "@/components/co2-monitoring-card";
import { VOCHazardCard } from "@/components/voc-hazard-card";
import { ThermalRiskCard } from "@/components/thermal-risk-card";
import { HumidityRiskCard } from "@/components/humidity-risk-card";
import {
  Bell,
  Users,
  AlertTriangle,
  Cpu,
  CheckCircle2,
  Clock,
  ChevronRight,
  Activity,
  X,
} from "lucide-react";
import { DisclaimerBar } from "@/components/disclaimer-bar";

const stats = [
  { label: "Active Alerts", value: "5", icon: Bell, color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  { label: "Residents On-Floor", value: "42", icon: Users, color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  { label: "Open Incidents", value: "2", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { label: "Devices Online", value: "38/40", icon: Cpu, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
];

const recentAlerts = [
  { id: 1, type: "Fall Detected", resident: "Margaret Collins", room: "204", severity: "critical", time: "2 min ago" },
  { id: 2, type: "Vitals Anomaly", resident: "Robert Chen", room: "118", severity: "warning", time: "8 min ago" },
  { id: 3, type: "Inactivity Alert", resident: "Dorothy Palmer", room: "310", severity: "info", time: "15 min ago" },
];

const quickResidents = [
  { name: "Margaret Collins", room: "204", status: "critical", lastCheck: "2 min ago", hr: 92, spo2: 94 },
  { name: "James Wilson", room: "105", status: "stable", lastCheck: "12 min ago", hr: 74, spo2: 98 },
  { name: "Robert Chen", room: "118", status: "attention", lastCheck: "8 min ago", hr: 88, spo2: 95 },
  { name: "Helen Torres", room: "220", status: "stable", lastCheck: "5 min ago", hr: 70, spo2: 97 },
  { name: "Dorothy Palmer", room: "310", status: "attention", lastCheck: "15 min ago", hr: 76, spo2: 96 },
  { name: "Frank Martinez", room: "401", status: "stable", lastCheck: "3 min ago", hr: 68, spo2: 99 },
];

const recentActivity = [
  { id: 1, text: "Care action logged for Margaret Collins (Room 204)", time: "3 min ago", icon: CheckCircle2 },
  { id: 2, text: "Alert acknowledged: Vitals anomaly — Robert Chen", time: "8 min ago", icon: Bell },
  { id: 3, text: "Medication administered to Helen Torres (Room 220)", time: "22 min ago", icon: Activity },
  { id: 4, text: "Shift handoff note added by Nurse Sarah Kim", time: "45 min ago", icon: Clock },
  { id: 5, text: "Incident #1047 resolved — Fall in hallway (Wing B)", time: "1 hr ago", icon: CheckCircle2 },
];

const severityStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
};

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  stable: { bg: "bg-green-100", text: "text-green-700", label: "Stable" },
  attention: { bg: "bg-amber-100", text: "text-amber-700", label: "Attention" },
  critical: { bg: "bg-red-100", text: "text-red-700", label: "Critical" },
};

export default function DashboardPage() {
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<number[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { alerts: notificationAlerts, readAlertIds, unreadCount, markAsRead } = useAlerts();

  const now = new Date();
  const greeting = now.getHours() < 12 ? "Good morning" : now.getHours() < 17 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
              {greeting}, Operator
            </h1>
            <p className="text-sm text-gray-500 mt-1">{dateStr} — Day Shift (7:00 AM – 3:00 PM)</p>
          </div>
          <div className="flex items-center gap-3 self-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 border border-green-200">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              On Shift
            </span>
            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-gray-200 bg-white shadow-xl z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif text-base font-semibold text-gray-900">Alerts</h3>
                        {unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                      <button onClick={() => setShowNotifications(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
                      {notificationAlerts.map((alert) => {
                        const isUnread = !readAlertIds.includes(alert.id);
                        return (
                          <div
                            key={alert.id}
                            onClick={() => markAsRead(alert.id)}
                            className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${isUnread ? "bg-blue-50/40" : ""}`}
                          >
                            <div className="flex-shrink-0 flex items-center pt-3">
                              <span className={`h-2 w-2 rounded-full ${isUnread ? "bg-[#233E7D]" : "bg-transparent"}`} />
                            </div>
                            <div className={`flex-shrink-0 w-9 h-9 rounded-full ${alert.iconBg} flex items-center justify-center mt-0.5`}>
                              <alert.icon className={`h-4 w-4 ${alert.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm truncate ${isUnread ? "font-bold text-gray-900" : "font-normal text-gray-600"}`}>{alert.title}</span>
                                {alert.severity === "critical" && (
                                  <span className="inline-flex rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-700">Critical</span>
                                )}
                              </div>
                              <p className={`text-xs mt-0.5 line-clamp-2 ${isUnread ? "font-semibold text-gray-700" : "font-normal text-gray-500"}`}>{alert.description}</p>
                              <span className="text-[11px] text-gray-400 mt-1 block">{alert.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t border-gray-100 px-4 py-3">
                      <a href="/alerts" className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-[#233E7D] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c3266] transition-colors">
                        View All Alerts
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className={`rounded-xl border ${s.border} ${s.bg} p-4 transition-all hover:shadow-md`}>
              <div className="flex items-center justify-between">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Live Alert Queue */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-gray-900">Live Alert Queue</h2>
              <a href="/alerts" className="text-xs font-semibold text-[#5C7F39] hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-3 w-3" />
              </a>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center gap-4 rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition-colors">
                  <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${severityStyles[alert.severity]}`}>
                    {alert.severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{alert.type}</p>
                    <p className="text-xs text-gray-500">{alert.resident} · Room {alert.room}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{alert.time}</span>
                  <button
                    onClick={() => setAcknowledgedAlerts((prev) => [...prev, alert.id])}
                    disabled={acknowledgedAlerts.includes(alert.id)}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      acknowledgedAlerts.includes(alert.id)
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-[#233E7D] text-white hover:bg-[#1c3164]"
                    }`}
                  >
                    {acknowledgedAlerts.includes(alert.id) ? "Ack'd" : "Acknowledge"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="mt-0.5 flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                    <item.icon className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{item.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Environmental Health */}
        <EnvironmentCard />

        {/* Environmental Monitoring Detail Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <CO2MonitoringCard />
          <VOCHazardCard />
          <ThermalRiskCard />
          <HumidityRiskCard />
        </div>

        {/* Quick Resident Status */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-gray-900">Resident Status</h2>
            <a href="/residents" className="text-xs font-semibold text-[#5C7F39] hover:underline flex items-center gap-1">
              Full roster <ChevronRight className="h-3 w-3" />
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickResidents.map((r) => {
              const st = statusStyles[r.status];
              return (
                <div key={r.name} className="rounded-lg border border-gray-100 p-3 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">Room {r.room}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${st.bg} ${st.text}`}>
                      {st.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>HR {r.hr} bpm</span>
                    <span>SpO₂ {r.spo2}%</span>
                    <span className="ml-auto">{r.lastCheck}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <DisclaimerBar />
    </div>
  );
}

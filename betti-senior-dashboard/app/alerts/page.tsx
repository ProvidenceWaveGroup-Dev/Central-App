"use client";

import { useState } from "react";
import {
  Droplets,
  Pill,
  Clock,
  Flower as Shower,
  Bell,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "medication",
      title: "Afternoon Medication",
      message: "Time for your 2:00 PM medication",
      time: "2:00 PM",
      priority: "high" as const,
      dismissed: false,
    },
    {
      id: 2,
      type: "hydration",
      title: "Hydration Reminder",
      message: "You haven't had water in 2 hours. Time to hydrate!",
      time: "3:30 PM",
      priority: "medium" as const,
      dismissed: false,
    },
    {
      id: 3,
      type: "restroom",
      title: "Restroom Check",
      message: "It's been 4 hours since your last restroom visit",
      time: "4:00 PM",
      priority: "medium" as const,
      dismissed: false,
    },
    {
      id: 4,
      type: "shower",
      title: "Shower Reminder",
      message: "Don't forget your evening shower routine",
      time: "6:00 PM",
      priority: "low" as const,
      dismissed: false,
    },
  ]);

  const dismissAlert = (id: number) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, dismissed: true } : alert
      )
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <Pill className="h-5 w-5" />;
      case "hydration":
        return <Droplets className="h-5 w-5" />;
      case "restroom":
        return <Clock className="h-5 w-5" />;
      case "shower":
        return <Shower className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const priorityConfig = {
    high: {
      badge: "bg-red-100 text-red-700 border-red-200",
      card: "border-l-4 border-l-red-500",
      icon: "text-red-600",
    },
    medium: {
      badge: "bg-amber-100 text-amber-700 border-amber-200",
      card: "border-l-4 border-l-amber-500",
      icon: "text-amber-600",
    },
    low: {
      badge: "bg-blue-100 text-blue-700 border-blue-200",
      card: "border-l-4 border-l-blue-400",
      icon: "text-blue-600",
    },
  };

  const activeAlerts = alerts.filter((alert) => !alert.dismissed);
  const completedAlerts = alerts.filter((alert) => alert.dismissed);

  const highCount = alerts.filter((a) => a.priority === "high" && !a.dismissed).length;
  const mediumCount = alerts.filter((a) => a.priority === "medium" && !a.dismissed).length;
  const lowCount = alerts.filter((a) => a.priority === "low" && !a.dismissed).length;
  const completedCount = completedAlerts.length;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
              Alerts & Reminders
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage your daily health reminders</p>
          </div>
          {activeAlerts.length > 0 && (
            <span className="inline-flex items-center gap-2 rounded-full bg-red-100 border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 self-start">
              <AlertTriangle className="h-4 w-4" /> {activeAlerts.length} Active
            </span>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-red-50 border border-red-200 p-4">
            <div className="flex items-center justify-between">
              <Bell className="h-5 w-5 text-red-600" />
              <span className="text-2xl font-bold text-red-600">{highCount}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">High Priority</p>
          </div>
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-center justify-between">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">{mediumCount}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Medium Priority</p>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{lowCount}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Low Priority</p>
          </div>
          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{completedCount}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Completed</p>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">Active Alerts</h2>
          </div>

          {activeAlerts.length === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="h-12 w-12 text-[#5C7F39] mx-auto mb-3" />
              <p className="text-lg font-semibold text-[#5C7F39]">All caught up!</p>
              <p className="text-sm text-gray-500 mt-1">No active alerts at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert) => {
                const config = priorityConfig[alert.priority];
                return (
                  <div
                    key={alert.id}
                    className={`rounded-lg border border-gray-100 bg-white p-4 transition-colors hover:bg-gray-50 ${config.card}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 mt-0.5 h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center ${config.icon}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                          <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${config.badge}`}>
                            {alert.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                        <p className="text-xs text-gray-400 mt-1.5">Scheduled for {alert.time}</p>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="flex-shrink-0 rounded-lg border border-gray-200 p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                        title="Dismiss"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Today */}
        {completedAlerts.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-5 w-5 text-[#5C7F39]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Completed Today</h2>
            </div>
            <div className="space-y-3">
              {completedAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-3 rounded-lg bg-green-50 border border-green-100 p-3"
                >
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-500">{alert.message}</p>
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">{alert.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

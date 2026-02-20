"use client";

import { useState, useEffect, useCallback } from "react";
import { Flame, AlertTriangle, TrendingUp, Bell, RefreshCw } from "lucide-react";

// ── API-Ready Interfaces ──────────────────────────────────────────────
export interface VOCReading {
  timestamp: string;
  level: number; // ppb (parts per billion)
  status: "safe" | "elevated" | "hazardous";
}

export interface VOCAlert {
  id: string;
  type: "threshold_exceeded" | "trend_spike" | "sustained_exposure";
  severity: "warning" | "critical";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface VOCNotification {
  id: string;
  type: "hazard_warning" | "escalation";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface VOCMonitoringData {
  currentLevel: number;
  unit: string;
  status: "safe" | "elevated" | "hazardous";
  thresholds: {
    safe: number;       // < 250 ppb
    elevated: number;   // 250–500 ppb
    hazardous: number;  // > 500 ppb
  };
  trend: VOCReading[];
  trendDirection: "rising" | "falling" | "stable";
  percentChange24h: number;
  alerts: VOCAlert[];
  notifications: VOCNotification[];
  exposureDuration: string; // e.g., "2h 15m" if sustained
  lastUpdated: string;
}

// ── Threshold Helper ──────────────────────────────────────────────────
function getVOCStatus(level: number): "safe" | "elevated" | "hazardous" {
  if (level < 250) return "safe";
  if (level <= 500) return "elevated";
  return "hazardous";
}

const statusConfig = {
  safe: { label: "Safe", bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500", dot: "bg-green-500" },
  elevated: { label: "Elevated", bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-500", dot: "bg-amber-500" },
  hazardous: { label: "Hazardous", bg: "bg-red-100", text: "text-red-700", bar: "bg-red-500", dot: "bg-red-500" },
};

// ── Mock Data (Replace with API call) ─────────────────────────────────
const MOCK_DATA: VOCMonitoringData = {
  currentLevel: 310,
  unit: "ppb",
  status: "elevated",
  thresholds: { safe: 250, elevated: 500, hazardous: 750 },
  trend: [
    { timestamp: "6:00 AM", level: 120, status: "safe" },
    { timestamp: "8:00 AM", level: 180, status: "safe" },
    { timestamp: "10:00 AM", level: 240, status: "safe" },
    { timestamp: "12:00 PM", level: 310, status: "elevated" },
    { timestamp: "2:00 PM", level: 380, status: "elevated" },
    { timestamp: "4:00 PM", level: 310, status: "elevated" },
  ],
  trendDirection: "rising",
  percentChange24h: 18.5,
  alerts: [
    {
      id: "va1",
      type: "trend_spike",
      severity: "warning",
      message: "VOC levels have increased 18.5% in the last 24 hours. Monitor for continued rise.",
      timestamp: "1 hr ago",
      acknowledged: false,
    },
  ],
  notifications: [
    {
      id: "vn1",
      type: "hazard_warning",
      title: "VOC Trend Alert",
      message: "Elevated VOC levels detected. Consider increasing ventilation.",
      timestamp: "30 min ago",
      read: false,
    },
  ],
  exposureDuration: "2h 15m",
  lastUpdated: "Just now",
};

// ── Component ─────────────────────────────────────────────────────────
export function VOCHazardCard() {
  const [data, setData] = useState<VOCMonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);

  // API-ready fetch function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/environmental/voc');
      // const result = await response.json();
      // setData(result);
      await new Promise((r) => setTimeout(r, 300));
      setData(MOCK_DATA);
    } catch (error) {
      console.error("Failed to fetch VOC data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleAcknowledgeAlert = (alertId: string) => {
    setAcknowledgedAlerts((prev) => [...prev, alertId]);
    // TODO: POST to API
  };

  const handleReadNotification = (notifId: string) => {
    setReadNotifications((prev) => [...prev, notifId]);
    // TODO: POST to API
  };

  if (loading && !data) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="space-y-3">
          <div className="h-16 bg-gray-100 rounded" />
          <div className="h-16 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxPPB = 750;
  const levelPct = Math.min((data.currentLevel / maxPPB) * 100, 100);
  const cfg = statusConfig[data.status];
  const unreadNotifs = data.notifications.filter((n) => !readNotifications.includes(n.id) && !n.read);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-[#233E7D]" />
          <h2 className="font-serif text-lg font-semibold text-gray-900">
            VOC Hazard & Respiratory
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {unreadNotifs.length > 0 && (
            <div className="relative">
              <Bell className="h-4 w-4 text-amber-500" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 text-white text-[8px] flex items-center justify-center">
                {unreadNotifs.length}
              </span>
            </div>
          )}
          <button
            onClick={fetchData}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 text-gray-400 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Current Level */}
      <div className="flex items-center justify-between mb-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
        <div>
          <div className="text-xs text-gray-500 mb-0.5">Current VOC Level</div>
          <div className="text-2xl font-bold text-gray-900">
            {data.currentLevel} <span className="text-sm font-normal text-gray-500">{data.unit}</span>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
            {cfg.label}
          </div>
          <div className={`text-xs mt-1 flex items-center justify-end gap-1 ${data.trendDirection === "rising" ? "text-red-500" : data.trendDirection === "falling" ? "text-green-500" : "text-gray-500"}`}>
            <TrendingUp className={`h-3 w-3 ${data.trendDirection === "falling" ? "rotate-180" : data.trendDirection === "stable" ? "rotate-0" : ""}`} />
            {data.percentChange24h > 0 ? "+" : ""}{data.percentChange24h}% (24h)
          </div>
        </div>
      </div>

      {/* Level Bar */}
      <div className="mb-1">
        <div className="h-3 rounded-full bg-gray-100">
          <div
            className={`h-3 rounded-full ${cfg.bar} transition-all duration-500`}
            style={{ width: `${levelPct}%` }}
          />
        </div>
      </div>

      {/* Threshold Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          &lt;250 Safe
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          250–500 Elevated
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          &gt;500 Hazardous
        </div>
      </div>

      {/* Exposure Duration */}
      {data.status !== "safe" && (
        <div className={`mb-4 p-3 rounded-lg ${cfg.bg} border ${cfg.text === "text-amber-700" ? "border-amber-200" : "border-red-200"}`}>
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{cfg.label} Exposure Duration</div>
            <div className="text-sm font-bold">{data.exposureDuration}</div>
          </div>
          <div className="text-xs mt-1 opacity-80">
            {data.status === "elevated"
              ? "Consider increasing ventilation to reduce VOC levels."
              : "Immediate ventilation action recommended. Care alert triggered."}
          </div>
        </div>
      )}

      {/* Concentration Trend */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">VOC Concentration Trend</span>
        </div>
        <div className="flex items-end gap-1 h-20">
          {data.trend.map((entry, i) => {
            const hPct = (entry.level / maxPPB) * 100;
            const st = getVOCStatus(entry.level);
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full rounded-t" style={{ height: `${hPct}%` }}>
                  <div className={`w-full h-full rounded-t ${statusConfig[st].bar} opacity-70`} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 mt-1">
          {data.trend.map((entry, i) => (
            <div key={i} className="flex-1 text-center text-[10px] text-gray-400 truncate">
              {entry.timestamp.replace(" AM", "a").replace(" PM", "p")}
            </div>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {unreadNotifs.length > 0 && (
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-amber-600">
            <Bell className="h-4 w-4" />
            Notifications
          </div>
          {unreadNotifs.map((notif) => (
            <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <Bell className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-amber-700">{notif.title}</div>
                <div className="text-xs text-amber-600">{notif.message}</div>
                <div className="text-xs text-amber-400 mt-1">{notif.timestamp}</div>
              </div>
              <button
                onClick={() => handleReadNotification(notif.id)}
                className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Alerts */}
      {data.alerts.filter((a) => !acknowledgedAlerts.includes(a.id)).length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-red-600">
            <AlertTriangle className="h-4 w-4" />
            Care Alerts
          </div>
          {data.alerts
            .filter((a) => !acknowledgedAlerts.includes(a.id))
            .map((alert) => (
              <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${alert.severity === "critical" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${alert.severity === "critical" ? "text-red-500" : "text-amber-500"}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${alert.severity === "critical" ? "text-red-700" : "text-amber-700"}`}>
                    {alert.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  </div>
                  <div className={`text-xs ${alert.severity === "critical" ? "text-red-600" : "text-amber-600"}`}>{alert.message}</div>
                  <div className={`text-xs mt-1 ${alert.severity === "critical" ? "text-red-400" : "text-amber-400"}`}>{alert.timestamp}</div>
                </div>
                <button
                  onClick={() => handleAcknowledgeAlert(alert.id)}
                  className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold text-white transition-colors ${alert.severity === "critical" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"}`}
                >
                  Acknowledge
                </button>
              </div>
            ))}
        </div>
      )}

      {/* Last Updated */}
      <div className="mt-3 text-xs text-gray-400 text-right">
        Last updated: {data.lastUpdated}
      </div>
    </div>
  );
}

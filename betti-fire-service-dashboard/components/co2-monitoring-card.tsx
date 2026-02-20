"use client";

import { useState, useEffect, useCallback } from "react";
import { Wind, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";

export interface CO2RoomReading {
  roomId: string;
  roomName: string;
  residentName: string;
  co2Level: number;
  status: "safe" | "caution" | "critical";
  lastUpdated: string;
}

export interface CO2HistoryEntry {
  timestamp: string;
  level: number;
}

export interface CO2MonitoringData {
  rooms: CO2RoomReading[];
  thresholds: { safe: number; caution: number; critical: number };
  facilityAverage: number;
  alerts: CO2Alert[];
  history: CO2HistoryEntry[];
}

export interface CO2Alert {
  id: string;
  roomId: string;
  roomName: string;
  level: number;
  type: "ventilation_risk" | "critical_level" | "sustained_high";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

function getCO2Status(level: number): "safe" | "caution" | "critical" {
  if (level < 800) return "safe";
  if (level <= 1200) return "caution";
  return "critical";
}

const statusConfig = {
  safe: { label: "Safe", bg: "bg-green-100", text: "text-green-700", border: "border-green-200", bar: "bg-green-500" },
  caution: { label: "Caution", bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", bar: "bg-amber-500" },
  critical: { label: "Critical", bg: "bg-red-100", text: "text-red-700", border: "border-red-200", bar: "bg-red-500" },
};

const MOCK_DATA: CO2MonitoringData = {
  rooms: [
    { roomId: "r1", roomName: "Living Room", residentName: "Margaret", co2Level: 620, status: "safe", lastUpdated: "2 min ago" },
    { roomId: "r2", roomName: "Bedroom", residentName: "Margaret", co2Level: 890, status: "caution", lastUpdated: "1 min ago" },
    { roomId: "r3", roomName: "Kitchen", residentName: "Margaret", co2Level: 540, status: "safe", lastUpdated: "3 min ago" },
    { roomId: "r4", roomName: "Bathroom", residentName: "Margaret", co2Level: 1350, status: "critical", lastUpdated: "Just now" },
  ],
  thresholds: { safe: 800, caution: 1200, critical: 1500 },
  facilityAverage: 720,
  alerts: [
    { id: "a1", roomId: "r4", roomName: "Bathroom", level: 1350, type: "ventilation_risk", message: "CO₂ levels exceed safe threshold. Ventilation recommended.", timestamp: "Just now", acknowledged: false },
  ],
  history: [
    { timestamp: "6:00 AM", level: 420 },
    { timestamp: "8:00 AM", level: 580 },
    { timestamp: "10:00 AM", level: 650 },
    { timestamp: "12:00 PM", level: 720 },
    { timestamp: "2:00 PM", level: 890 },
    { timestamp: "4:00 PM", level: 760 },
  ],
};

export function CO2MonitoringCard() {
  const [data, setData] = useState<CO2MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setData(MOCK_DATA);
    } catch (error) {
      console.error("Failed to fetch CO2 data:", error);
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

  const maxPPM = 1500;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-[#233E7D]" />
          <h2 className="font-serif text-lg font-semibold text-gray-900">CO₂ Ventilation Safety</h2>
        </div>
        <button onClick={fetchData} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Refresh data">
          <RefreshCw className={`h-4 w-4 text-gray-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
        <div>
          <div className="text-xs text-gray-500 mb-0.5">Facility Average</div>
          <div className="text-2xl font-bold text-gray-900">{data.facilityAverage} <span className="text-sm font-normal text-gray-500">ppm</span></div>
        </div>
        <div className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusConfig[getCO2Status(data.facilityAverage)].bg} ${statusConfig[getCO2Status(data.facilityAverage)].text}`}>
          {statusConfig[getCO2Status(data.facilityAverage)].label}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />&lt;800 Safe</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />800–1200 Caution</div>
        <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />&gt;1200 Critical</div>
      </div>

      <div className="space-y-3 mb-4">
        {data.rooms.map((room) => {
          const cfg = statusConfig[room.status];
          const pct = Math.min((room.co2Level / maxPPM) * 100, 100);
          return (
            <div key={room.roomId} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{room.roomName}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">{room.co2Level} ppm</span>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className={`h-2 rounded-full ${cfg.bar} transition-all duration-500`} style={{ width: `${pct}%` }} />
              </div>
              <div className="text-xs text-gray-400">Updated {room.lastUpdated}</div>
            </div>
          );
        })}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Today&apos;s CO₂ Trend</span>
        </div>
        <div className="flex items-end gap-1 h-20">
          {data.history.map((entry, i) => {
            const hPct = (entry.level / maxPPM) * 100;
            const st = getCO2Status(entry.level);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t" style={{ height: `${hPct}%` }}>
                  <div className={`w-full h-full rounded-t ${statusConfig[st].bar} opacity-70`} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 mt-1">
          {data.history.map((entry, i) => (
            <div key={i} className="flex-1 text-center text-[10px] text-gray-400 truncate">{entry.timestamp.replace(" AM", "a").replace(" PM", "p")}</div>
          ))}
        </div>
      </div>

      {data.alerts.filter((a) => !acknowledgedAlerts.includes(a.id)).length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-red-600">
            <AlertTriangle className="h-4 w-4" /> Active Alerts
          </div>
          {data.alerts.filter((a) => !acknowledgedAlerts.includes(a.id)).map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-red-700">{alert.roomName} — {alert.level} ppm</div>
                <div className="text-xs text-red-600">{alert.message}</div>
                <div className="text-xs text-red-400 mt-1">{alert.timestamp}</div>
              </div>
              <button onClick={() => handleAcknowledgeAlert(alert.id)} className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors">Acknowledge</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

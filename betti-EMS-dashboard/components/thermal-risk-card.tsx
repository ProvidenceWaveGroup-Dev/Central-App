"use client";

import { useState, useEffect, useCallback } from "react";
import { Thermometer, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";

export interface ThermalZoneReading { zoneId: string; zoneName: string; temperature: number; status: "cold_risk" | "comfortable" | "warm" | "heat_risk"; lastUpdated: string; }
export interface ThermalHistoryEntry { timestamp: string; temperature: number; }
export interface ThermalAlert { id: string; zoneId: string; zoneName: string; temperature: number; type: string; severity: "warning" | "critical"; message: string; timestamp: string; acknowledged: boolean; }

export interface ThermalMonitoringData {
  zones: ThermalZoneReading[];
  comfortRange: { min: number; max: number };
  thresholds: { coldRisk: number; comfortLow: number; comfortHigh: number; heatRisk: number };
  overallStatus: "cold_risk" | "comfortable" | "warm" | "heat_risk";
  averageTemp: number;
  history: ThermalHistoryEntry[];
  alerts: ThermalAlert[];
  lastUpdated: string;
}

function getThermalStatus(temp: number): "cold_risk" | "comfortable" | "warm" | "heat_risk" {
  if (temp < 65) return "cold_risk";
  if (temp <= 78) return "comfortable";
  if (temp <= 82) return "warm";
  return "heat_risk";
}

const statusConfig = {
  cold_risk: { label: "Cold Risk", bg: "bg-blue-100", text: "text-blue-700", bar: "bg-blue-500" },
  comfortable: { label: "Comfortable", bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500" },
  warm: { label: "Warm", bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-500" },
  heat_risk: { label: "Heat Risk", bg: "bg-red-100", text: "text-red-700", bar: "bg-red-500" },
};

const MOCK_DATA: ThermalMonitoringData = {
  zones: [
    { zoneId: "z1", zoneName: "Living Room", temperature: 74, status: "comfortable", lastUpdated: "1 min ago" },
    { zoneId: "z2", zoneName: "Bedroom", temperature: 71, status: "comfortable", lastUpdated: "2 min ago" },
    { zoneId: "z3", zoneName: "Kitchen", temperature: 78, status: "comfortable", lastUpdated: "1 min ago" },
    { zoneId: "z4", zoneName: "Bathroom", temperature: 82, status: "warm", lastUpdated: "3 min ago" },
  ],
  comfortRange: { min: 68, max: 76 },
  thresholds: { coldRisk: 65, comfortLow: 65, comfortHigh: 78, heatRisk: 82 },
  overallStatus: "comfortable", averageTemp: 76,
  history: [
    { timestamp: "6:00 AM", temperature: 68 },
    { timestamp: "8:00 AM", temperature: 70 },
    { timestamp: "10:00 AM", temperature: 73 },
    { timestamp: "12:00 PM", temperature: 76 },
    { timestamp: "2:00 PM", temperature: 78 },
    { timestamp: "4:00 PM", temperature: 76 },
  ],
  alerts: [], lastUpdated: "Just now",
};

export function ThermalRiskCard() {
  const [data, setData] = useState<ThermalMonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setData(MOCK_DATA);
    } catch (error) {
      console.error("Failed to fetch thermal data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleAcknowledgeAlert = (alertId: string) => setAcknowledgedAlerts((prev) => [...prev, alertId]);

  if (loading && !data) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-4" />
        <div className="space-y-3"><div className="h-16 bg-gray-100 rounded" /><div className="h-16 bg-gray-100 rounded" /></div>
      </div>
    );
  }

  if (!data) return null;

  const cfg = statusConfig[data.overallStatus];
  const gaugeMin = 50, gaugeMax = 95;
  const tempPct = ((data.averageTemp - gaugeMin) / (gaugeMax - gaugeMin)) * 100;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-[#233E7D]" />
          <h2 className="font-serif text-lg font-semibold text-gray-900">Thermal Risk & Comfort</h2>
        </div>
        <button onClick={fetchData} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Refresh data">
          <RefreshCw className={`h-4 w-4 text-gray-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
        <div>
          <div className="text-xs text-gray-500 mb-0.5">Average Temperature</div>
          <div className="text-2xl font-bold text-gray-900">{data.averageTemp}°<span className="text-sm font-normal text-gray-500">F</span></div>
        </div>
        <div className="text-right">
          <div className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${cfg.bg} ${cfg.text}`}>{cfg.label}</div>
          <div className="text-xs text-gray-400 mt-1">Comfort: {data.comfortRange.min}°–{data.comfortRange.max}°F</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-medium text-gray-500 mb-2">Comfort Range Indicator</div>
        <div className="relative h-4 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="h-full bg-blue-400" style={{ width: "33%" }} />
            <div className="h-full bg-green-400" style={{ width: "29%" }} />
            <div className="h-full bg-amber-400" style={{ width: "9%" }} />
            <div className="h-full bg-red-400" style={{ width: "29%" }} />
          </div>
          <div className="absolute top-0 h-full w-1 bg-gray-900 rounded" style={{ left: `${Math.min(Math.max(tempPct, 0), 100)}%` }} />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-gray-400">
          <span>50°F Cold</span><span>65°F</span><span>78°F</span><span>82°F</span><span>95°F Heat</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="text-sm font-medium text-gray-700">Zone Temperatures</div>
        {data.zones.map((zone) => {
          const zcfg = statusConfig[zone.status];
          return (
            <div key={zone.zoneId} className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <div>
                <div className="text-sm font-medium text-gray-700">{zone.zoneName}</div>
                <div className="text-xs text-gray-400">Updated {zone.lastUpdated}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">{zone.temperature}°F</span>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${zcfg.bg} ${zcfg.text}`}>{zcfg.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-gray-500" /><span className="text-sm font-medium text-gray-700">Temperature Trend</span></div>
        <div className="flex items-end gap-1 h-20">
          {data.history.map((entry, i) => {
            const hPct = ((entry.temperature - gaugeMin) / (gaugeMax - gaugeMin)) * 100;
            const st = getThermalStatus(entry.temperature);
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full rounded-t" style={{ height: `${hPct}%` }}><div className={`w-full h-full rounded-t ${statusConfig[st].bar} opacity-70`} /></div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 mt-1">{data.history.map((entry, i) => (<div key={i} className="flex-1 text-center text-[10px] text-gray-400 truncate">{entry.timestamp.replace(" AM", "a").replace(" PM", "p")}</div>))}</div>
      </div>

      {data.alerts.filter((a) => !acknowledgedAlerts.includes(a.id)).length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-red-600"><AlertTriangle className="h-4 w-4" /> Thermal Alerts</div>
          {data.alerts.filter((a) => !acknowledgedAlerts.includes(a.id)).map((alert) => (
            <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${alert.severity === "critical" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
              <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${alert.severity === "critical" ? "text-red-500" : "text-amber-500"}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${alert.severity === "critical" ? "text-red-700" : "text-amber-700"}`}>{alert.zoneName} — {alert.temperature}°F</div>
                <div className={`text-xs ${alert.severity === "critical" ? "text-red-600" : "text-amber-600"}`}>{alert.message}</div>
                <div className={`text-xs mt-1 ${alert.severity === "critical" ? "text-red-400" : "text-amber-400"}`}>{alert.timestamp}</div>
              </div>
              <button onClick={() => handleAcknowledgeAlert(alert.id)} className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold text-white transition-colors ${alert.severity === "critical" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"}`}>Acknowledge</button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-400 text-right">Last updated: {data.lastUpdated}</div>
    </div>
  );
}

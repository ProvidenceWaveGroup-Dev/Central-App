"use client";

import { useState, useEffect, useCallback } from "react";
import { Droplets, AlertTriangle, TrendingUp, RefreshCw, ShieldAlert } from "lucide-react";

export interface HumidityZoneReading { zoneId: string; zoneName: string; humidity: number; status: "dry" | "comfortable" | "high" | "mold_risk"; moldRiskScore: number; lastUpdated: string; }
export interface HumidityHistoryEntry { timestamp: string; humidity: number; }
export interface HumidityAlert { id: string; zoneId: string; zoneName: string; humidity: number; type: string; severity: "warning" | "critical"; message: string; timestamp: string; acknowledged: boolean; }

export interface HumidityMonitoringData {
  zones: HumidityZoneReading[];
  thresholds: { dry: number; comfortLow: number; comfortHigh: number; high: number; moldRisk: number };
  averageHumidity: number;
  overallStatus: "dry" | "comfortable" | "high" | "mold_risk";
  moldRiskZones: number;
  history: HumidityHistoryEntry[];
  alerts: HumidityAlert[];
  sustainedHighDuration: string | null;
  lastUpdated: string;
}

function getHumidityStatus(level: number): "dry" | "comfortable" | "high" | "mold_risk" {
  if (level < 30) return "dry";
  if (level <= 50) return "comfortable";
  if (level <= 60) return "high";
  return "mold_risk";
}

const statusConfig = {
  dry: { label: "Dry", bg: "bg-orange-100", text: "text-orange-700", bar: "bg-orange-500" },
  comfortable: { label: "Comfortable", bg: "bg-green-100", text: "text-green-700", bar: "bg-green-500" },
  high: { label: "High", bg: "bg-amber-100", text: "text-amber-700", bar: "bg-amber-500" },
  mold_risk: { label: "Mold Risk", bg: "bg-red-100", text: "text-red-700", bar: "bg-red-500" },
};

const MOCK_DATA: HumidityMonitoringData = {
  zones: [
    { zoneId: "z1", zoneName: "Living Room", humidity: 45, status: "comfortable", moldRiskScore: 12, lastUpdated: "1 min ago" },
    { zoneId: "z2", zoneName: "Bedroom", humidity: 52, status: "high", moldRiskScore: 35, lastUpdated: "2 min ago" },
    { zoneId: "z3", zoneName: "Kitchen", humidity: 58, status: "high", moldRiskScore: 48, lastUpdated: "1 min ago" },
    { zoneId: "z4", zoneName: "Bathroom", humidity: 72, status: "mold_risk", moldRiskScore: 78, lastUpdated: "Just now" },
  ],
  thresholds: { dry: 30, comfortLow: 30, comfortHigh: 50, high: 60, moldRisk: 60 },
  averageHumidity: 57, overallStatus: "high", moldRiskZones: 1,
  history: [
    { timestamp: "6:00 AM", humidity: 48 },
    { timestamp: "8:00 AM", humidity: 50 },
    { timestamp: "10:00 AM", humidity: 53 },
    { timestamp: "12:00 PM", humidity: 56 },
    { timestamp: "2:00 PM", humidity: 60 },
    { timestamp: "4:00 PM", humidity: 57 },
  ],
  alerts: [{ id: "ha1", zoneId: "z4", zoneName: "Bathroom", humidity: 72, type: "mold_risk", severity: "warning", message: "Sustained high humidity in Bathroom. Mold growth risk elevated. Consider dehumidification.", timestamp: "15 min ago", acknowledged: false }],
  sustainedHighDuration: "3h 45m", lastUpdated: "Just now",
};

export function HumidityRiskCard() {
  const [data, setData] = useState<HumidityMonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<string[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setData(MOCK_DATA);
    } catch (error) {
      console.error("Failed to fetch humidity data:", error);
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

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-[#233E7D]" />
          <h2 className="font-serif text-lg font-semibold text-gray-900">Humidity & Mold Risk</h2>
        </div>
        <button onClick={fetchData} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Refresh data">
          <RefreshCw className={`h-4 w-4 text-gray-400 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
          <div className="text-xs text-gray-500 mb-0.5">Average Humidity</div>
          <div className="text-2xl font-bold text-gray-900">{data.averageHumidity}<span className="text-sm font-normal text-gray-500">%</span></div>
          <div className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold mt-1 ${cfg.bg} ${cfg.text}`}>{cfg.label}</div>
        </div>
        <div className={`p-3 rounded-lg border ${data.moldRiskZones > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <div className="text-xs text-gray-500 mb-0.5">Mold Risk Zones</div>
          <div className={`text-2xl font-bold ${data.moldRiskZones > 0 ? "text-red-600" : "text-green-600"}`}>{data.moldRiskZones}</div>
          <div className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold mt-1 ${data.moldRiskZones > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{data.moldRiskZones > 0 ? "Action Needed" : "All Clear"}</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs font-medium text-gray-500 mb-2">Humidity Range</div>
        <div className="relative h-4 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="h-full bg-orange-400" style={{ width: "30%" }} />
            <div className="h-full bg-green-400" style={{ width: "20%" }} />
            <div className="h-full bg-amber-400" style={{ width: "10%" }} />
            <div className="h-full bg-red-400" style={{ width: "40%" }} />
          </div>
          <div className="absolute top-0 h-full w-1 bg-gray-900 rounded" style={{ left: `${Math.min(data.averageHumidity, 100)}%` }} />
        </div>
        <div className="flex justify-between mt-1 text-[10px] text-gray-400">
          <span>0% Dry</span><span>30%</span><span>50%</span><span>60%</span><span>100% Mold</span>
        </div>
      </div>

      {data.sustainedHighDuration && data.overallStatus !== "comfortable" && data.overallStatus !== "dry" && (
        <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-700">Sustained High Humidity</span>
          </div>
          <div className="text-xs text-amber-600">
            Elevated humidity has persisted for <span className="font-bold">{data.sustainedHighDuration}</span>. Prolonged exposure increases mold growth and respiratory health risks.
          </div>
        </div>
      )}

      <div className="space-y-3 mb-4">
        <div className="text-sm font-medium text-gray-700">Zone Readings</div>
        {data.zones.map((zone) => {
          const zcfg = statusConfig[zone.status];
          return (
            <div key={zone.zoneId} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-sm font-medium text-gray-700">{zone.zoneName}</div>
                  <div className="text-xs text-gray-400">Updated {zone.lastUpdated}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">{zone.humidity}%</span>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${zcfg.bg} ${zcfg.text}`}>{zcfg.label}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-20 shrink-0">Mold Risk</span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-200">
                  <div className={`h-1.5 rounded-full transition-all duration-500 ${zone.moldRiskScore > 60 ? "bg-red-500" : zone.moldRiskScore > 30 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${zone.moldRiskScore}%` }} />
                </div>
                <span className={`text-xs font-semibold w-8 text-right ${zone.moldRiskScore > 60 ? "text-red-600" : zone.moldRiskScore > 30 ? "text-amber-600" : "text-green-600"}`}>{zone.moldRiskScore}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2"><TrendingUp className="h-4 w-4 text-gray-500" /><span className="text-sm font-medium text-gray-700">Humidity Trend</span></div>
        <div className="flex items-end gap-1 h-20">
          {data.history.map((entry, i) => {
            const hPct = entry.humidity;
            const st = getHumidityStatus(entry.humidity);
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
          <div className="flex items-center gap-2 text-sm font-medium text-red-600"><AlertTriangle className="h-4 w-4" /> Mold & Respiratory Alerts</div>
          {data.alerts.filter((a) => !acknowledgedAlerts.includes(a.id)).map((alert) => (
            <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${alert.severity === "critical" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
              <AlertTriangle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${alert.severity === "critical" ? "text-red-500" : "text-amber-500"}`} />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${alert.severity === "critical" ? "text-red-700" : "text-amber-700"}`}>{alert.zoneName} — {alert.humidity}%</div>
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

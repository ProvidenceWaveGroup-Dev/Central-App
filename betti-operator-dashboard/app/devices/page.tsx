"use client";

import { Cpu, Wifi, WifiOff, BatteryLow, Wrench } from "lucide-react";

const statusSummary = [
  { label: "Online",          value: 38, icon: Wifi,       color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  { label: "Offline",         value: 1,  icon: WifiOff,    color: "text-red-600",   bg: "bg-red-50",   border: "border-red-200"   },
  { label: "Low Battery",     value: 3,  icon: BatteryLow, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { label: "Maintenance Due", value: 2,  icon: Wrench,     color: "text-blue-600",  bg: "bg-blue-50",  border: "border-blue-200"  },
];

type DeviceStatus = "online" | "offline" | "low_battery";

interface Device {
  id: string;
  type: string;
  location: string;
  status: DeviceStatus;
  battery: number;
  batteryHoursEst: number;   // estimated hours remaining at current charge
  signal: string;
  lastPing: string;
}

// batteryHoursEst: realistic estimates per device type
// Motion Sensor: ~6-month total → hourly estimate proportional
// Vitals Monitor: continuous use, ~48h total
// Emergency Button: ~12-month total → proportional
// Door Sensor: ~6-month total → proportional
const devices: Device[] = [
  { id: "DEV-001", type: "Motion Sensor",    location: "Room 105", status: "online",  battery: 92, batteryHoursEst: 3974, signal: "Strong", lastPing: "1 min ago"  },
  { id: "DEV-002", type: "Vitals Monitor",   location: "Room 118", status: "online",  battery: 85, batteryHoursEst: 41,   signal: "Strong", lastPing: "30 sec ago" },
  { id: "DEV-003", type: "Emergency Button", location: "Room 204", status: "online",  battery: 78, batteryHoursEst: 6833, signal: "Good",   lastPing: "2 min ago"  },
  { id: "DEV-004", type: "Door Sensor",      location: "Room 205", status: "offline", battery: 0,  batteryHoursEst: 0,    signal: "None",   lastPing: "22 min ago" },
  { id: "DEV-005", type: "Motion Sensor",    location: "Room 220", status: "online",  battery: 18, batteryHoursEst: 2,    signal: "Good",   lastPing: "1 min ago"  },
  { id: "DEV-006", type: "Vitals Monitor",   location: "Room 302", status: "online",  battery: 95, batteryHoursEst: 46,   signal: "Strong", lastPing: "15 sec ago" },
  { id: "DEV-007", type: "Emergency Button", location: "Room 310", status: "online",  battery: 12, batteryHoursEst: 6,    signal: "Weak",   lastPing: "5 min ago"  },
  { id: "DEV-008", type: "Door Sensor",      location: "Room 401", status: "online",  battery: 67, batteryHoursEst: 1344, signal: "Good",   lastPing: "3 min ago"  },
  { id: "DEV-009", type: "Motion Sensor",    location: "Room 408", status: "online",  battery: 22, batteryHoursEst: 3,    signal: "Good",   lastPing: "2 min ago"  },
  { id: "DEV-010", type: "Vitals Monitor",   location: "Room 115", status: "online",  battery: 88, batteryHoursEst: 42,   signal: "Strong", lastPing: "45 sec ago" },
];

const statusDot: Record<DeviceStatus, string> = {
  online:      "bg-green-500",
  offline:     "bg-red-500",
  low_battery: "bg-amber-500",
};

const statusLabel: Record<DeviceStatus, { text: string; color: string }> = {
  online:      { text: "Online",      color: "text-green-600" },
  offline:     { text: "Offline",     color: "text-red-600"   },
  low_battery: { text: "Low Battery", color: "text-amber-600" },
};

const batteryBarColor = (pct: number) => {
  if (pct >= 50) return "bg-green-500";
  if (pct >= 20) return "bg-amber-500";
  return "bg-red-500";
};

const signalColor: Record<string, string> = {
  Strong: "text-green-600",
  Good:   "text-blue-600",
  Weak:   "text-amber-600",
  None:   "text-red-600",
};

function formatBatteryTime(hours: number, battery: number): { label: string; color: string } {
  if (battery === 0 || hours === 0) return { label: "—", color: "text-gray-400" };
  if (hours < 1)    return { label: `~${Math.round(hours * 60)} min`,  color: "text-red-600 font-bold"   };
  if (hours < 12)   return { label: `~${Math.round(hours)}h`,          color: "text-red-600 font-bold"   };
  if (hours < 48)   return { label: `~${Math.round(hours)}h`,          color: "text-amber-600 font-semibold" };
  if (hours < 720)  return { label: `~${Math.round(hours / 24)} days`, color: "text-gray-600"            };
  if (hours < 4380) return { label: `~${Math.round(hours / (24 * 7))} weeks`, color: "text-gray-500"     };
  return               { label: `~${Math.round(hours / (24 * 30))} months`, color: "text-gray-500"       };
}

export default function DevicesPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Device Health Monitor</h1>
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 border border-green-200 px-3 py-1.5 text-sm font-semibold text-green-700 self-start">
            <Cpu className="h-4 w-4" /> 38/40 Online
          </span>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statusSummary.map((s) => (
            <div key={s.label} className={`rounded-xl ${s.bg} border ${s.border} p-4`}>
              <div className="flex items-center justify-between">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Device Table — 8 cols: ID | Type | Location | Status | Battery | Time Left | Signal | Last Ping */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="hidden lg:grid grid-cols-8 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div>Device ID</div>
            <div>Type</div>
            <div>Location</div>
            <div>Status</div>
            <div>Battery</div>
            <div>Time Left</div>
            <div>Signal</div>
            <div>Last Ping</div>
          </div>
          {devices.map((d) => {
            const effectiveStatus: DeviceStatus = d.status === "online" && d.battery <= 25 ? "low_battery" : d.status;
            const sl = statusLabel[effectiveStatus];
            const timeLeft = formatBatteryTime(d.batteryHoursEst, d.battery);
            return (
              <div key={d.id} className="grid grid-cols-1 lg:grid-cols-8 gap-2 lg:gap-3 items-center px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="text-xs font-mono text-gray-500">{d.id}</div>
                <div className="text-sm font-medium text-gray-900">{d.type}</div>
                <div className="text-sm text-gray-700">{d.location}</div>
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${statusDot[effectiveStatus]}`} />
                  <span className={`text-sm font-medium ${sl.color}`}>{sl.text}</span>
                </div>
                {/* Battery bar + % */}
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-gray-200 max-w-20">
                      <div className={`h-2 rounded-full ${batteryBarColor(d.battery)}`} style={{ width: `${d.battery}%` }} />
                    </div>
                    <span className="text-xs text-gray-500 w-7 text-right">{d.battery}%</span>
                  </div>
                </div>
                {/* Time remaining */}
                <div className={`text-xs ${timeLeft.color}`}>{timeLeft.label}</div>
                <div className={`text-sm ${signalColor[d.signal]}`}>{d.signal}</div>
                <div className="text-xs text-gray-500">{d.lastPing}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

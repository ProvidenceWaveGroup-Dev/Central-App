"use client";

import { useState } from "react";
import { Heart, Wind, Thermometer, Activity, AlertTriangle } from "lucide-react";
import { Pagination } from "@/components/pagination";

const overviewStats = [
  { label: "Avg Heart Rate",     value: "72 bpm", icon: Heart,         color: "text-red-500",    bg: "bg-red-50"    },
  { label: "Avg Blood Pressure", value: "131/82", icon: AlertTriangle, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Active Residents",   value: "38",     icon: Activity,      color: "text-green-500",  bg: "bg-green-50"  },
  { label: "Anomalies Today",    value: "7",      icon: Thermometer,   color: "text-amber-500",  bg: "bg-amber-50"  },
];

type VitalStatus = "normal" | "borderline" | "concerning";

interface ResidentVitals {
  name: string;
  room: string;
  hr: number;
  hrStatus: VitalStatus;
  bp: string;
  bpStatus: VitalStatus;
  spo2: number;
  spo2Status: VitalStatus;
  temp: string;
  tempStatus: VitalStatus;
  activity: number;
  lastUpdated: string;
}

const vitalsData: ResidentVitals[] = [
  { name: "Margaret Collins", room: "204", hr: 92, hrStatus: "concerning", bp: "158/96",  bpStatus: "concerning", spo2: 94, spo2Status: "concerning", temp: "99.1°F",  tempStatus: "borderline", activity: 20, lastUpdated: "2 min ago"  },
  { name: "James Wilson",     room: "105", hr: 74, hrStatus: "normal",     bp: "118/76",  bpStatus: "normal",     spo2: 98, spo2Status: "normal",     temp: "98.2°F",  tempStatus: "normal",     activity: 65, lastUpdated: "5 min ago"  },
  { name: "Robert Chen",      room: "118", hr: 88, hrStatus: "borderline", bp: "136/84",  bpStatus: "borderline", spo2: 95, spo2Status: "borderline", temp: "98.8°F",  tempStatus: "normal",     activity: 40, lastUpdated: "8 min ago"  },
  { name: "Helen Torres",     room: "220", hr: 70, hrStatus: "normal",     bp: "122/78",  bpStatus: "normal",     spo2: 97, spo2Status: "normal",     temp: "98.4°F",  tempStatus: "normal",     activity: 55, lastUpdated: "3 min ago"  },
  { name: "Dorothy Palmer",   room: "310", hr: 76, hrStatus: "normal",     bp: "130/82",  bpStatus: "borderline", spo2: 96, spo2Status: "normal",     temp: "98.6°F",  tempStatus: "normal",     activity: 30, lastUpdated: "15 min ago" },
  { name: "Frank Martinez",   room: "401", hr: 68, hrStatus: "normal",     bp: "116/72",  bpStatus: "normal",     spo2: 99, spo2Status: "normal",     temp: "97.9°F",  tempStatus: "normal",     activity: 70, lastUpdated: "1 min ago"  },
  { name: "Thomas Wright",    room: "306", hr: 96, hrStatus: "concerning", bp: "172/104", bpStatus: "concerning", spo2: 93, spo2Status: "concerning", temp: "100.2°F", tempStatus: "concerning", activity: 15, lastUpdated: "1 min ago"  },
  { name: "Susan Park",       room: "220", hr: 72, hrStatus: "normal",     bp: "124/80",  bpStatus: "normal",     spo2: 97, spo2Status: "normal",     temp: "98.3°F",  tempStatus: "normal",     activity: 50, lastUpdated: "10 min ago" },
  { name: "William Davis",    room: "302", hr: 80, hrStatus: "borderline", bp: "142/90",  bpStatus: "concerning", spo2: 95, spo2Status: "borderline", temp: "98.9°F",  tempStatus: "normal",     activity: 35, lastUpdated: "18 min ago" },
  { name: "Linda Brown",      room: "115", hr: 66, hrStatus: "normal",     bp: "119/74",  bpStatus: "normal",     spo2: 98, spo2Status: "normal",     temp: "98.1°F",  tempStatus: "normal",     activity: 60, lastUpdated: "6 min ago"  },
  { name: "Charles Lee",      room: "408", hr: 71, hrStatus: "normal",     bp: "126/80",  bpStatus: "normal",     spo2: 97, spo2Status: "normal",     temp: "98.4°F",  tempStatus: "normal",     activity: 45, lastUpdated: "9 min ago"  },
  { name: "Patricia Garcia",  room: "212", hr: 69, hrStatus: "normal",     bp: "121/77",  bpStatus: "normal",     spo2: 98, spo2Status: "normal",     temp: "98.2°F",  tempStatus: "normal",     activity: 58, lastUpdated: "4 min ago"  },
  { name: "Betty Johnson",    room: "109", hr: 73, hrStatus: "normal",     bp: "120/78",  bpStatus: "normal",     spo2: 97, spo2Status: "normal",     temp: "98.3°F",  tempStatus: "normal",     activity: 50, lastUpdated: "7 min ago"  },
  { name: "George Harris",    room: "201", hr: 82, hrStatus: "borderline", bp: "138/86",  bpStatus: "borderline", spo2: 95, spo2Status: "borderline", temp: "99.0°F",  tempStatus: "borderline", activity: 28, lastUpdated: "20 min ago" },
  { name: "Nancy White",      room: "317", hr: 68, hrStatus: "normal",     bp: "117/75",  bpStatus: "normal",     spo2: 98, spo2Status: "normal",     temp: "98.1°F",  tempStatus: "normal",     activity: 62, lastUpdated: "11 min ago" },
  { name: "Richard Taylor",   room: "322", hr: 85, hrStatus: "borderline", bp: "145/92",  bpStatus: "concerning", spo2: 94, spo2Status: "borderline", temp: "99.2°F",  tempStatus: "borderline", activity: 22, lastUpdated: "14 min ago" },
  { name: "Barbara Moore",    room: "415", hr: 70, hrStatus: "normal",     bp: "123/79",  bpStatus: "normal",     spo2: 97, spo2Status: "normal",     temp: "98.3°F",  tempStatus: "normal",     activity: 55, lastUpdated: "16 min ago" },
  { name: "Joseph Anderson",  room: "121", hr: 67, hrStatus: "normal",     bp: "115/71",  bpStatus: "normal",     spo2: 99, spo2Status: "normal",     temp: "97.8°F",  tempStatus: "normal",     activity: 72, lastUpdated: "22 min ago" },
];

const PAGE_SIZE = 8;

const statusColor: Record<VitalStatus, string> = {
  normal:     "text-green-600",
  borderline: "text-amber-600 font-semibold",
  concerning: "text-red-600 font-bold",
};

const activityBarColor = (pct: number) => {
  if (pct >= 60) return "bg-green-500";
  if (pct >= 30) return "bg-amber-500";
  return "bg-red-500";
};

const activityPatterns = [
  { label: "Busiest Time",     value: "10:00 AM – 12:00 PM", detail: "45% of daily activity"         },
  { label: "Most Active Area", value: "Common Room",          detail: "38% of movement tracked here" },
  { label: "Avg Daily Steps",  value: "1,240",               detail: "Across all residents"          },
  { label: "Sleep Quality",    value: "Good",                 detail: "82% avg sleep score"           },
];

export default function VitalsPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(vitalsData.length / PAGE_SIZE);
  const paginated  = vitalsData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const highBpCount = vitalsData.filter((r) => r.bpStatus === "concerning").length;

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Vitals & Activity Trends</h1>
          {highBpCount > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">
              <AlertTriangle className="h-4 w-4" />
              {highBpCount} resident{highBpCount > 1 ? "s" : ""} with high blood pressure
            </div>
          )}
        </div>

        {/* Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {overviewStats.map((s) => (
            <div key={s.label} className={`rounded-xl ${s.bg} border border-gray-200 p-4`}>
              <div className="flex items-center justify-between">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Vitals Table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="hidden lg:grid grid-cols-9 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-2">Resident</div>
            <div>Heart Rate</div>
            <div className="text-purple-600">Blood Pressure</div>
            <div>SpO₂</div>
            <div>Temp</div>
            <div>Activity</div>
            <div className="col-span-2">Last Updated</div>
          </div>

          {paginated.map((r) => (
            <div key={r.name} className="grid grid-cols-1 lg:grid-cols-9 gap-2 lg:gap-3 items-center px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="lg:col-span-2">
                <p className="text-sm font-medium text-gray-900">{r.name}</p>
                <p className="text-xs text-gray-500">Room {r.room}</p>
              </div>
              <div className={`text-sm ${statusColor[r.hrStatus]}`}>{r.hr} bpm</div>
              <div className="flex items-center gap-1">
                <span className={`text-sm ${statusColor[r.bpStatus]}`}>{r.bp}</span>
                {r.bpStatus === "concerning" && (
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                )}
              </div>
              <div className={`text-sm ${statusColor[r.spo2Status]}`}>{r.spo2}%</div>
              <div className={`text-sm ${statusColor[r.tempStatus]}`}>{r.temp}</div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-gray-200">
                    <div className={`h-2 rounded-full ${activityBarColor(r.activity)}`} style={{ width: `${r.activity}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 w-7 text-right">{r.activity}%</span>
                </div>
              </div>
              <div className="lg:col-span-2 text-xs text-gray-500">{r.lastUpdated}</div>
            </div>
          ))}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={vitalsData.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* BP Reference */}
        <div className="rounded-xl border border-purple-100 bg-purple-50 p-4">
          <p className="text-xs font-semibold text-purple-700 mb-2">Blood Pressure Reference</p>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500 inline-block" /> Normal: &lt;120/80</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500 inline-block" /> Borderline: 130–139 / 80–89</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-500 inline-block" /> High: ≥140/90 — alert triggered</span>
          </div>
        </div>

        {/* Activity Patterns */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {activityPatterns.map((p) => (
            <div key={p.label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{p.label}</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{p.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

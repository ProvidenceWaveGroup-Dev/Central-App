"use client";

import Link from "next/link";
import {
  Heart,
  Droplets,
  Pill,
  Bed,
  Footprints,
  Smile,
  AlertTriangle,
  CheckCircle,
  X,
  Activity,
  Gauge,
  BarChart3,
  ChevronRight,
  Shield,
  Wind,
} from "lucide-react";

// Day labels for mood stability (7 days)
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Mock data - replace with API fetch
const MOCK = {
  score: 85,
  rating: "Excellent",
  mood: { status: "Stable", trend: [72, 78, 82, 80, 85, 88, 85] },
  behavioralIncidents: 0,
  anomalies: [] as string[],
  moodDataLogged: true,
  lastLogged: "Just now",
  medications: { status: "up_to_date" as "up_to_date" | "missed", taken: 3, missed: 0, missedList: [] as string[], prerequisiteNote: null as string | null },
  vitals: {
    bloodPressure: { value: "118/76", unit: "mmHg", status: "normal" as "normal" | "elevated" | "alert" },
    bloodSugar: { value: 92, unit: "mg/dL", status: "normal" as "normal" | "elevated" | "alert" },
    hydration: { value: "Good", status: "good" as "good" | "low" | "critical" },
    heartRate: { value: 68, unit: "bpm", status: "normal" as "normal" | "elevated" | "alert" },
    respiratoryRate: { value: 16, unit: "/min", status: "normal" as "normal" | "elevated" | "alert" },
  },
  sleep: "7.5 hrs",
  movement: "Active",
};

export function DailyWellbeingCard() {
  const data = MOCK;
  const hasMissedMeds = data.medications.status === "missed" && data.medications.missedList.length > 0;
  const hasAnomalies = data.anomalies.length > 0;

  const getVitalStatusColor = (status: string) => {
    if (status === "alert") return "text-red-600";
    if (status === "elevated") return "text-amber-600";
    return "text-[#5C7F39]";
  };

  const getVitalBgColor = (status: string) => {
    if (status === "alert") return "bg-red-50 border-red-200";
    if (status === "elevated") return "bg-amber-50 border-amber-200";
    return "bg-green-50/50 border-green-100";
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-[#5C7F39]" />
          <h2 className="font-serif text-lg font-semibold text-[#5C7F39]">Daily Well-being Score</h2>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 border border-green-200">
            <Smile className="h-4 w-4 text-[#5C7F39]" />
            <span className="text-xs font-medium text-[#5C7F39]">Mood: {data.mood.status}</span>
          </div>
          {data.behavioralIncidents === 0 && (
            <>
              <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 border border-green-200">
                <Shield className="h-3.5 w-3.5 text-[#5C7F39]" />
                <span className="text-xs font-medium text-[#5C7F39]">No falls detected</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 border border-green-200">
                <CheckCircle className="h-3.5 w-3.5 text-[#5C7F39]" />
                <span className="text-xs font-medium text-[#5C7F39]">No incidents detected</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Score + Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#5C7F39]">{data.score}</div>
        <div className="text-center sm:text-right">
          <div className="text-sm text-gray-500">Out of 100</div>
          <span className="inline-flex rounded-full bg-[#5C7F39] px-3 py-1 text-xs font-semibold text-white">{data.rating}</span>
        </div>
      </div>
      <div className="mb-5 h-3 rounded-full bg-green-100">
        <div className="h-3 rounded-full bg-[#5C7F39] transition-all" style={{ width: `${data.score}%` }} />
      </div>

      {/* Priority Vitals - Top-level */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-500 mb-2">Priority vitals</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <div className={`rounded-lg p-2.5 border ${getVitalBgColor(data.vitals.bloodPressure.status)}`}>
            <Gauge className="h-3.5 w-3.5 text-[#5C7F39] mb-0.5" />
            <div className="text-[10px] text-gray-500">Blood Pressure</div>
            <div className={`text-sm font-semibold ${getVitalStatusColor(data.vitals.bloodPressure.status)}`}>{data.vitals.bloodPressure.value}</div>
          </div>
          <div className={`rounded-lg p-2.5 border ${getVitalBgColor(data.vitals.bloodSugar.status)}`}>
            <Activity className="h-3.5 w-3.5 text-[#5C7F39] mb-0.5" />
            <div className="text-[10px] text-gray-500">Blood Sugar</div>
            <div className={`text-sm font-semibold ${getVitalStatusColor(data.vitals.bloodSugar.status)}`}>{data.vitals.bloodSugar.value} {data.vitals.bloodSugar.unit}</div>
          </div>
          <div className={`rounded-lg p-2.5 border ${getVitalBgColor(data.vitals.hydration.status)}`}>
            <Droplets className="h-3.5 w-3.5 text-[#5C7F39] mb-0.5" />
            <div className="text-[10px] text-gray-500">Hydration</div>
            <div className={`text-sm font-semibold ${getVitalStatusColor(data.vitals.hydration.status)}`}>{data.vitals.hydration.value}</div>
          </div>
          <div className={`rounded-lg p-2.5 border ${getVitalBgColor(data.vitals.heartRate.status)}`}>
            <Heart className="h-3.5 w-3.5 text-[#5C7F39] mb-0.5" />
            <div className="text-[10px] text-gray-500">Heart Rate</div>
            <div className={`text-sm font-semibold ${getVitalStatusColor(data.vitals.heartRate.status)}`}>{data.vitals.heartRate.value} {data.vitals.heartRate.unit}</div>
          </div>
          <div className={`rounded-lg p-2.5 border ${getVitalBgColor(data.vitals.respiratoryRate.status)}`}>
            <Wind className="h-3.5 w-3.5 text-[#5C7F39] mb-0.5" />
            <div className="text-[10px] text-gray-500">Respiratory Rate</div>
            <div className={`text-sm font-semibold ${getVitalStatusColor(data.vitals.respiratoryRate.status)}`}>{data.vitals.respiratoryRate.value} {data.vitals.respiratoryRate.unit}</div>
          </div>
        </div>
      </div>

      {/* Medication Compliance - Prominent */}
      <div className="mb-4 p-3 rounded-lg border bg-gray-50 border-gray-100">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Pill className="h-4 w-4 text-[#5C7F39]" />
            <span className="text-sm font-medium text-gray-700">Medication compliance</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {data.medications.status === "up_to_date" ? (
              <div className="flex items-center gap-1.5 text-[#5C7F39]">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-semibold">Up to date</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-600">
                <X className="h-4 w-4" />
                <span className="text-sm font-semibold">Missed</span>
              </div>
            )}
            <span className="text-xs text-gray-500">{data.medications.taken}/{data.medications.taken + data.medications.missed} taken</span>
            <Link
              href="/logs/medications"
              prefetch
              className="inline-flex items-center gap-1 rounded-lg bg-[#5C7F39] px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-[#4a6a2e] transition-colors"
            >
              View
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
        {hasMissedMeds && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-xs text-red-600 font-medium">Missed:</span>
            {data.medications.missedList.map((med, i) => (
              <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded">{med}</span>
            ))}
          </div>
        )}
        {data.medications.prerequisiteNote && (
          <div className="mt-2 flex items-center gap-2 text-amber-700 text-xs bg-amber-50 px-2 py-1.5 rounded border border-amber-200">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            {data.medications.prerequisiteNote}
          </div>
        )}
      </div>

      {/* Sub-metrics Row */}
      <div className="mb-4 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
        {[
          { icon: Droplets, label: "Hydration", value: data.vitals.hydration.value },
          { icon: Bed, label: "Sleep", value: data.sleep },
          { icon: Pill, label: "Medications", value: data.medications.status === "up_to_date" ? "On track" : "Needs attention" },
          { icon: Footprints, label: "Movement", value: data.movement },
        ].map((item, index) => (
          <div key={index} className="text-center p-2 rounded-lg bg-gray-50 border border-gray-100">
            <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 text-[#5C7F39]" />
            <div className="font-medium text-gray-600 text-xs sm:text-sm">{item.label}</div>
            <div className="text-gray-600 text-xs sm:text-sm">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Mood & Behavioral Tracking - at bottom */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Smile className="h-5 w-5 text-[#5C7F39]" />
          <h3 className="font-serif text-base font-semibold text-[#5C7F39]">Mood & Behavioral Tracking</h3>
        </div>

        {/* Behavioral flags */}
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-500 mb-2">Behavioral flags</div>
          {hasAnomalies ? (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-700 text-sm font-medium mb-2">
                <AlertTriangle className="h-4 w-4 shrink-0" /> Anomalies detected
              </div>
              <ul className="text-xs text-amber-600 space-y-1">
                {data.anomalies.map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-[#5C7F39]">
              <CheckCircle className="h-4 w-4 shrink-0" />
              No behavioral anomalies flagged
            </div>
          )}
        </div>

        {/* Mood data logging */}
        <div className="mb-4 flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#5C7F39]" />
            <span className="text-sm font-medium text-gray-700">Mood data</span>
          </div>
          <div className="flex items-center gap-2">
            {data.moodDataLogged ? (
              <>
                <span className="text-xs text-[#5C7F39] font-medium">Logged for reporting</span>
                <span className="text-[10px] text-gray-400">Last: {data.lastLogged}</span>
              </>
            ) : (
              <span className="text-xs text-gray-500">Not yet logged</span>
            )}
          </div>
        </div>

        {/* Mood stability (7 days) - at bottom with day labels and percentages */}
        <div>
          <div className="text-xs font-medium text-gray-500 mb-2">Mood stability (7 days)</div>
          <div className="flex items-end gap-1 sm:gap-2" style={{ height: "7rem" }}>
            {data.mood.trend.map((val, i) => {
              const min = Math.min(...data.mood.trend);
              const max = Math.max(...data.mood.trend);
              const range = max - min || 1;
              const barHeightPct = ((val - min) / range) * 70 + 30;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
                  <span className="text-[10px] font-medium text-gray-700 mb-0.5">{val}%</span>
                  <div
                    className="w-full rounded-t bg-[#A8BB98] min-h-[6px] flex-shrink-0"
                    style={{ height: `${barHeightPct}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex gap-1 sm:gap-2 mt-2">
            {DAY_LABELS.map((day, i) => (
              <div key={i} className="flex-1 text-center">
                <span className="text-[10px] text-gray-500">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

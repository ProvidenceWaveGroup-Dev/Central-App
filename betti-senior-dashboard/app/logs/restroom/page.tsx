"use client";

import { useState, useMemo } from "react";
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const ITEMS_PER_PAGE = 5;

const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const parseHour24 = (time: string) => {
  const parts = time.split(":");
  let hour = parseInt(parts[0] || "0", 10);
  const isPM = time.toUpperCase().includes("PM");
  if (isPM && hour !== 12) hour += 12;
  if (!isPM && hour === 12) hour = 0;
  return hour;
};

export default function RestroomActivityPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const restroomLogs = [
    {
      id: 1,
      date: "2024-01-15",
      time: "08:30 AM",
      duration: "3 min",
      location: "Main Bathroom",
      frequency: "Normal",
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "11:45 AM",
      duration: "2 min",
      location: "Main Bathroom",
      frequency: "Normal",
    },
    {
      id: 3,
      date: "2024-01-15",
      time: "02:15 PM",
      duration: "4 min",
      location: "Main Bathroom",
      frequency: "Normal",
    },
    {
      id: 4,
      date: "2024-01-15",
      time: "05:30 PM",
      duration: "3 min",
      location: "Main Bathroom",
      frequency: "Normal",
    },
    {
      id: 5,
      date: "2024-01-14",
      time: "09:00 AM",
      duration: "5 min",
      location: "Main Bathroom",
      frequency: "Longer",
    },
  ];

  const performanceMetrics = {
    averageDaily: 4.2,
    averageDuration: "3.1 min",
    status: "Good",
    trend: "Stable",
    bathroomVisitFrequency: "4.2 visits/day",
  };

  const abnormalPatterns = [
    {
      id: 1,
      type: "elevated_frequency",
      label: "Elevated frequency on Jan 14",
      description: "5 visits detected vs. typical 4.2/day average",
      severity: "low",
      date: "2024-01-14",
    },
  ];

  const dateFilterStr = selectedDate ? toDateStr(selectedDate) : "";
  const filteredLogs = useMemo(
    () =>
      restroomLogs.filter((log) => {
        if (selectedDate && log.date !== dateFilterStr) return false;
        if (timeFilter !== "all") {
          const h = parseHour24(log.time);
          if (timeFilter === "morning" && (h < 6 || h >= 12)) return false;
          if (timeFilter === "afternoon" && (h < 12 || h >= 18)) return false;
          if (timeFilter === "evening" && (h < 18 || h >= 24)) return false;
        }
        return true;
      }),
    [restroomLogs, selectedDate, dateFilterStr, timeFilter]
  );
  const sortedLogs = useMemo(() => [...filteredLogs].sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0)), [filteredLogs]);
  const totalPages = Math.max(1, Math.ceil(sortedLogs.length / ITEMS_PER_PAGE));
  const paginated = sortedLogs.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
  const datesWithLogs = useMemo(() => new Set(restroomLogs.map((l) => l.date)), [restroomLogs]);

  const getEncouragementMessage = () => {
    const avgDaily = performanceMetrics.averageDaily;
    if (avgDaily >= 4 && avgDaily <= 6) {
      return "Great job maintaining healthy restroom habits! Your regularity shows excellent digestive health.";
    } else if (avgDaily < 4) {
      return "Consider staying hydrated and eating fiber-rich foods to support healthy digestion.";
    } else {
      return "Your activity levels look good. Keep monitoring for any changes in your routine.";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Restroom Activity Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track your restroom activity patterns</p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{performanceMetrics.averageDaily}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Avg Daily Visits</p>
          </div>

          <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4">
            <div className="flex items-center justify-between">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              <span className="text-xl font-bold text-indigo-600">{performanceMetrics.bathroomVisitFrequency}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Bathroom Visit Frequency</p>
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{performanceMetrics.averageDuration}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Avg Duration</p>
          </div>

          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">{performanceMetrics.status}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Performance</p>
          </div>

          <div className="rounded-xl bg-purple-50 border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{performanceMetrics.trend}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Trend</p>
          </div>
        </div>

        {/* Abnormal Pattern Detection */}
        {abnormalPatterns.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Abnormal Pattern Detection</h2>
            </div>
            <div className="space-y-3">
              {abnormalPatterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-lg bg-white border border-amber-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">{pattern.label}</p>
                    <p className="text-sm text-gray-600 mt-1">{pattern.description}</p>
                  </div>
                  <span
                    className={`self-start sm:self-center inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      pattern.severity === "low"
                        ? "bg-amber-100 text-amber-800 border border-amber-200"
                        : pattern.severity === "medium"
                          ? "bg-orange-100 text-orange-800 border border-orange-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                    }`}
                  >
                    {pattern.severity === "low" ? "Low" : pattern.severity === "medium" ? "Medium" : "High"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar + Filter + Activity History */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 min-h-[420px] flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Activity History</h2>
            </div>
            <select
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent bg-white"
            >
              <option value="all">All Day</option>
              <option value="morning">Morning (6 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
              <option value="evening">Evening (6 PM - 12 AM)</option>
            </select>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            <div className="flex-shrink-0 rounded-lg border border-gray-200 p-4 bg-gray-50/50">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => {
                  setSelectedDate(d);
                  setCurrentPage(0);
                }}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
                modifiers={{ hasLog: (date) => datesWithLogs.has(toDateStr(date)) }}
                modifiersClassNames={{ hasLog: "bg-green-500/10 font-semibold" }}
                className="mx-auto"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(undefined)}
                  className="mt-3 w-full text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear selection
                </button>
              )}
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <p className="text-sm text-gray-600 mb-2">
                {selectedDate
                  ? `Activity on ${selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`
                  : "Click a date to filter by day"}
              </p>
              <div className="overflow-y-auto flex-1 space-y-3 pr-1">
            {paginated.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{log.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{log.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{log.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Duration: {log.duration}</span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      log.frequency === "Normal"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {log.frequency}
                  </span>
                </div>
              </div>
            ))}
              </div>
              {sortedLogs.length > ITEMS_PER_PAGE && (
                <div className="flex-shrink-0 flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Showing {currentPage * ITEMS_PER_PAGE + 1}–{Math.min((currentPage + 1) * ITEMS_PER_PAGE, sortedLogs.length)} of {sortedLogs.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      className="p-1.5 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-600 px-2">{currentPage + 1} / {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={currentPage >= totalPages - 1}
                      className="p-1.5 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Encouragement */}
        <div className="rounded-xl bg-[#233E7D] p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-white" />
            <h3 className="font-serif text-lg font-semibold text-white">Daily Encouragement</h3>
          </div>
          <p className="text-white/90 leading-relaxed">{getEncouragementMessage()}</p>
        </div>
      </div>
    </div>
  );
}

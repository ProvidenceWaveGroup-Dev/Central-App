"use client";

import { useState, useMemo } from "react";
import {
  Activity,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  TrendingUp,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const PT_MOCK = {
  todayPrompt: { id: "pt1", title: "Morning stretches", duration: "10 min", completed: false },
  sessionsThisWeek: [
    { day: "Mon", completed: true },
    { day: "Tue", completed: false },
    { day: "Wed", completed: true },
    { day: "Thu", completed: true },
    { day: "Fri", completed: false },
    { day: "Sat", completed: false },
    { day: "Sun", completed: true },
  ],
  weeklyCompliance: 57,
  complianceTrend: [40, 50, 45, 60, 55, 50, 57],
  caseStudyMetric: "4.2 sessions/week avg",
};

const ITEMS_PER_PAGE = 5;

const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function PTExercisePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [todayCompleted, setTodayCompleted] = useState(PT_MOCK.todayPrompt.completed);
  const [currentPage, setCurrentPage] = useState(0);
  const sessions = [
    { id: 1, date: "2024-01-16", type: "Morning stretches", duration: "10 min", completed: true },
    { id: 2, date: "2024-01-15", type: "Physical therapy", duration: "30 min", completed: true },
    { id: 3, date: "2024-01-14", type: "Walking", duration: "20 min", completed: false },
  ];

  const dateFilterStr = selectedDate ? toDateStr(selectedDate) : "";
  const filtered = useMemo(
    () => (selectedDate ? sessions.filter((s) => s.date === dateFilterStr) : sessions),
    [sessions, selectedDate, dateFilterStr]
  );
  const sorted = useMemo(() => [...filtered].sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0)), [filtered]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginated = sorted.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
  const datesWithSessions = useMemo(() => new Set(sessions.map((s) => s.date)), [sessions]);
  const completedCount = sessions.filter((s) => s.completed).length;
  const complianceRate = Math.round((completedCount / sessions.length) * 100);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">PT & Exercise Logs</h1>
          <p className="text-sm text-gray-500 mt-1">Track your physical therapy and exercise sessions</p>
        </div>

        {/* PT & Exercise - Today's prompt, weekly compliance, case study metric */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-[#5C7F39]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">Physical Therapy & Exercise</h2>
          </div>
          <div className="mb-4 p-4 rounded-xl bg-[#5C7F39]/10 border border-[#5C7F39]/30">
            <div className="text-xs font-medium text-[#5C7F39] mb-2">Today&apos;s prompt</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">{PT_MOCK.todayPrompt.title}</div>
                <div className="text-sm text-gray-500">{PT_MOCK.todayPrompt.duration}</div>
              </div>
              {!todayCompleted ? (
                <button
                  onClick={() => setTodayCompleted(true)}
                  className="rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a6a2e]"
                >
                  Mark complete
                </button>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Done</span>
                </div>
              )}
            </div>
          </div>
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-500 mb-2">This week</div>
            <div className="flex gap-1">
              {PT_MOCK.sessionsThisWeek.map((s, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded py-2 text-center text-[10px] font-medium ${s.completed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  title={`${s.day}: ${s.completed ? "Completed" : "Pending"}`}
                >
                  {s.day}
                </div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">Weekly compliance</span>
              <span className="text-sm font-bold text-[#5C7F39]">{PT_MOCK.weeklyCompliance}%</span>
            </div>
            <div className="flex items-end gap-1">
              {PT_MOCK.complianceTrend.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <span className="text-[9px] font-semibold text-[#5C7F39] mb-0.5">{val}%</span>
                  <div className="w-full h-10 flex flex-col justify-end">
                    <div className="w-full rounded-t bg-[#5C7F39]/50 min-h-[4px]" style={{ height: `${val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <BarChart3 className="h-4 w-4 text-[#5C7F39]" />
            <span className="text-xs font-medium text-gray-700">{PT_MOCK.caseStudyMetric}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <CheckCircle className="h-5 w-5 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
            <p className="text-xs font-medium text-gray-600">Sessions completed</p>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <TrendingUp className="h-5 w-5 text-blue-600 mb-2" />
            <div className="text-2xl font-bold text-blue-600">{complianceRate}%</div>
            <p className="text-xs font-medium text-gray-600">Compliance rate</p>
          </div>
        </div>

        {/* Calendar + Sessions List */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 min-h-[420px] flex flex-col">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Sessions</h2>
            </div>
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
                modifiers={{ hasSession: (date) => datesWithSessions.has(toDateStr(date)) }}
                modifiersClassNames={{ hasSession: "bg-[#5C7F39]/10 font-semibold" }}
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
                  ? `Sessions on ${selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`
                  : "Click a date to filter by day"}
              </p>
              <div className="overflow-y-auto flex-1 space-y-3 pr-1">
            {paginated.map((s) => (
              <div
                key={s.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${s.completed ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}
              >
                <div className="flex items-center gap-3">
                  {s.completed ? <CheckCircle className="h-5 w-5 text-green-600" /> : <Clock className="h-5 w-5 text-gray-400" />}
                  <div>
                    <div className="font-semibold text-gray-900">{s.type}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" />{s.date}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.duration}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${s.completed ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                  {s.completed ? "Completed" : "Missed"}
                </span>
              </div>
            ))}
              </div>
              {sorted.length > ITEMS_PER_PAGE && (
                <div className="flex-shrink-0 flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Showing {currentPage * ITEMS_PER_PAGE + 1}–{Math.min((currentPage + 1) * ITEMS_PER_PAGE, sorted.length)} of {sorted.length}
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
      </div>
    </div>
  );
}

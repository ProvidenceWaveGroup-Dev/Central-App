"use client";

import { useState, useMemo } from "react";
import {
  CalendarDays,
  Clock,
  TrendingUp,
  CheckCircle,
  X,
  Pill,
  Gauge,
  AlertTriangle,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 5;

const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type LogStatus = "Taken" | "Missed";

interface MedicationLog {
  id: number;
  date: string;
  time: string;
  medication: string;
  dosage: string;
  status: LogStatus;
  condition: string;
  sideEffects: string;
  prerequisiteVital: string | null;
  prerequisiteMet: boolean;
}

const MEDICATION_LOGS: MedicationLog[] = [
  { id: 1, date: "2024-01-15", time: "08:00 AM", medication: "Lisinopril 10mg", dosage: "1 tablet", status: "Taken", condition: "Blood Pressure", sideEffects: "None", prerequisiteVital: "BP check required before dose", prerequisiteMet: true },
  { id: 2, date: "2024-01-15", time: "02:00 PM", medication: "Metformin 500mg", dosage: "1 tablet", status: "Missed", condition: "Diabetes", sideEffects: "None", prerequisiteVital: "Blood sugar check recommended", prerequisiteMet: false },
  { id: 3, date: "2024-01-15", time: "08:00 PM", medication: "Atorvastatin 20mg", dosage: "1 tablet", status: "Taken", condition: "Cholesterol", sideEffects: "None", prerequisiteVital: null, prerequisiteMet: true },
  { id: 4, date: "2024-01-14", time: "08:00 AM", medication: "Lisinopril 10mg", dosage: "1 tablet", status: "Taken", condition: "Blood Pressure", sideEffects: "None", prerequisiteVital: "BP check required before dose", prerequisiteMet: true },
  { id: 5, date: "2024-01-14", time: "02:00 PM", medication: "Metformin 500mg", dosage: "1 tablet", status: "Taken", condition: "Diabetes", sideEffects: "Mild nausea", prerequisiteVital: "Blood sugar check recommended", prerequisiteMet: true },
  { id: 6, date: "2024-01-14", time: "08:00 PM", medication: "Atorvastatin 20mg", dosage: "1 tablet", status: "Taken", condition: "Cholesterol", sideEffects: "None", prerequisiteVital: null, prerequisiteMet: true },
];

export default function MedicationsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentPage, setCurrentPage] = useState(0);

  const datesWithLogs = useMemo(() => new Set(MEDICATION_LOGS.map((m) => m.date)), []);

  const missedToday = MEDICATION_LOGS.filter((m) => m.status === "Missed" && m.date === "2024-01-15");
  const withPrerequisite = MEDICATION_LOGS.filter((m) => m.prerequisiteVital);
  const prerequisitePending = withPrerequisite.filter((m) => !m.prerequisiteMet && m.status !== "Taken");

  const healthMetrics = {
    adherenceRate: 88,
    improvementScore: 92,
    status: "Excellent",
    weeklyCompliance: 94,
    streakDays: 12,
  };

  const filteredMedications = useMemo(() => {
    return MEDICATION_LOGS.filter((med) => {
      if (viewMode === "calendar" && selectedDate) {
        if (med.date !== toDateStr(selectedDate)) return false;
      }
      if (statusFilter !== "all" && med.status.toLowerCase() !== statusFilter) return false;
      return true;
    });
  }, [viewMode, selectedDate, statusFilter]);

  const allMedicationsForList = useMemo(
    () =>
      MEDICATION_LOGS.filter((med) => {
        if (statusFilter !== "all" && med.status.toLowerCase() !== statusFilter) return false;
        return true;
      }),
    [statusFilter]
  );

  const displayList = viewMode === "list" ? allMedicationsForList : filteredMedications;
  const sorted = useMemo(
    () => [...displayList].sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0)),
    [displayList]
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const paginated = sorted.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  const getEncouragementMessage = () => {
    if (healthMetrics.adherenceRate >= 90) return "Outstanding medication adherence! Your commitment to your health is truly inspiring.";
    if (healthMetrics.adherenceRate >= 80) return "Great job staying on track with your medications! Keep up the excellent work.";
    if (healthMetrics.adherenceRate >= 70) return "You're doing well with your medication routine. Small improvements can make a big difference!";
    return "Every step towards better medication adherence is progress. You've got this!";
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Medication History</h1>
          <p className="text-sm text-gray-500 mt-1">Track your medication adherence and daily routine</p>
        </div>

        {missedToday.length > 0 && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <X className="h-5 w-5 text-red-600" />
              <h2 className="font-serif text-lg font-semibold text-red-700">Missed Medications Today</h2>
            </div>
            <p className="text-sm text-red-600 mb-3">The following medications were not taken. Consider taking them as soon as possible or contacting your care team.</p>
            <div className="space-y-2">
              {missedToday.map((med) => (
                <div key={med.id} className="flex items-center justify-between p-3 rounded-lg bg-white border border-red-200">
                  <div>
                    <span className="font-semibold text-red-700">{med.medication}</span>
                    <span className="text-sm text-red-600 ml-2">— {med.dosage} ({med.time})</span>
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-medium">Missed</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {prerequisitePending.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="h-5 w-5 text-amber-600" />
              <h2 className="font-serif text-lg font-semibold text-amber-700">Prerequisite Vitals Required</h2>
            </div>
            <p className="text-sm text-amber-600 mb-3">Complete these vital checks before taking the medication.</p>
            <ul className="space-y-2">
              {prerequisitePending.map((med) => (
                <li key={med.id} className="flex items-center gap-2 p-3 rounded-lg bg-white border border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span className="font-medium text-amber-800">{med.medication}</span>
                  <span className="text-sm text-amber-700">— {med.prerequisiteVital}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <Pill className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{healthMetrics.adherenceRate}%</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Adherence Rate</p>
            <div className="mt-2 h-2 rounded-full bg-green-100">
              <div className="h-2 rounded-full bg-green-600 transition-all" style={{ width: `${healthMetrics.adherenceRate}%` }} />
            </div>
          </div>
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{healthMetrics.improvementScore}%</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Routine Trend</p>
            <div className="mt-2 h-2 rounded-full bg-blue-100">
              <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${healthMetrics.improvementScore}%` }} />
            </div>
          </div>
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span className="inline-flex rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">{healthMetrics.status}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Overall Status</p>
          </div>
          <div className="rounded-xl bg-purple-50 border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{healthMetrics.weeklyCompliance}%</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Weekly Compliance</p>
          </div>
          <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-2xl font-bold text-indigo-600">{healthMetrics.streakDays}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Streak (days on track)</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 min-h-[420px] flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">
                {viewMode === "calendar" ? "Select Date" : "All Medications"}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={viewMode === "calendar" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setViewMode("calendar");
                  setCurrentPage(0);
                }}
              >
                <CalendarDays className="h-4 w-4 mr-1.5" />
                Calendar
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setViewMode("list");
                  setCurrentPage(0);
                }}
              >
                <List className="h-4 w-4 mr-1.5" />
                List View
              </Button>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="taken">Taken</option>
                <option value="missed">Missed</option>
              </select>
            </div>
          </div>

          <div
            className={`flex flex-1 min-h-0 ${viewMode === "list" ? "flex-col" : "flex-col lg:flex-row gap-6"}`}
          >
            {viewMode === "calendar" && (
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
                  modifiersClassNames={{ hasLog: "bg-[#5C7F39]/10 font-semibold" }}
                  className="mx-auto"
                />
                {selectedDate && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => {
                      setSelectedDate(undefined);
                      setCurrentPage(0);
                    }}
                  >
                    Clear selection
                  </Button>
                )}
              </div>
            )}

            <div
              className={`flex-1 flex flex-col min-w-0 ${viewMode === "list" ? "w-full" : ""}`}
            >
              {viewMode === "calendar" && (
                <p className="text-sm text-gray-600 mb-2">
                  {selectedDate
                    ? `Medications on ${selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}`
                    : "Click a date to see medications for that day"}
                </p>
              )}
              <div className="flex-1 min-h-0 flex flex-col">
                <div className="overflow-y-auto flex-1 space-y-3 pr-1">
                  {paginated.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic py-4">
                      {viewMode === "calendar" && !selectedDate
                        ? "Select a date to view medications"
                        : viewMode === "calendar" && selectedDate
                        ? "No medications on this date."
                        : "No medications match your filters."}
                    </p>
                  ) : (
                  paginated.map((med) => (
                <div
                  key={med.id}
                  className={`rounded-lg border p-4 hover:bg-gray-50 transition-colors ${med.status === "Taken" ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30"}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Pill className="h-4 w-4 text-[#233E7D]" />
                      <span className="font-serif font-semibold text-gray-900">{med.medication}</span>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {med.status === "Taken" ? <CheckCircle className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-500" />}
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${med.status === "Taken" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                        {med.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">{med.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{med.time}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Dosage: </span>
                        <span className="text-gray-600">{med.dosage}</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-700">Condition: </span>
                        <span className="font-medium text-[#5C7F39]">{med.condition}</span>
                      </div>
                      {med.prerequisiteVital && (
                        <div className={`flex items-center gap-2 text-sm ${med.prerequisiteMet ? "text-green-600" : "text-amber-600"}`}>
                          <Gauge className="h-4 w-4 shrink-0" />
                          <span>{med.prerequisiteVital}{med.prerequisiteMet ? " ✓" : ""}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">Side Effects:</div>
                      <div className="text-sm">
                        {med.sideEffects === "None" ? <span className="text-green-600 font-medium">No side effects reported</span> : <span className="text-orange-600 font-medium">{med.sideEffects}</span>}
                      </div>
                    </div>
                  </div>
                </div>
                  ))
                  )}
                </div>

                {sorted.length > ITEMS_PER_PAGE && (
                  <div className="flex-shrink-0 flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Showing {currentPage * ITEMS_PER_PAGE + 1}–{Math.min((currentPage + 1) * ITEMS_PER_PAGE, sorted.length)} of {sorted.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-600 px-2">{currentPage + 1} / {totalPages}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage >= totalPages - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[#233E7D] p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Pill className="h-5 w-5 text-white" />
            <h3 className="font-serif text-lg font-semibold text-white">Daily Encouragement</h3>
          </div>
          <p className="text-white/90 leading-relaxed">{getEncouragementMessage()}</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import {
  CalendarDays,
  Clock,
  User,
  FileText,
  CheckCircle,
  List,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 5;

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmedNotes, setConfirmedNotes] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [currentPage, setCurrentPage] = useState(0);

  const appointments = [
    {
      id: 1,
      date: "2024-01-16",
      time: "02:00 PM",
      doctor: "Dr. Smith",
      type: "General Checkup",
      status: "Confirmed",
      notes:
        "Blood pressure check and routine examination. Patient is doing well.",
      noteConfirmed: false,
    },
    {
      id: 2,
      date: "2024-01-18",
      time: "10:00 AM",
      doctor: "Physical Therapist",
      type: "Physical Therapy",
      status: "Scheduled",
      notes: "",
      noteConfirmed: false,
    },
    {
      id: 3,
      date: "2024-01-10",
      time: "09:30 AM",
      doctor: "Dr. Johnson",
      type: "Cardiology",
      status: "Completed",
      notes:
        "Heart rate and rhythm normal. Continue current medication regimen. Next visit in 3 months.",
      noteConfirmed: true,
    },
    {
      id: 4,
      date: "2024-01-05",
      time: "11:15 AM",
      doctor: "Dr. Williams",
      type: "Dermatology",
      status: "Completed",
      notes:
        "Skin examination complete. Minor age spots noted, no concerns. Use sunscreen daily.",
      noteConfirmed: true,
    },
    {
      id: 5,
      date: "2023-12-28",
      time: "03:45 PM",
      doctor: "Dr. Brown",
      type: "Eye Exam",
      status: "Completed",
      notes:
        "Vision stable. Prescription unchanged. Schedule next exam in 12 months.",
      noteConfirmed: false,
    },
    {
      id: 6,
      date: "2024-01-12",
      time: "02:00 PM",
      doctor: "Dr. Martinez",
      type: "Lab Work",
      status: "Missed",
      notes: "",
      noteConfirmed: false,
    },
  ];

  const handleConfirmNote = (appointmentId: number) => {
    setConfirmedNotes((prev) => [...prev, appointmentId]);
  };

  const toDateStr = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      if (viewMode === "calendar" && selectedDate) {
        if (appointment.date !== toDateStr(selectedDate)) return false;
      }
      if (statusFilter !== "all" && appointment.status.toLowerCase() !== statusFilter)
        return false;
      return true;
    });
  }, [appointments, viewMode, selectedDate, statusFilter]);

  const allAppointmentsForList = useMemo(() => {
    return appointments.filter((appointment) => {
      if (statusFilter !== "all" && appointment.status.toLowerCase() !== statusFilter)
        return false;
      return true;
    });
  }, [appointments, statusFilter]);

  const displayList = viewMode === "list" ? allAppointmentsForList : filteredAppointments;
  const sortedList = useMemo(
    () => [...displayList].sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0)),
    [displayList]
  );

  const totalPages = Math.max(1, Math.ceil(sortedList.length / ITEMS_PER_PAGE));
  const paginatedList = sortedList.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const completedAppointments = appointments.filter((apt) => apt.status === "Completed").length;
  const missedAppointments = appointments.filter((apt) => apt.status === "Missed").length;
  const totalAppointments = appointments.length;
  const completionRate = totalAppointments
    ? Math.round((completedAppointments / totalAppointments) * 100)
    : 0;
  const adherenceRate = totalAppointments
    ? Math.round(((totalAppointments - missedAppointments) / totalAppointments) * 100)
    : 100;

  const statusColor: Record<string, string> = {
    Completed: "bg-green-100 text-green-700 border border-green-200",
    Confirmed: "bg-blue-100 text-blue-700 border border-blue-200",
    Scheduled: "bg-gray-100 text-gray-700 border border-gray-300",
    Missed: "bg-red-100 text-red-700 border border-red-200",
  };

  const datesWithAppointments = useMemo(
    () => new Set(appointments.map((a) => a.date)),
    [appointments]
  );

  return (
    <div className="flex flex-col min-h-0 h-full">
      {/* Fixed Header - like navbar (disabled on smaller screens) */}
      <div className="flex-shrink-0 lg:sticky lg:top-0 z-10 bg-white border-b border-gray-200 px-4 md:px-6 lg:px-8 py-4">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
          Medical Appointments
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your upcoming and past appointments
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
              <div className="flex items-center justify-between">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{totalAppointments}</span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-600">Total Appointments</p>
            </div>
            <div className="rounded-xl bg-green-50 border border-green-200 p-4">
              <div className="flex items-center justify-between">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{completedAppointments}</span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-600">Completed</p>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
              <div className="flex items-center justify-between">
                <Clock className="h-5 w-5 text-amber-600" />
                <span className="text-2xl font-bold text-amber-600">
                  {appointments.filter((a) => a.status !== "Completed").length}
                </span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-600">Upcoming</p>
            </div>
            <div className="rounded-xl bg-purple-50 border border-purple-200 p-4">
              <div className="flex items-center justify-between">
                <CalendarDays className="h-5 w-5 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">{completionRate}%</span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-600">Completion Rate</p>
            </div>
            <div className="rounded-xl bg-teal-50 border border-teal-200 p-4">
              <div className="flex items-center justify-between">
                <CalendarCheck className="h-5 w-5 text-teal-600" />
                <span className="text-2xl font-bold text-teal-600">{adherenceRate}%</span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-600">Adherence</p>
              {missedAppointments > 0 && (
                <p className="mt-1 text-xs text-amber-600">{missedAppointments} missed</p>
              )}
            </div>
          </div>

          {/* Main Card: Calendar + Appointments (or List only) */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 min-h-[420px] flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-[#233E7D]" />
                <h2 className="font-serif text-lg font-semibold text-gray-900">
                  {viewMode === "calendar" ? "Select Date" : "All Appointments"}
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
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="missed">Missed</option>
                </select>
              </div>
            </div>

            <div
              className={`flex flex-1 min-h-0 ${viewMode === "list" ? "flex-col" : "flex-col lg:flex-row gap-6"}`}
            >
              {/* Calendar - only in calendar view */}
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
                    modifiers={{
                      hasAppointment: (date) =>
                        datesWithAppointments.has(toDateStr(date)),
                    }}
                    modifiersClassNames={{
                      hasAppointment: "bg-[#233E7D]/10 font-semibold",
                    }}
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

              {/* Appointments List - scrollable, paginated */}
              <div
                className={`flex-1 flex flex-col min-w-0 ${viewMode === "list" ? "w-full" : ""}`}
              >
                {viewMode === "calendar" && (
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedDate
                      ? `Appointments on ${selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}`
                      : "Click a date to see appointments for that day"}
                  </p>
                )}
                <div className="flex-1 min-h-0 flex flex-col">
                  <div className="overflow-y-auto flex-1 space-y-3 pr-1">
                    {paginatedList.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-4">
                        {viewMode === "calendar" && !selectedDate
                          ? "Select a date to view appointments"
                          : viewMode === "calendar" && selectedDate
                          ? "No appointments on this date."
                          : "No appointments match your filters."}
                      </p>
                    ) : (
                      paginatedList.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="rounded-lg border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-[#233E7D]" />
                              <span className="font-serif font-semibold text-gray-900">
                                {appointment.type}
                              </span>
                            </div>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold self-start sm:self-auto ${
                                statusColor[appointment.status] || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <CalendarDays className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {appointment.date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{appointment.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{appointment.doctor}</span>
                            </div>
                          </div>
                          {appointment.notes && (
                            <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm font-medium text-gray-700">
                                    Doctor&apos;s Notes
                                  </span>
                                </div>
                                {(appointment.noteConfirmed ||
                                  confirmedNotes.includes(appointment.id)) && (
                                  <CheckCircle className="h-4 w-4 text-green-600 self-start sm:self-auto" />
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                {appointment.notes}
                              </p>
                              {!appointment.noteConfirmed &&
                                !confirmedNotes.includes(appointment.id) &&
                                appointment.status === "Completed" && (
                                  <button
                                    onClick={() => handleConfirmNote(appointment.id)}
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a6a2e] transition-colors"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Confirm Receipt of Note
                                  </button>
                                )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Pagination */}
                  {sortedList.length > ITEMS_PER_PAGE && (
                    <div className="flex-shrink-0 flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Showing {currentPage * ITEMS_PER_PAGE + 1}–{Math.min((currentPage + 1) * ITEMS_PER_PAGE, sortedList.length)} of {sortedList.length}
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
                        <span className="text-sm text-gray-600 px-2">
                          {currentPage + 1} / {totalPages}
                        </span>
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

          {/* Routine Progress */}
          <div className="rounded-xl bg-[#233E7D] p-6 text-center">
            <h3 className="font-serif text-lg font-semibold text-white mb-2">
              Routine Progress
            </h3>
            <p className="text-white/90 leading-relaxed">
              {completionRate >= 80
                ? "Excellent work staying on top of your scheduled visits! Your commitment to regular appointments is paying off."
                : completionRate >= 60
                ? "You're doing well with your scheduled visits! Keep up the good work attending your appointments and following your care team's guidance."
                : "Remember, regular scheduled visits are important for your well-being. Don't hesitate to book appointments when needed."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

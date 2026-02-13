"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  Filter,
} from "lucide-react";

export default function AppointmentsPage() {
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [confirmedNotes, setConfirmedNotes] = useState<number[]>([]);

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
  ];

  const handleConfirmNote = (appointmentId: number) => {
    setConfirmedNotes((prev) => [...prev, appointmentId]);
  };

  const filteredAppointments = appointments.filter((appointment) => {
    if (dateFilter && !appointment.date.includes(dateFilter)) return false;
    if (
      statusFilter !== "all" &&
      appointment.status.toLowerCase() !== statusFilter
    )
      return false;
    return true;
  });

  const completedAppointments = appointments.filter(
    (apt) => apt.status === "Completed"
  ).length;
  const totalAppointments = appointments.length;
  const completionRate = Math.round(
    (completedAppointments / totalAppointments) * 100
  );

  const statusColor: Record<string, string> = {
    Completed: "bg-green-100 text-green-700 border border-green-200",
    Confirmed: "bg-blue-100 text-blue-700 border border-blue-200",
    Scheduled: "bg-gray-100 text-gray-700 border border-gray-300",
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Medical Appointments
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your upcoming and past appointments</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <Calendar className="h-5 w-5 text-blue-600" />
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
              <Calendar className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{completionRate}%</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Completion Rate</p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Filter by Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">
              Appointments ({filteredAppointments.length})
            </h2>
          </div>
          <div className="space-y-3">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-[#233E7D]" />
                    <span className="font-serif font-semibold text-gray-900">{appointment.type}</span>
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
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{appointment.date}</span>
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
                        <span className="text-sm font-medium text-gray-700">Doctor&apos;s Notes</span>
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
            ))}
          </div>
        </div>

        {/* Health Journey Progress */}
        <div className="rounded-xl bg-[#233E7D] p-6 text-center">
          <h3 className="font-serif text-lg font-semibold text-white mb-2">
            Health Journey Progress
          </h3>
          <p className="text-white/90 leading-relaxed">
            {completionRate >= 80
              ? "Excellent work staying on top of your medical appointments! Your commitment to regular check-ups is keeping you healthy and strong."
              : completionRate >= 60
              ? "You're doing well with your medical care! Keep up the good work attending your appointments and following your doctor's advice."
              : "Remember, regular medical check-ups are important for your health. Don't hesitate to schedule appointments when needed - your health is worth it!"}
          </p>
        </div>
      </div>
    </div>
  );
}

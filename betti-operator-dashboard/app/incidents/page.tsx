"use client";

import { useState } from "react";
import { ClipboardList, Clock, CheckCircle2, AlertTriangle } from "lucide-react";

type IncidentStatus = "open" | "in_progress" | "resolved";

interface Incident {
  id: string;
  type: string;
  resident: string;
  room: string;
  status: IncidentStatus;
  assignedTo: string;
  time: string;
  notes: string;
}

const initialIncidents: Incident[] = [
  { id: "INC-1052", type: "Fall", resident: "Margaret Collins", room: "204", status: "open", assignedTo: "Unassigned", time: "2 min ago", notes: "" },
  { id: "INC-1051", type: "Vitals Alert", resident: "Robert Chen", room: "118", status: "open", assignedTo: "Unassigned", time: "10 min ago", notes: "" },
  { id: "INC-1050", type: "Wandering", resident: "Dorothy Palmer", room: "310", status: "in_progress", assignedTo: "Nurse Sarah Kim", time: "25 min ago", notes: "Resident redirected to common area" },
  { id: "INC-1049", type: "Missed Medication", resident: "Susan Park", room: "220", status: "in_progress", assignedTo: "Aide James Obi", time: "40 min ago", notes: "Family notified" },
  { id: "INC-1048", type: "Device Malfunction", resident: "James Wilson", room: "205", status: "in_progress", assignedTo: "Tech Support", time: "1 hr ago", notes: "Replacement sensor ordered" },
  { id: "INC-1047", type: "Fall in Hallway", resident: "William Davis", room: "302", status: "resolved", assignedTo: "Nurse Maria Lopez", time: "1.5 hr ago", notes: "No injury. Resident stable." },
  { id: "INC-1046", type: "Emergency Response", resident: "Frank Martinez", room: "401", status: "resolved", assignedTo: "Nurse Sarah Kim", time: "2 hr ago", notes: "False alarm. Button pressed accidentally." },
  { id: "INC-1045", type: "Routine Check Failed", resident: "Helen Torres", room: "112", status: "resolved", assignedTo: "Aide James Obi", time: "3 hr ago", notes: "Resident was in therapy session." },
];

const statusConfig: Record<IncidentStatus, { bg: string; text: string; label: string }> = {
  open: { bg: "bg-red-100", text: "text-red-700", label: "Open" },
  in_progress: { bg: "bg-amber-100", text: "text-amber-700", label: "In Progress" },
  resolved: { bg: "bg-green-100", text: "text-green-700", label: "Resolved" },
};

const incidentStats = [
  { label: "Open", value: 2, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  { label: "In Progress", value: 3, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Resolved Today", value: 7, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  { label: "Avg Resolution", value: "12 min", icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50" },
];

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);

  const acknowledge = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id && inc.status === "open" ? { ...inc, status: "in_progress" as IncidentStatus, assignedTo: "You" } : inc))
    );
  };

  const resolve = (id: string) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: "resolved" as IncidentStatus } : inc))
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Incident Management</h1>
          <button className="inline-flex items-center gap-2 rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4f6b32] transition self-start">
            + New Incident
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {incidentStats.map((s) => (
            <div key={s.label} className={`rounded-xl ${s.bg} border border-gray-200 p-4`}>
              <div className="flex items-center justify-between">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
              </div>
              <p className="mt-2 text-xs font-medium text-gray-600">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Incident Table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Resident</div>
            <div className="col-span-1">Room</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Assigned To</div>
            <div className="col-span-1">Time</div>
            <div className="col-span-2">Actions</div>
          </div>
          {incidents.map((inc) => {
            const st = statusConfig[inc.status];
            return (
              <div key={inc.id} className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 items-center px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="lg:col-span-1 text-xs font-mono text-gray-500">{inc.id}</div>
                <div className="lg:col-span-2 text-sm font-medium text-gray-900">{inc.type}</div>
                <div className="lg:col-span-2 text-sm text-gray-700">{inc.resident}</div>
                <div className="lg:col-span-1 text-sm text-gray-600">{inc.room}</div>
                <div className="lg:col-span-1">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${st.bg} ${st.text}`}>{st.label}</span>
                </div>
                <div className="lg:col-span-2 text-sm text-gray-600">{inc.assignedTo}</div>
                <div className="lg:col-span-1 text-xs text-gray-500">{inc.time}</div>
                <div className="lg:col-span-2 flex gap-2">
                  {inc.status === "open" && (
                    <button onClick={() => acknowledge(inc.id)} className="rounded-lg bg-[#233E7D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1c3164] transition">
                      Take On
                    </button>
                  )}
                  {inc.status === "in_progress" && (
                    <button onClick={() => resolve(inc.id)} className="rounded-lg bg-[#5C7F39] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#4f6b32] transition">
                      Resolve
                    </button>
                  )}
                  <button className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition">
                    Notes
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ClipboardList, Clock, CheckCircle2, AlertTriangle, X, Plus } from "lucide-react";
import { Pagination } from "@/components/pagination";

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
  { id: "INC-1052", type: "Fall",                  resident: "Margaret Collins", room: "204", status: "open",        assignedTo: "Unassigned",        time: "2 min ago",   notes: "" },
  { id: "INC-1051", type: "Vitals Alert",           resident: "Robert Chen",      room: "118", status: "open",        assignedTo: "Unassigned",        time: "10 min ago",  notes: "" },
  { id: "INC-1050", type: "Wandering",              resident: "Dorothy Palmer",   room: "310", status: "in_progress", assignedTo: "Nurse Sarah Kim",   time: "25 min ago",  notes: "Resident redirected to common area" },
  { id: "INC-1049", type: "Missed Medication",      resident: "Susan Park",       room: "220", status: "in_progress", assignedTo: "Aide James Obi",    time: "40 min ago",  notes: "Family notified" },
  { id: "INC-1048", type: "Device Malfunction",     resident: "James Wilson",     room: "205", status: "in_progress", assignedTo: "Tech Support",      time: "1 hr ago",    notes: "Replacement sensor ordered" },
  { id: "INC-1047", type: "Fall in Hallway",        resident: "William Davis",    room: "302", status: "resolved",    assignedTo: "Nurse Maria Lopez", time: "1.5 hr ago",  notes: "No injury. Resident stable." },
  { id: "INC-1046", type: "Emergency Response",     resident: "Frank Martinez",   room: "401", status: "resolved",    assignedTo: "Nurse Sarah Kim",   time: "2 hr ago",    notes: "False alarm. Button pressed accidentally." },
  { id: "INC-1045", type: "Routine Check Failed",   resident: "Helen Torres",     room: "112", status: "resolved",    assignedTo: "Aide James Obi",    time: "3 hr ago",    notes: "Resident was in therapy session." },
  { id: "INC-1044", type: "High Blood Pressure",    resident: "Thomas Wright",    room: "306", status: "resolved",    assignedTo: "Nurse Sarah Kim",   time: "3.5 hr ago",  notes: "Physician notified. Medication reviewed." },
  { id: "INC-1043", type: "Inactivity Alert",       resident: "Linda Brown",      room: "115", status: "resolved",    assignedTo: "Aide David Nguyen", time: "4 hr ago",    notes: "Resident was napping." },
  { id: "INC-1042", type: "Fall",                   resident: "Patricia Garcia",  room: "212", status: "resolved",    assignedTo: "Nurse Maria Lopez", time: "4.5 hr ago",  notes: "Minor bruising on left knee. Family notified." },
  { id: "INC-1041", type: "Device Offline",         resident: "James Wilson",     room: "205", status: "resolved",    assignedTo: "Tech Support",      time: "5 hr ago",    notes: "Sensor battery replaced." },
  { id: "INC-1040", type: "Missed Check-in",        resident: "Charles Lee",      room: "408", status: "resolved",    assignedTo: "Aide James Obi",    time: "5.5 hr ago",  notes: "Resident was in the dining room." },
  { id: "INC-1039", type: "Skin Incident Reported", resident: "Dorothy Palmer",   room: "310", status: "resolved",    assignedTo: "Nurse Sarah Kim",   time: "6 hr ago",    notes: "Wound care team notified." },
  { id: "INC-1038", type: "Wandering",              resident: "George Harris",    room: "201", status: "resolved",    assignedTo: "Aide David Nguyen", time: "7 hr ago",    notes: "Resident escorted back to room." },
];

const PAGE_SIZE = 6;

const statusConfig: Record<IncidentStatus, { bg: string; text: string; label: string }> = {
  open:        { bg: "bg-red-100",   text: "text-red-700",   label: "Open"        },
  in_progress: { bg: "bg-amber-100", text: "text-amber-700", label: "In Progress" },
  resolved:    { bg: "bg-green-100", text: "text-green-700", label: "Resolved"    },
};

const incidentStats = [
  { label: "Open",           value: 2,        icon: AlertTriangle, color: "text-red-600",   bg: "bg-red-50"   },
  { label: "In Progress",    value: 3,        icon: Clock,         color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Resolved Today", value: 10,       icon: CheckCircle2,  color: "text-green-600", bg: "bg-green-50" },
  { label: "Avg Resolution", value: "12 min", icon: ClipboardList, color: "text-blue-600",  bg: "bg-blue-50"  },
];

const ROW_CLS = "grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 items-center px-5 py-4 border-b";

// ── Notes Modal ───────────────────────────────────────────────────────────────
function NotesModal({ incident, onSave, onClose }: { incident: Incident; onSave: (id: string, note: string) => void; onClose: () => void }) {
  const [newNote, setNewNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-serif text-lg font-semibold text-gray-900">Incident Notes</h2>
            <p className="text-xs text-gray-500">{incident.id} · {incident.type}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 transition"><X className="h-4 w-4 text-gray-500" /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Incident summary */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Resident", value: incident.resident },
              { label: "Room",     value: `Room ${incident.room}` },
              { label: "Assigned", value: incident.assignedTo },
              { label: "Status",   value: incident.status.replace("_", " "), capitalize: true },
            ].map((row) => (
              <div key={row.label} className="rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{row.label}</p>
                <p className={`font-medium text-gray-800 ${row.capitalize ? "capitalize" : ""}`}>{row.value}</p>
              </div>
            ))}
          </div>

          {/* Existing notes */}
          {incident.notes ? (
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Existing Notes</p>
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-gray-700">{incident.notes}</div>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No notes recorded yet.</p>
          )}

          {/* Add note */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Add Note</p>
            <textarea rows={3} value={newNote} onChange={(e) => setNewNote(e.target.value)}
              placeholder="Describe action taken, observations, or next steps…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#233E7D] focus:outline-none focus:ring-2 focus:ring-[#233E7D]/20 resize-none" />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button onClick={() => { if (newNote.trim()) { onSave(incident.id, newNote); } onClose(); }}
            className="flex-1 rounded-lg bg-[#233E7D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c3164] transition">
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New Incident Modal ────────────────────────────────────────────────────────
function NewIncidentModal({ onSave, onClose }: { onSave: (inc: Omit<Incident, "id" | "time">) => void; onClose: () => void }) {
  const [type, setType]         = useState("");
  const [resident, setResident] = useState("");
  const [room, setRoom]         = useState("");
  const [assignedTo, setAssign] = useState("");
  const [notes, setNotes]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  const valid = type && resident && room;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <p className="font-semibold text-gray-900">Incident created</p>
          <p className="text-sm text-gray-500">{type} for {resident} (Room {room}) has been logged.</p>
          <button onClick={onClose} className="mt-2 rounded-lg bg-[#5C7F39] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4f6b32] transition">Done</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="font-serif text-lg font-semibold text-gray-900">New Incident</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 transition"><X className="h-4 w-4 text-gray-500" /></button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Incident Type <span className="text-red-500">*</span></label>
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/20">
              <option value="">Select type…</option>
              <option value="Fall">Fall</option>
              <option value="Fall in Hallway">Fall in Hallway</option>
              <option value="Vitals Alert">Vitals Alert</option>
              <option value="High Blood Pressure">High Blood Pressure</option>
              <option value="Wandering">Wandering</option>
              <option value="Missed Medication">Missed Medication</option>
              <option value="Missed Check-in">Missed Check-in</option>
              <option value="Emergency Response">Emergency Response</option>
              <option value="Device Malfunction">Device Malfunction</option>
              <option value="Skin Incident Reported">Skin Incident Reported</option>
              <option value="Inactivity Alert">Inactivity Alert</option>
              <option value="Routine Check Failed">Routine Check Failed</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Resident Name <span className="text-red-500">*</span></label>
              <input value={resident} onChange={(e) => setResident(e.target.value)} placeholder="Full name…"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/20" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Room <span className="text-red-500">*</span></label>
              <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="e.g. 204"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/20" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Assign To</label>
            <select value={assignedTo} onChange={(e) => setAssign(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/20">
              <option value="">Unassigned</option>
              <option value="Nurse Sarah Kim">Nurse Sarah Kim</option>
              <option value="Nurse Maria Lopez">Nurse Maria Lopez</option>
              <option value="Aide James Obi">Aide James Obi</option>
              <option value="Aide David Nguyen">Aide David Nguyen</option>
              <option value="Tech Support">Tech Support</option>
              <option value="You">Myself</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Initial Notes</label>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what happened, initial response, or context…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/20 resize-none" />
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
          <button disabled={!valid} onClick={() => { onSave({ type, resident, room, status: "open", assignedTo: assignedTo || "Unassigned", notes }); setSubmitted(true); }}
            className="flex-1 rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4f6b32] disabled:opacity-40 disabled:cursor-not-allowed transition">
            Log Incident
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function IncidentsPage() {
  const [incidents, setIncidents]       = useState<Incident[]>(initialIncidents);
  const [statusFilter, setStatusFilter] = useState<"all" | IncidentStatus>("all");
  const [currentPage, setCurrentPage]   = useState(1);
  const [notesIncident, setNotes]       = useState<Incident | null>(null);
  const [showNew, setShowNew]           = useState(false);

  const filtered   = statusFilter === "all" ? incidents : incidents.filter((i) => i.status === statusFilter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const ghosts     = PAGE_SIZE - paginated.length;

  const handleFilterChange = (val: "all" | IncidentStatus) => { setStatusFilter(val); setCurrentPage(1); };

  const acknowledge = (id: string) =>
    setIncidents((prev) => prev.map((inc) => inc.id === id && inc.status === "open" ? { ...inc, status: "in_progress" as IncidentStatus, assignedTo: "You" } : inc));

  const resolve = (id: string) =>
    setIncidents((prev) => prev.map((inc) => inc.id === id ? { ...inc, status: "resolved" as IncidentStatus } : inc));

  const saveNote = (id: string, note: string) =>
    setIncidents((prev) => prev.map((inc) => inc.id === id ? { ...inc, notes: inc.notes ? `${inc.notes}\n${note}` : note } : inc));

  const addIncident = (data: Omit<Incident, "id" | "time">) => {
    const nextId = `INC-${1037 - incidents.length}`;
    setIncidents((prev) => [{ ...data, id: nextId, time: "just now" }, ...prev]);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Incident Management</h1>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              {(["all", "open", "in_progress", "resolved"] as const).map((f) => (
                <button key={f} onClick={() => handleFilterChange(f)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                    statusFilter === f ? "bg-[#233E7D] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  {f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4f6b32] transition">
              <Plus className="h-4 w-4" /> New Incident
            </button>
          </div>
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

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-1">ID</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Resident</div>
            <div className="col-span-1">Room</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Assigned To</div>
            <div className="col-span-1">Time</div>
            <div className="col-span-2">Actions</div>
          </div>

          {paginated.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">No incidents matching this filter.</div>
          ) : (
            <>
              {paginated.map((inc, idx) => {
                const st = statusConfig[inc.status];
                return (
                  <div key={inc.id} className={`${ROW_CLS} border-gray-100 hover:bg-gray-50 transition-colors`}>
                    <div className="lg:col-span-1 text-xs font-medium text-gray-400">{(currentPage - 1) * PAGE_SIZE + idx + 1}</div>
                    <div className="lg:col-span-1 text-xs font-mono text-gray-500">{inc.id}</div>
                    <div className="lg:col-span-2 text-sm font-medium text-gray-900">{inc.type}</div>
                    <div className="lg:col-span-2 text-sm text-gray-700">{inc.resident}</div>
                    <div className="lg:col-span-1 text-sm text-gray-600">{inc.room}</div>
                    <div className="lg:col-span-1">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${st.bg} ${st.text}`}>{st.label}</span>
                    </div>
                    <div className="lg:col-span-1 text-sm text-gray-600 truncate">{inc.assignedTo}</div>
                    <div className="lg:col-span-1 text-xs text-gray-500">{inc.time}</div>
                    <div className="lg:col-span-2 flex gap-2">
                      {inc.status === "open" && (
                        <button onClick={() => acknowledge(inc.id)} className="rounded-lg bg-[#233E7D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1c3164] transition">Take On</button>
                      )}
                      {inc.status === "in_progress" && (
                        <button onClick={() => resolve(inc.id)} className="rounded-lg bg-[#5C7F39] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#4f6b32] transition">Resolve</button>
                      )}
                      <button onClick={() => setNotes(inc)}
                        className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition">
                        Notes {inc.notes && <span className="ml-0.5 text-amber-500">●</span>}
                      </button>
                    </div>
                  </div>
                );
              })}
              {Array.from({ length: ghosts }).map((_, i) => (
                <div key={`ghost-${i}`} aria-hidden="true" className={`${ROW_CLS} border-transparent opacity-0 pointer-events-none select-none`}>
                  <div className="lg:col-span-12">&nbsp;</div>
                </div>
              ))}
            </>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
        </div>
      </div>

      {notesIncident && <NotesModal incident={notesIncident} onSave={saveNote} onClose={() => setNotes(null)} />}
      {showNew && <NewIncidentModal onSave={addIncident} onClose={() => setShowNew(false)} />}
    </div>
  );
}

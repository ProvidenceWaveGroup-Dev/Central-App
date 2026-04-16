"use client";

import { useState } from "react";
import { Bell, X, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Pagination } from "@/components/pagination";

type Severity = "critical" | "warning" | "info";
type AlertStatus = "new" | "acknowledged" | "resolved";

interface Alert {
  id: number;
  severity: Severity;
  type: string;
  resident: string;
  room: string;
  time: string;
  status: AlertStatus;
}

const initialAlerts: Alert[] = [
  { id: 1,  severity: "critical", type: "Fall Detected",        resident: "Margaret Collins", room: "204", time: "2 min ago",   status: "new"          },
  { id: 2,  severity: "critical", type: "High Blood Pressure",  resident: "Thomas Wright",    room: "306", time: "1 min ago",   status: "new"          },
  { id: 3,  severity: "critical", type: "High Blood Pressure",  resident: "Margaret Collins", room: "204", time: "5 min ago",   status: "new"          },
  { id: 4,  severity: "warning",  type: "Elevated BP",          resident: "Robert Chen",      room: "118", time: "7 min ago",   status: "new"          },
  { id: 5,  severity: "warning",  type: "Vitals Out of Range",  resident: "Robert Chen",      room: "118", time: "8 min ago",   status: "new"          },
  { id: 6,  severity: "warning",  type: "Inactivity (45 min)",  resident: "Dorothy Palmer",   room: "310", time: "15 min ago",  status: "new"          },
  { id: 7,  severity: "info",     type: "Device Offline",       resident: "James Wilson",     room: "205", time: "22 min ago",  status: "acknowledged" },
  { id: 8,  severity: "critical", type: "Emergency Button",     resident: "Frank Martinez",   room: "401", time: "30 min ago",  status: "acknowledged" },
  { id: 9,  severity: "warning",  type: "Missed Check-in",      resident: "William Davis",    room: "302", time: "35 min ago",  status: "acknowledged" },
  { id: 10, severity: "info",     type: "Low Battery",          resident: "Helen Torres",     room: "112", time: "45 min ago",  status: "resolved"     },
  { id: 11, severity: "warning",  type: "Temp Spike",           resident: "William Davis",    room: "302", time: "1 hr ago",    status: "resolved"     },
  { id: 12, severity: "warning",  type: "Missed Medication",    resident: "Susan Park",       room: "220", time: "1.5 hr ago",  status: "resolved"     },
  { id: 13, severity: "info",     type: "Door Left Open",       resident: "Charles Lee",      room: "408", time: "1.5 hr ago",  status: "resolved"     },
  { id: 14, severity: "warning",  type: "Inactivity (60 min)",  resident: "Linda Brown",      room: "115", time: "2 hr ago",    status: "resolved"     },
  { id: 15, severity: "critical", type: "Fall Detected",        resident: "Patricia Garcia",  room: "212", time: "2.5 hr ago",  status: "resolved"     },
  { id: 16, severity: "info",     type: "Low Battery",          resident: "James Wilson",     room: "105", time: "3 hr ago",    status: "resolved"     },
  { id: 17, severity: "warning",  type: "Wandering",            resident: "Dorothy Palmer",   room: "310", time: "3.5 hr ago",  status: "resolved"     },
  { id: 18, severity: "info",     type: "Device Reconnected",   resident: "Susan Park",       room: "220", time: "4 hr ago",    status: "resolved"     },
];

const PAGE_SIZE = 6;

const sevColors: Record<Severity, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  warning:  "bg-amber-100 text-amber-700 border-amber-200",
  info:     "bg-blue-100 text-blue-700 border-blue-200",
};
const sevIcon: Record<Severity, React.ElementType> = {
  critical: AlertTriangle,
  warning:  AlertTriangle,
  info:     Clock,
};

const statusColors: Record<AlertStatus, string> = {
  new:          "bg-red-50 text-red-600",
  acknowledged: "bg-amber-50 text-amber-600",
  resolved:     "bg-green-50 text-green-600",
};

const isBpAlert = (type: string) =>
  type === "High Blood Pressure" || type === "Elevated BP";

const filters = ["all", "critical", "warning", "info"] as const;
const ROW_CLS = "grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center px-5 py-4 border-b";

// ── Details Modal ─────────────────────────────────────────────────────────────
function AlertDetailsModal({
  alert,
  onClose,
  onAcknowledge,
  onResolve,
}: {
  alert: Alert;
  onClose: () => void;
  onAcknowledge: (id: number) => void;
  onResolve: (id: number) => void;
}) {
  const [note, setNote] = useState("");
  const Icon = sevIcon[alert.severity];

  const severityBg: Record<Severity, string> = {
    critical: "bg-red-50 border-red-200",
    warning:  "bg-amber-50 border-amber-200",
    info:     "bg-blue-50 border-blue-200",
  };
  const iconColor: Record<Severity, string> = {
    critical: "text-red-600",
    warning:  "text-amber-600",
    info:     "text-blue-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-serif text-lg font-semibold text-gray-900">Alert Details</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-gray-100 transition">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Severity banner */}
          <div className={`flex items-center gap-3 rounded-xl border p-3 ${severityBg[alert.severity]}`}>
            <Icon className={`h-5 w-5 flex-shrink-0 ${iconColor[alert.severity]}`} />
            <div>
              <p className={`text-sm font-semibold capitalize ${iconColor[alert.severity]}`}>{alert.severity} Alert</p>
              <p className="text-sm text-gray-700 font-medium">{alert.type}</p>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Resident",  value: alert.resident },
              { label: "Room",      value: `Room ${alert.room}` },
              { label: "Triggered", value: alert.time },
              { label: "Status",    value: alert.status, capitalize: true },
            ].map((row) => (
              <div key={row.label} className="rounded-lg bg-gray-50 px-3 py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{row.label}</p>
                <p className={`font-medium text-gray-800 ${row.capitalize ? "capitalize" : ""}`}>{row.value}</p>
              </div>
            ))}
          </div>

          {/* Resolution note */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Resolution Note
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe action taken or observations…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#233E7D] focus:outline-none focus:ring-2 focus:ring-[#233E7D]/20 resize-none"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
            Close
          </button>
          {alert.status === "new" && (
            <button
              onClick={() => { onAcknowledge(alert.id); onClose(); }}
              className="flex-1 rounded-lg bg-[#233E7D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c3164] transition"
            >
              Acknowledge
            </button>
          )}
          {alert.status !== "resolved" && (
            <button
              onClick={() => { onResolve(alert.id); onClose(); }}
              className="flex-1 rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4f6b32] transition"
            >
              Mark Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AlertsPage() {
  const [alerts, setAlerts]             = useState<Alert[]>(initialAlerts);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [currentPage, setCurrentPage]   = useState(1);
  const [detailAlert, setDetailAlert]   = useState<Alert | null>(null);

  const filtered   = activeFilter === "all" ? alerts : alerts.filter((a) => a.severity === activeFilter);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const ghosts     = PAGE_SIZE - paginated.length;

  const newCount   = alerts.filter((a) => a.status === "new").length;
  const bpNewCount = alerts.filter((a) => a.status === "new" && isBpAlert(a.type)).length;

  const handleFilterChange = (f: string) => { setActiveFilter(f); setCurrentPage(1); };

  const acknowledge = (id: number) =>
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "acknowledged" as AlertStatus } : a));

  const resolve = (id: number) =>
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "resolved" as AlertStatus } : a));

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Bell className="h-6 w-6 text-gray-400" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Live Alert Queue</h1>
            {newCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-2 text-xs font-bold text-white">{newCount}</span>
            )}
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button key={f} onClick={() => handleFilterChange(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  activeFilter === f ? "bg-[#233E7D] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* BP banner */}
        {bpNewCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-sm">{bpNewCount}</span>
            <div>
              <p className="text-sm font-semibold text-red-700">High Blood Pressure Alert{bpNewCount > 1 ? "s" : ""}</p>
              <p className="text-xs text-red-600">{bpNewCount === 1 ? "1 resident has" : `${bpNewCount} residents have`} reported elevated blood pressure.</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-1">#</div>
            <div className="col-span-1">Severity</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Resident</div>
            <div className="col-span-1">Room</div>
            <div className="col-span-1">Time</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Actions</div>
          </div>

          {paginated.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">No alerts matching this filter.</div>
          ) : (
            <>
              {paginated.map((alert, idx) => (
                <div key={alert.id}
                  className={`${ROW_CLS} border-gray-100 hover:bg-gray-50 transition-colors ${
                    isBpAlert(alert.type) && alert.status === "new"
                      ? "border-l-4 border-l-red-400 bg-red-50/40 hover:bg-red-50/60" : ""
                  }`}
                >
                  <div className="md:col-span-1 text-xs font-medium text-gray-400">{(currentPage - 1) * PAGE_SIZE + idx + 1}</div>
                  <div className="md:col-span-1">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold capitalize ${sevColors[alert.severity]}`}>{alert.severity}</span>
                  </div>
                  <div className="md:col-span-2 text-sm font-medium text-gray-900">{alert.type}</div>
                  <div className="md:col-span-2 text-sm text-gray-700">{alert.resident}</div>
                  <div className="md:col-span-1 text-sm text-gray-600">{alert.room}</div>
                  <div className="md:col-span-1 text-xs text-gray-500">{alert.time}</div>
                  <div className="md:col-span-2">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[alert.status]}`}>{alert.status}</span>
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    {alert.status === "new" && (
                      <button onClick={() => acknowledge(alert.id)}
                        className="rounded-lg bg-[#233E7D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1c3164] transition">
                        Acknowledge
                      </button>
                    )}
                    <button onClick={() => setDetailAlert(alert)}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition">
                      Details
                    </button>
                  </div>
                </div>
              ))}
              {Array.from({ length: ghosts }).map((_, i) => (
                <div key={`ghost-${i}`} aria-hidden="true" className={`${ROW_CLS} border-transparent opacity-0 pointer-events-none select-none`}>
                  <div className="md:col-span-12">&nbsp;</div>
                </div>
              ))}
            </>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* Details Modal */}
      {detailAlert && (
        <AlertDetailsModal
          alert={detailAlert}
          onClose={() => setDetailAlert(null)}
          onAcknowledge={acknowledge}
          onResolve={resolve}
        />
      )}
    </div>
  );
}

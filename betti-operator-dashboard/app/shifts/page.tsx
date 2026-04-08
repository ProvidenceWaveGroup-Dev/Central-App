"use client";

import { useState } from "react";
import { Clock, Coffee, CheckCircle2 } from "lucide-react";
import { Pagination } from "@/components/pagination";

const currentShift = {
  name: "Day Shift",
  time: "7:00 AM – 3:00 PM",
  supervisor: "Nurse Maria Lopez",
};

const allStaff = [
  {
    name: "Sarah Kim",
    role: "Registered Nurse",
    status: "on_floor",
    residents: [
      { name: "Margaret Collins", room: "204" },
      { name: "Robert Chen",      room: "118" },
      { name: "William Davis",    room: "302" },
      { name: "Thomas Wright",    room: "306" },
    ],
  },
  {
    name: "James Obi",
    role: "Care Aide",
    status: "on_floor",
    residents: [
      { name: "Helen Torres", room: "220" },
      { name: "Susan Park",   room: "220" },
      { name: "Linda Brown",  room: "115" },
    ],
  },
  {
    name: "Maria Lopez",
    role: "Shift Supervisor",
    status: "on_break",
    residents: [
      { name: "Frank Martinez",  room: "401" },
      { name: "Charles Lee",     room: "408" },
      { name: "Patricia Garcia", room: "212" },
    ],
  },
  {
    name: "David Nguyen",
    role: "Care Aide",
    status: "on_floor",
    residents: [
      { name: "Dorothy Palmer", room: "310" },
      { name: "James Wilson",   room: "105" },
      { name: "Betty Johnson",  room: "109" },
    ],
  },
  {
    name: "Angela Reyes",
    role: "Registered Nurse",
    status: "on_floor",
    residents: [
      { name: "George Harris",   room: "201" },
      { name: "Nancy White",     room: "317" },
      { name: "Richard Taylor",  room: "322" },
    ],
  },
  {
    name: "Michael Torres",
    role: "Care Aide",
    status: "on_floor",
    residents: [
      { name: "Barbara Moore",   room: "415" },
      { name: "Joseph Anderson", room: "121" },
    ],
  },
  {
    name: "Lisa Patel",
    role: "Registered Nurse",
    status: "off_floor",
    residents: [
      { name: "Margaret Collins", room: "204" },
      { name: "Thomas Wright",    room: "306" },
    ],
  },
  {
    name: "Kevin Brown",
    role: "Care Aide",
    status: "on_floor",
    residents: [
      { name: "Dorothy Palmer", room: "310" },
      { name: "Charles Lee",    room: "408" },
    ],
  },
];

const shiftTimeline = [
  { time: "7:00 AM",  event: "Shift started — Handoff from night team", icon: Clock         },
  { time: "7:15 AM",  event: "Morning rounds initiated",                 icon: CheckCircle2  },
  { time: "8:30 AM",  event: "Medication round completed (Wing A)",       icon: CheckCircle2  },
  { time: "9:45 AM",  event: "Incident INC-1052: Fall in Room 204",       icon: Clock         },
  { time: "10:00 AM", event: "Maria Lopez — 15 min break",               icon: Coffee        },
  { time: "10:30 AM", event: "Vitals check round initiated",              icon: CheckCircle2  },
  { time: "11:00 AM", event: "Medication round completed (Wing B)",       icon: CheckCircle2  },
  { time: "11:30 AM", event: "INC-1051 Vitals Alert — Robert Chen",       icon: Clock         },
  { time: "12:00 PM", event: "Lunch service commenced",                   icon: CheckCircle2  },
  { time: "12:45 PM", event: "INC-1050 resolved — Dorothy Palmer",        icon: CheckCircle2  },
];

const STAFF_PAGE_SIZE    = 4;
const TIMELINE_PAGE_SIZE = 6;

const statusConfig: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  on_floor:  { label: "On Floor",  bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  on_break:  { label: "On Break",  bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  off_floor: { label: "Off Floor", bg: "bg-gray-100",  text: "text-gray-600",  dot: "bg-gray-400"  },
};

export default function ShiftsPage() {
  const [staffPage,    setStaffPage]    = useState(1);
  const [timelinePage, setTimelinePage] = useState(1);

  const staffTotalPages    = Math.ceil(allStaff.length / STAFF_PAGE_SIZE);
  const timelineTotalPages = Math.ceil(shiftTimeline.length / TIMELINE_PAGE_SIZE);

  const paginatedStaff    = allStaff.slice((staffPage - 1) * STAFF_PAGE_SIZE, staffPage * STAFF_PAGE_SIZE);
  const paginatedTimeline = shiftTimeline.slice((timelinePage - 1) * TIMELINE_PAGE_SIZE, timelinePage * TIMELINE_PAGE_SIZE);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Shift View</h1>
          <span className="inline-flex items-center gap-2 rounded-full bg-green-100 border border-green-200 px-4 py-1.5 text-sm font-semibold text-green-700 self-start">
            <Clock className="h-4 w-4" />
            {currentShift.name}: {currentShift.time}
          </span>
        </div>

        {/* Staff Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              On-Shift Staff
              <span className="ml-2 font-normal normal-case text-gray-400">({allStaff.length} total)</span>
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {paginatedStaff.map((s) => {
              const st = statusConfig[s.status];
              return (
                <div key={s.name} className="rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#233E7D] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {s.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.role}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${st.bg} ${st.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      Assigned Residents ({s.residents.length})
                    </p>
                    <div className="space-y-1.5">
                      {s.residents.map((r) => (
                        <div key={r.name} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{r.name}</span>
                          <span className="text-xs text-gray-400">Room {r.room}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Staff pagination */}
          {staffTotalPages > 1 && (
            <div className="rounded-xl border border-gray-200 bg-white">
              <Pagination
                currentPage={staffPage}
                totalPages={staffTotalPages}
                totalItems={allStaff.length}
                pageSize={STAFF_PAGE_SIZE}
                onPageChange={setStaffPage}
              />
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Shift Timeline */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
            <div className="p-5 pb-0">
              <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">
                Shift Timeline
                <span className="ml-2 text-sm font-normal text-gray-400">({shiftTimeline.length} events)</span>
              </h2>
              <div className="space-y-4 pb-4">
                {paginatedTimeline.map((entry, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 h-7 w-7 rounded-full bg-gray-100 flex items-center justify-center">
                      <entry.icon className="h-3.5 w-3.5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-700">{entry.event}</p>
                      <p className="text-xs text-gray-400">{entry.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Pagination
              currentPage={timelinePage}
              totalPages={timelineTotalPages}
              totalItems={shiftTimeline.length}
              pageSize={TIMELINE_PAGE_SIZE}
              onPageChange={setTimelinePage}
            />
          </div>

          {/* Next Shift */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">Upcoming Shift</h2>
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-blue-800">Evening Shift</p>
                <span className="text-xs text-blue-600">3:00 PM – 11:00 PM</span>
              </div>
              <div className="space-y-2 text-sm text-blue-700">
                <p><span className="font-medium">Supervisor:</span> Nurse Angela Torres</p>
                <p><span className="font-medium">Staff count:</span> 4 (2 Nurses, 2 Aides)</p>
                <p><span className="font-medium">Handoff notes:</span> INC-1052 still in progress. Room 204 needs extra monitoring.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

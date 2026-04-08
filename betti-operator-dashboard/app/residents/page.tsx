"use client";

import { useState } from "react";
import { Search, Heart, Wind, AlertTriangle, MessageCircle, Activity } from "lucide-react";
import { Pagination } from "@/components/pagination";

interface Resident {
  name: string;
  room: string;
  age: number;
  status: "stable" | "attention" | "critical";
  lastCheck: string;
  hr: number;
  spo2: number;
  bp: string;
  bpHigh: boolean;
  fallCount: number;
  unreadMessages: number;
}

const residents: Resident[] = [
  { name: "Margaret Collins", room: "204", age: 82, status: "critical",   lastCheck: "2 min ago",  hr: 92, spo2: 94, bp: "158/96",  bpHigh: true,  fallCount: 4, unreadMessages: 2 },
  { name: "James Wilson",     room: "105", age: 78, status: "stable",     lastCheck: "12 min ago", hr: 74, spo2: 98, bp: "118/76",  bpHigh: false, fallCount: 0, unreadMessages: 0 },
  { name: "Robert Chen",      room: "118", age: 85, status: "attention",  lastCheck: "8 min ago",  hr: 88, spo2: 95, bp: "136/84",  bpHigh: true,  fallCount: 2, unreadMessages: 1 },
  { name: "Helen Torres",     room: "220", age: 71, status: "stable",     lastCheck: "5 min ago",  hr: 70, spo2: 97, bp: "122/78",  bpHigh: false, fallCount: 0, unreadMessages: 3 },
  { name: "Dorothy Palmer",   room: "310", age: 88, status: "attention",  lastCheck: "15 min ago", hr: 76, spo2: 96, bp: "130/82",  bpHigh: false, fallCount: 1, unreadMessages: 0 },
  { name: "Frank Martinez",   room: "401", age: 76, status: "stable",     lastCheck: "3 min ago",  hr: 68, spo2: 99, bp: "116/72",  bpHigh: false, fallCount: 0, unreadMessages: 0 },
  { name: "Susan Park",       room: "220", age: 80, status: "stable",     lastCheck: "10 min ago", hr: 72, spo2: 97, bp: "124/80",  bpHigh: false, fallCount: 1, unreadMessages: 1 },
  { name: "William Davis",    room: "302", age: 91, status: "attention",  lastCheck: "18 min ago", hr: 80, spo2: 95, bp: "142/90",  bpHigh: true,  fallCount: 3, unreadMessages: 0 },
  { name: "Linda Brown",      room: "115", age: 74, status: "stable",     lastCheck: "6 min ago",  hr: 66, spo2: 98, bp: "119/74",  bpHigh: false, fallCount: 0, unreadMessages: 2 },
  { name: "Charles Lee",      room: "408", age: 83, status: "stable",     lastCheck: "9 min ago",  hr: 71, spo2: 97, bp: "126/80",  bpHigh: false, fallCount: 0, unreadMessages: 0 },
  { name: "Patricia Garcia",  room: "212", age: 79, status: "stable",     lastCheck: "4 min ago",  hr: 69, spo2: 98, bp: "121/77",  bpHigh: false, fallCount: 2, unreadMessages: 0 },
  { name: "Thomas Wright",    room: "306", age: 86, status: "critical",   lastCheck: "1 min ago",  hr: 96, spo2: 93, bp: "172/104", bpHigh: true,  fallCount: 5, unreadMessages: 0 },
  { name: "Betty Johnson",    room: "109", age: 77, status: "stable",     lastCheck: "7 min ago",  hr: 73, spo2: 97, bp: "120/78",  bpHigh: false, fallCount: 0, unreadMessages: 1 },
  { name: "George Harris",    room: "201", age: 84, status: "attention",  lastCheck: "20 min ago", hr: 82, spo2: 95, bp: "138/86",  bpHigh: true,  fallCount: 1, unreadMessages: 0 },
  { name: "Nancy White",      room: "317", age: 73, status: "stable",     lastCheck: "11 min ago", hr: 68, spo2: 98, bp: "117/75",  bpHigh: false, fallCount: 0, unreadMessages: 0 },
  { name: "Richard Taylor",   room: "322", age: 89, status: "attention",  lastCheck: "14 min ago", hr: 85, spo2: 94, bp: "145/92",  bpHigh: true,  fallCount: 2, unreadMessages: 0 },
  { name: "Barbara Moore",    room: "415", age: 81, status: "stable",     lastCheck: "16 min ago", hr: 70, spo2: 97, bp: "123/79",  bpHigh: false, fallCount: 0, unreadMessages: 2 },
  { name: "Joseph Anderson",  room: "121", age: 75, status: "stable",     lastCheck: "22 min ago", hr: 67, spo2: 99, bp: "115/71",  bpHigh: false, fallCount: 0, unreadMessages: 0 },
];

const PAGE_SIZE = 6;

const statusConfig: Record<string, { bg: string; text: string; label: string; dot: string }> = {
  stable:    { bg: "bg-green-100", text: "text-green-700", label: "Stable",    dot: "bg-green-500" },
  attention: { bg: "bg-amber-100", text: "text-amber-700", label: "Attention", dot: "bg-amber-500" },
  critical:  { bg: "bg-red-100",   text: "text-red-700",   label: "Critical",  dot: "bg-red-500"   },
};

function fallBadge(count: number) {
  if (count === 0) return null;
  const isRepeat = count >= 2;
  return (
    <div className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
      isRepeat ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-200"
    }`}>
      <AlertTriangle className="h-3 w-3" />
      {count === 1 ? "1 prior fall" : `${count} falls — repeat faller`}
    </div>
  );
}

export default function ResidentsPage() {
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage]   = useState(1);

  const filtered   = residents.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.room.includes(search);
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const ghosts     = PAGE_SIZE - paginated.length;

  const handleFilterChange = (val: string) => { setStatusFilter(val); setCurrentPage(1); };
  const handleSearch = (val: string)       => { setSearch(val);       setCurrentPage(1); };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Resident Roster
            <span className="ml-3 text-base font-normal text-gray-400">({filtered.length} residents)</span>
          </h1>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30 w-56"
                placeholder="Search name or room..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <select
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="stable">Stable</option>
              <option value="attention">Attention</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Resident Grid — fixed min-height so ghost cards maintain page height */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginated.map((r, idx) => {
            const st = statusConfig[r.status];
            const sn = (currentPage - 1) * PAGE_SIZE + idx + 1;
            return (
              <div key={`${r.name}-${r.room}`} className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow">
                {/* S/N + status + messages */}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs font-medium text-gray-400">#{sn}</span>
                      <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                    </div>
                    <p className="text-xs text-gray-500">Room {r.room} · Age {r.age}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${st.bg} ${st.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                    {r.unreadMessages > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 border border-blue-200 px-2 py-0.5 text-xs font-semibold text-blue-700">
                        <MessageCircle className="h-3 w-3" />
                        {r.unreadMessages} new
                      </span>
                    )}
                  </div>
                </div>

                {/* Vitals */}
                <div className="grid grid-cols-3 gap-x-2 mb-2">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Heart className="h-3 w-3 text-red-400 flex-shrink-0" />
                    <span>{r.hr} bpm</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Wind className="h-3 w-3 text-blue-400 flex-shrink-0" />
                    <span>{r.spo2}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Activity className="h-3 w-3 flex-shrink-0 text-purple-400" />
                    <span className={r.bpHigh ? "font-semibold text-red-600" : "text-gray-600"}>{r.bp}</span>
                  </div>
                </div>

                {r.bpHigh && (
                  <div className="mb-2 flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-2 py-0.5 text-xs font-semibold text-red-700 w-fit">
                    <AlertTriangle className="h-3 w-3" />
                    High BP
                  </div>
                )}

                <p className="text-xs text-gray-400 mb-2">Last check-in: {r.lastCheck}</p>

                {r.fallCount > 0 && (
                  <div className="mb-3">{fallBadge(r.fallCount)}</div>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 rounded-lg bg-[#5C7F39] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#4f6b32] transition">
                    Log Care
                  </button>
                  <button className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">
                    Profile
                  </button>
                </div>
              </div>
            );
          })}

          {/* Ghost cards — invisible, maintain grid height */}
          {Array.from({ length: ghosts }).map((_, i) => (
            <div
              key={`ghost-${i}`}
              aria-hidden="true"
              className="rounded-xl border border-transparent p-4 opacity-0 pointer-events-none select-none"
            >
              {/* Mirror structure of real card to match height */}
              <div className="flex items-start justify-between mb-2">
                <div><div className="h-4 mb-0.5" /><div className="h-3" /></div>
                <div className="h-5 w-16" />
              </div>
              <div className="grid grid-cols-3 gap-x-2 mb-2"><div className="h-4" /><div className="h-4" /><div className="h-4" /></div>
              <div className="h-3 mb-2" />
              <div className="h-3 mb-2" />
              <div className="flex gap-2"><div className="flex-1 h-7" /><div className="flex-1 h-7" /></div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="rounded-xl border border-gray-200 bg-white">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

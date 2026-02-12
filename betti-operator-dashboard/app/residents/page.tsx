"use client";

import { useState } from "react";
import { Search, Heart, Wind } from "lucide-react";

interface Resident {
  name: string;
  room: string;
  age: number;
  status: "stable" | "attention" | "critical";
  lastCheck: string;
  hr: number;
  spo2: number;
}

const residents: Resident[] = [
  { name: "Margaret Collins", room: "204", age: 82, status: "critical", lastCheck: "2 min ago", hr: 92, spo2: 94 },
  { name: "James Wilson", room: "105", age: 78, status: "stable", lastCheck: "12 min ago", hr: 74, spo2: 98 },
  { name: "Robert Chen", room: "118", age: 85, status: "attention", lastCheck: "8 min ago", hr: 88, spo2: 95 },
  { name: "Helen Torres", room: "220", age: 71, status: "stable", lastCheck: "5 min ago", hr: 70, spo2: 97 },
  { name: "Dorothy Palmer", room: "310", age: 88, status: "attention", lastCheck: "15 min ago", hr: 76, spo2: 96 },
  { name: "Frank Martinez", room: "401", age: 76, status: "stable", lastCheck: "3 min ago", hr: 68, spo2: 99 },
  { name: "Susan Park", room: "220", age: 80, status: "stable", lastCheck: "10 min ago", hr: 72, spo2: 97 },
  { name: "William Davis", room: "302", age: 91, status: "attention", lastCheck: "18 min ago", hr: 80, spo2: 95 },
  { name: "Linda Brown", room: "115", age: 74, status: "stable", lastCheck: "6 min ago", hr: 66, spo2: 98 },
  { name: "Charles Lee", room: "408", age: 83, status: "stable", lastCheck: "9 min ago", hr: 71, spo2: 97 },
  { name: "Patricia Garcia", room: "212", age: 79, status: "stable", lastCheck: "4 min ago", hr: 69, spo2: 98 },
  { name: "Thomas Wright", room: "306", age: 86, status: "critical", lastCheck: "1 min ago", hr: 96, spo2: 93 },
];

const statusConfig: Record<string, { bg: string; text: string; label: string; dot: string }> = {
  stable: { bg: "bg-green-100", text: "text-green-700", label: "Stable", dot: "bg-green-500" },
  attention: { bg: "bg-amber-100", text: "text-amber-700", label: "Attention", dot: "bg-amber-500" },
  critical: { bg: "bg-red-100", text: "text-red-700", label: "Critical", dot: "bg-red-500" },
};

export default function ResidentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = residents.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.room.includes(search);
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Resident Roster</h1>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                className="rounded-lg border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30 w-56"
                placeholder="Search name or room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="stable">Stable</option>
              <option value="attention">Attention</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Resident Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((r) => {
            const st = statusConfig[r.status];
            return (
              <div key={`${r.name}-${r.room}`} className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-500">Room {r.room} · Age {r.age}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${st.bg} ${st.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Heart className="h-3.5 w-3.5 text-red-400" />
                    <span>{r.hr} bpm</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <Wind className="h-3.5 w-3.5 text-blue-400" />
                    <span>SpO₂ {r.spo2}%</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mb-3">Last check-in: {r.lastCheck}</p>

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
        </div>
      </div>
    </div>
  );
}

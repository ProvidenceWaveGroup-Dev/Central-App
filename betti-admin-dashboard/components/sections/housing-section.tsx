"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  Home,
  Search,
  Users,
  MapPin,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

type HousingStatus = "occupied" | "transitional" | "available" | "maintenance";

type HousingUnit = {
  id: number;
  unit: string;
  facility: string;
  resident: string | null;
  status: HousingStatus;
  moveIn: string | null;
  program: string;
  notes: string;
};

const units: HousingUnit[] = [
  { id: 1,  unit: "Unit 101", facility: "Sunrise Gardens",    resident: "Margaret Collins", status: "occupied",     moveIn: "2024-03-15", program: "Long-Term Care",         notes: "Stable placement" },
  { id: 2,  unit: "Unit 204", facility: "Sunrise Gardens",    resident: "Thomas Wright",    status: "occupied",     moveIn: "2024-01-08", program: "Long-Term Care",         notes: "Stable placement" },
  { id: 3,  unit: "Unit 310", facility: "Sunrise Gardens",    resident: "Dorothy Palmer",   status: "transitional", moveIn: "2025-11-20", program: "Transitional Housing",   notes: "Awaiting permanent placement" },
  { id: 4,  unit: "Unit 118", facility: "Harbor View",        resident: "Robert Chen",      status: "occupied",     moveIn: "2023-07-01", program: "Assisted Living",        notes: "Stable placement" },
  { id: 5,  unit: "Unit 205", facility: "Harbor View",        resident: null,               status: "available",    moveIn: null,         program: "",                       notes: "Ready for occupancy" },
  { id: 6,  unit: "Unit 302", facility: "Harbor View",        resident: "William Davis",    status: "transitional", moveIn: "2025-12-10", program: "Transitional Housing",   notes: "30-day placement" },
  { id: 7,  unit: "Unit 401", facility: "Cedar Ridge",        resident: "Frank Martinez",   status: "occupied",     moveIn: "2024-05-22", program: "Memory Care Support",    notes: "Stable placement" },
  { id: 8,  unit: "Unit 112", facility: "Cedar Ridge",        resident: "Helen Torres",     status: "occupied",     moveIn: "2023-09-14", program: "Long-Term Care",         notes: "Stable placement" },
  { id: 9,  unit: "Unit 220", facility: "Cedar Ridge",        resident: "Susan Park",       status: "occupied",     moveIn: "2024-08-03", program: "Assisted Living",        notes: "Stable placement" },
  { id: 10, unit: "Unit 408", facility: "Cedar Ridge",        resident: null,               status: "maintenance",  moveIn: null,         program: "",                       notes: "HVAC repair in progress" },
  { id: 11, unit: "Unit 115", facility: "Meadow Brook",       resident: "Linda Brown",      status: "occupied",     moveIn: "2023-11-30", program: "Long-Term Care",         notes: "Stable placement" },
  { id: 12, unit: "Unit 212", facility: "Meadow Brook",       resident: "Patricia Garcia",  status: "transitional", moveIn: "2026-01-05", program: "Transitional Housing",   notes: "Pending family review" },
  { id: 13, unit: "Unit 105", facility: "Meadow Brook",       resident: null,               status: "available",    moveIn: null,         program: "",                       notes: "Ready for occupancy" },
];

const statusColors: Record<HousingStatus, string> = {
  occupied:     "bg-green-100 text-green-700 border-green-200",
  transitional: "bg-amber-100 text-amber-700 border-amber-200",
  available:    "bg-blue-100 text-blue-700 border-blue-200",
  maintenance:  "bg-gray-100 text-gray-600 border-gray-200",
};

const ITEMS_PER_PAGE = 6;

export function HousingSection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<HousingStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = units.filter((u) => {
    const matchesSearch =
      u.unit.toLowerCase().includes(search.toLowerCase()) ||
      u.facility.toLowerCase().includes(search.toLowerCase()) ||
      (u.resident?.toLowerCase() ?? "").includes(search.toLowerCase()) ||
      u.program.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const counts = {
    occupied:     units.filter((u) => u.status === "occupied").length,
    transitional: units.filter((u) => u.status === "transitional").length,
    available:    units.filter((u) => u.status === "available").length,
    maintenance:  units.filter((u) => u.status === "maintenance").length,
  };

  const handleFilterChange = (f: HousingStatus | "all") => {
    setStatusFilter(f);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Home className="h-6 w-6 text-muted-foreground" />
        <div>
          <h2 className="text-2xl font-bold">Housing &amp; Transitional Living</h2>
          <p className="text-sm text-muted-foreground">Unit inventory, occupancy status, and transitional placement tracking across all facilities.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Occupied",     count: counts.occupied,     color: "text-green-600",  bg: "bg-green-50" },
          { label: "Transitional", count: counts.transitional, color: "text-amber-600",  bg: "bg-amber-50" },
          { label: "Available",    count: counts.available,    color: "text-blue-600",   bg: "bg-blue-50" },
          { label: "Maintenance",  count: counts.maintenance,  color: "text-gray-600",   bg: "bg-gray-50" },
        ].map((s) => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-4 pb-3">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by unit, facility, resident, or program…"
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "occupied", "transitional", "available", "maintenance"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={statusFilter === f ? "default" : "outline"}
              onClick={() => handleFilterChange(f)}
              className="capitalize text-xs"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="h-4 w-4" />
            Unit Registry
            <Badge variant="secondary" className="ml-auto">{filtered.length} units</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-2">Unit</div>
            <div className="col-span-3">Facility</div>
            <div className="col-span-3">Resident</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Program</div>
          </div>

          {paginated.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No units match the current filter.</div>
          ) : (
            paginated.map((u) => (
              <div key={u.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 border-b last:border-0 items-center hover:bg-muted/30 transition-colors">
                <div className="md:col-span-2 font-medium text-sm">{u.unit}</div>
                <div className="md:col-span-3 text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />{u.facility}
                </div>
                <div className="md:col-span-3 text-sm flex items-center gap-1">
                  {u.resident ? (
                    <><Users className="h-3 w-3 flex-shrink-0 text-muted-foreground" />{u.resident}</>
                  ) : (
                    <span className="text-muted-foreground italic">—</span>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Badge variant="outline" className={`text-xs capitalize ${statusColors[u.status]}`}>{u.status}</Badge>
                </div>
                <div className="md:col-span-2 text-xs text-muted-foreground">{u.program || "—"}</div>
              </div>
            ))
          )}

          <PaginationControlled
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Transitional placements note */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="flex items-start gap-3 pt-4">
          <ArrowRight className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Transitional Placements</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {counts.transitional} unit{counts.transitional !== 1 ? "s are" : " is"} currently in transitional status. Coordinate with care coordinators to confirm permanent placement timelines.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

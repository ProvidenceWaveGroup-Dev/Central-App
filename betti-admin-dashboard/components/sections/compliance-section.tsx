"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  ClipboardCheck,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";

type ComplianceStatus = "compliant" | "due_soon" | "overdue" | "in_review";
type ComplianceCategory = "regulatory" | "safety" | "privacy" | "care_protocols" | "operational";

type ComplianceItem = {
  id: number;
  requirement: string;
  category: ComplianceCategory;
  facility: string;
  status: ComplianceStatus;
  lastReview: string;
  nextDue: string;
  owner: string;
};

const items: ComplianceItem[] = [
  { id: 1,  requirement: "State Licensing Renewal",             category: "regulatory",  facility: "All Facilities",   status: "compliant",  lastReview: "2025-12-01", nextDue: "2026-12-01", owner: "Admin Team" },
  { id: 2,  requirement: "HIPAA Privacy Training",              category: "privacy",     facility: "All Facilities",   status: "due_soon",   lastReview: "2025-04-10", nextDue: "2026-04-30", owner: "HR / Compliance" },
  { id: 3,  requirement: "Fire Safety Inspection",              category: "safety",      facility: "Sunrise Gardens",  status: "compliant",  lastReview: "2026-01-15", nextDue: "2026-07-15", owner: "Facilities" },
  { id: 4,  requirement: "Medication Administration Audit",     category: "care_protocols",    facility: "Harbor View",      status: "overdue",    lastReview: "2025-10-22", nextDue: "2026-01-22", owner: "Clinical Lead" },
  { id: 5,  requirement: "Fall Prevention Protocol Review",     category: "care_protocols",    facility: "Cedar Ridge",      status: "in_review",  lastReview: "2026-03-01", nextDue: "2026-06-01", owner: "Clinical Lead" },
  { id: 6,  requirement: "Emergency Evacuation Drill",          category: "safety",      facility: "Meadow Brook",     status: "due_soon",   lastReview: "2025-10-05", nextDue: "2026-04-20", owner: "Facilities" },
  { id: 7,  requirement: "Staff Background Check Policy",       category: "regulatory",  facility: "All Facilities",   status: "compliant",  lastReview: "2026-02-01", nextDue: "2027-02-01", owner: "HR / Compliance" },
  { id: 8,  requirement: "Resident Rights Documentation",       category: "regulatory",  facility: "All Facilities",   status: "compliant",  lastReview: "2025-11-15", nextDue: "2026-11-15", owner: "Admin Team" },
  { id: 9,  requirement: "Device Data Security Assessment",     category: "privacy",     facility: "All Facilities",   status: "in_review",  lastReview: "2026-03-20", nextDue: "2026-09-20", owner: "IT / Security" },
  { id: 10, requirement: "Infection Control Procedure Review",  category: "care_protocols",    facility: "Sunrise Gardens",  status: "overdue",    lastReview: "2025-09-30", nextDue: "2025-12-30", owner: "Clinical Lead" },
  { id: 11, requirement: "Dietary & Nutrition Standards Audit", category: "operational", facility: "Harbor View",      status: "compliant",  lastReview: "2026-01-10", nextDue: "2026-07-10", owner: "Operations" },
  { id: 12, requirement: "Incident Reporting Policy Review",    category: "operational", facility: "All Facilities",   status: "due_soon",   lastReview: "2025-06-15", nextDue: "2026-06-15", owner: "Admin Team" },
];

const statusConfig: Record<ComplianceStatus, { label: string; color: string; Icon: React.ElementType }> = {
  compliant:  { label: "Compliant",  color: "bg-green-100 text-green-700 border-green-200",  Icon: CheckCircle2 },
  due_soon:   { label: "Due Soon",   color: "bg-amber-100 text-amber-700 border-amber-200",  Icon: Clock },
  overdue:    { label: "Overdue",    color: "bg-red-100 text-red-700 border-red-200",         Icon: AlertCircle },
  in_review:  { label: "In Review",  color: "bg-blue-100 text-blue-700 border-blue-200",     Icon: FileText },
};

const categoryColors: Record<ComplianceCategory, string> = {
  regulatory:  "bg-purple-100 text-purple-700",
  safety:      "bg-orange-100 text-orange-700",
  privacy:     "bg-teal-100 text-teal-700",
  care_protocols: "bg-sky-100 text-sky-700",
  operational: "bg-gray-100 text-gray-700",
};

const ITEMS_PER_PAGE = 6;

export function ComplianceSection() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplianceStatus | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.requirement.toLowerCase().includes(search.toLowerCase()) ||
      item.facility.toLowerCase().includes(search.toLowerCase()) ||
      item.owner.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const counts = {
    compliant: items.filter((i) => i.status === "compliant").length,
    due_soon:  items.filter((i) => i.status === "due_soon").length,
    overdue:   items.filter((i) => i.status === "overdue").length,
    in_review: items.filter((i) => i.status === "in_review").length,
  };

  const complianceRate = Math.round((counts.compliant / items.length) * 100);

  const handleFilterChange = (f: ComplianceStatus | "all") => {
    setStatusFilter(f);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-muted-foreground" />
        <div>
          <h2 className="text-2xl font-bold">Compliance</h2>
          <p className="text-sm text-muted-foreground">Regulatory, safety, care-related, and operational compliance tracking across all facilities.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Compliant",  count: counts.compliant, color: "text-green-600", bg: "bg-green-50" },
          { label: "Due Soon",   count: counts.due_soon,  color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Overdue",    count: counts.overdue,   color: "text-red-600",   bg: "bg-red-50" },
          { label: "In Review",  count: counts.in_review, color: "text-blue-600",  bg: "bg-blue-50" },
        ].map((s) => (
          <Card key={s.label} className={`${s.bg} border-0`}>
            <CardContent className="pt-4 pb-3">
              <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Rate */}
      <Card>
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">Overall Compliance Rate</p>
            <span className={`text-sm font-bold ${complianceRate >= 80 ? "text-green-600" : complianceRate >= 60 ? "text-amber-600" : "text-red-600"}`}>
              {complianceRate}%
            </span>
          </div>
          <Progress value={complianceRate} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1.5">{counts.compliant} of {items.length} requirements currently compliant</p>
        </CardContent>
      </Card>

      {/* Filters & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by requirement, facility, category, or owner…"
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "compliant", "due_soon", "overdue", "in_review"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={statusFilter === f ? "default" : "outline"}
              onClick={() => handleFilterChange(f)}
              className="capitalize text-xs"
            >
              {f === "due_soon" ? "Due Soon" : f === "in_review" ? "In Review" : f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4" />
            Requirements Register
            <Badge variant="secondary" className="ml-auto">{filtered.length} items</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-4">Requirement</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Facility</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2">Next Due</div>
            <div className="col-span-1">Owner</div>
          </div>

          {paginated.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No items match the current filter.</div>
          ) : (
            paginated.map((item) => {
              const { color, Icon } = statusConfig[item.status];
              return (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 border-b last:border-0 items-center hover:bg-muted/30 transition-colors">
                  <div className="md:col-span-4 text-sm font-medium">{item.requirement}</div>
                  <div className="md:col-span-2">
                    <Badge variant="outline" className={`text-xs capitalize ${categoryColors[item.category]}`}>{item.category}</Badge>
                  </div>
                  <div className="md:col-span-2 text-xs text-muted-foreground">{item.facility}</div>
                  <div className="md:col-span-1">
                    <Badge variant="outline" className={`text-xs ${color}`}>
                      <Icon className="h-3 w-3 mr-1" />
                      {statusConfig[item.status].label}
                    </Badge>
                  </div>
                  <div className="md:col-span-2 text-xs text-muted-foreground">{item.nextDue}</div>
                  <div className="md:col-span-1 text-xs text-muted-foreground truncate">{item.owner}</div>
                </div>
              );
            })
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

      {/* Overdue alert */}
      {counts.overdue > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-start gap-3 pt-4">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">Action Required</p>
              <p className="text-xs text-red-700 mt-0.5">
                {counts.overdue} requirement{counts.overdue !== 1 ? "s are" : " is"} overdue. Review with the responsible owners and update documentation promptly.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

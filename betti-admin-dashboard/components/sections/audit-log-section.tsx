"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  ScrollText,
  Search,
  User,
  Shield,
  Settings,
  Bell,
  FileText,
  Database,
} from "lucide-react";

type AuditAction = "login" | "logout" | "view" | "create" | "update" | "delete" | "export" | "config_change";
type AuditCategory = "auth" | "resident" | "device" | "alert" | "system" | "report" | "compliance";

type AuditEntry = {
  id: number;
  timestamp: string;
  user: string;
  role: string;
  action: AuditAction;
  category: AuditCategory;
  resource: string;
  detail: string;
  ip: string;
};

const entries: AuditEntry[] = [
  { id: 1,  timestamp: "2026-04-16 14:32:05", user: "admin@betti.io",       role: "Admin",    action: "update",        category: "resident",    resource: "Resident #204",         detail: "Updated care plan notes",                         ip: "192.168.1.10" },
  { id: 2,  timestamp: "2026-04-16 14:28:41", user: "j.smith@betti.io",     role: "Operator", action: "view",          category: "alert",       resource: "Alert #1042",           detail: "Viewed fall detection alert details",             ip: "192.168.1.22" },
  { id: 3,  timestamp: "2026-04-16 14:21:17", user: "admin@betti.io",       role: "Admin",    action: "export",        category: "report",      resource: "Monthly Incidents",     detail: "Exported April 2026 incident summary (PDF)",     ip: "192.168.1.10" },
  { id: 4,  timestamp: "2026-04-16 13:55:02", user: "t.nguyen@betti.io",    role: "Operator", action: "create",        category: "alert",       resource: "Alert #1043",           detail: "Created manual alert — inactivity observation",  ip: "192.168.1.31" },
  { id: 5,  timestamp: "2026-04-16 13:40:50", user: "admin@betti.io",       role: "Admin",    action: "config_change", category: "system",      resource: "Alert Rules",           detail: "Updated inactivity threshold from 30 to 45 min", ip: "192.168.1.10" },
  { id: 6,  timestamp: "2026-04-16 13:15:33", user: "c.martin@betti.io",    role: "Caregiver", action: "update",       category: "resident",    resource: "Resident #118",         detail: "Logged hydration intake entry",                  ip: "192.168.2.05" },
  { id: 7,  timestamp: "2026-04-16 12:58:11", user: "j.smith@betti.io",     role: "Operator", action: "login",         category: "auth",        resource: "Operator Dashboard",    detail: "Successful authentication",                      ip: "192.168.1.22" },
  { id: 8,  timestamp: "2026-04-16 12:30:44", user: "admin@betti.io",       role: "Admin",    action: "delete",        category: "compliance",  resource: "Draft Report #88",      detail: "Deleted outdated draft compliance document",     ip: "192.168.1.10" },
  { id: 9,  timestamp: "2026-04-16 11:47:29", user: "r.patel@betti.io",     role: "Admin",    action: "create",        category: "resident",    resource: "Resident #226",         detail: "Created new resident record",                    ip: "192.168.1.12" },
  { id: 10, timestamp: "2026-04-16 11:22:08", user: "t.nguyen@betti.io",    role: "Operator", action: "update",        category: "alert",       resource: "Alert #1038",           detail: "Marked alert as resolved",                       ip: "192.168.1.31" },
  { id: 11, timestamp: "2026-04-16 10:55:16", user: "c.martin@betti.io",    role: "Caregiver", action: "view",         category: "resident",    resource: "Resident #310",         detail: "Accessed resident daily summary",                ip: "192.168.2.05" },
  { id: 12, timestamp: "2026-04-16 10:31:00", user: "admin@betti.io",       role: "Admin",    action: "config_change", category: "system",      resource: "Device Settings",       detail: "Updated device polling interval to 60s",         ip: "192.168.1.10" },
  { id: 13, timestamp: "2026-04-16 09:58:42", user: "r.patel@betti.io",     role: "Admin",    action: "export",        category: "compliance",  resource: "Audit Log Q1 2026",     detail: "Exported Q1 audit log for external review",      ip: "192.168.1.12" },
  { id: 14, timestamp: "2026-04-16 09:22:05", user: "j.smith@betti.io",     role: "Operator", action: "logout",        category: "auth",        resource: "Operator Dashboard",    detail: "Session ended",                                  ip: "192.168.1.22" },
  { id: 15, timestamp: "2026-04-16 08:45:19", user: "admin@betti.io",       role: "Admin",    action: "login",         category: "auth",        resource: "Admin Dashboard",       detail: "Successful authentication",                      ip: "192.168.1.10" },
  { id: 16, timestamp: "2026-04-15 17:30:01", user: "t.nguyen@betti.io",    role: "Operator", action: "update",        category: "device",      resource: "Device SN-0042",        detail: "Marked device as offline — pending replacement", ip: "192.168.1.31" },
  { id: 17, timestamp: "2026-04-15 16:11:48", user: "r.patel@betti.io",     role: "Admin",    action: "create",        category: "compliance",  resource: "Compliance Item #13",   detail: "Added incident reporting policy review item",    ip: "192.168.1.12" },
  { id: 18, timestamp: "2026-04-15 15:05:33", user: "c.martin@betti.io",    role: "Caregiver", action: "create",       category: "alert",       resource: "Alert #1039",           detail: "Raised manual welfare check flag",               ip: "192.168.2.05" },
];

const actionColors: Record<AuditAction, string> = {
  login:         "bg-green-100 text-green-700",
  logout:        "bg-gray-100 text-gray-600",
  view:          "bg-blue-100 text-blue-700",
  create:        "bg-teal-100 text-teal-700",
  update:        "bg-amber-100 text-amber-700",
  delete:        "bg-red-100 text-red-700",
  export:        "bg-purple-100 text-purple-700",
  config_change: "bg-orange-100 text-orange-700",
};

const categoryIcons: Record<AuditCategory, React.ElementType> = {
  auth:       Shield,
  resident:   User,
  device:     Database,
  alert:      Bell,
  system:     Settings,
  report:     FileText,
  compliance: ScrollText,
};

const ITEMS_PER_PAGE = 8;

export function AuditLogSection() {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<AuditAction | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = entries.filter((e) => {
    const matchesSearch =
      e.user.toLowerCase().includes(search.toLowerCase()) ||
      e.resource.toLowerCase().includes(search.toLowerCase()) ||
      e.detail.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || e.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleFilterChange = (f: AuditAction | "all") => {
    setActionFilter(f);
    setCurrentPage(1);
  };

  const actionLabels: Record<AuditAction, string> = {
    login:         "Login",
    logout:        "Logout",
    view:          "View",
    create:        "Create",
    update:        "Update",
    delete:        "Delete",
    export:        "Export",
    config_change: "Config",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <ScrollText className="h-6 w-6 text-muted-foreground" />
        <div>
          <h2 className="text-2xl font-bold">Audit Log</h2>
          <p className="text-sm text-muted-foreground">Immutable record of all user actions, system events, and configuration changes across the platform.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, resource, detail, or role…"
            className="pl-9"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant={actionFilter === "all" ? "default" : "outline"}
            onClick={() => handleFilterChange("all")}
            className="text-xs"
          >
            All
          </Button>
          {(Object.keys(actionLabels) as AuditAction[]).map((a) => (
            <Button
              key={a}
              size="sm"
              variant={actionFilter === a ? "default" : "outline"}
              onClick={() => handleFilterChange(a)}
              className="text-xs"
            >
              {actionLabels[a]}
            </Button>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ScrollText className="h-4 w-4" />
            Event Log
            <Badge variant="secondary" className="ml-auto">{filtered.length} entries</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-2">Timestamp</div>
            <div className="col-span-2">User</div>
            <div className="col-span-1">Action</div>
            <div className="col-span-1">Category</div>
            <div className="col-span-2">Resource</div>
            <div className="col-span-4">Detail</div>
          </div>

          {paginated.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No log entries match the current filter.</div>
          ) : (
            paginated.map((e) => {
              const CategoryIcon = categoryIcons[e.category];
              return (
                <div key={e.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 border-b last:border-0 items-start hover:bg-muted/30 transition-colors">
                  <div className="md:col-span-2 text-xs font-mono text-muted-foreground">{e.timestamp}</div>
                  <div className="md:col-span-2 text-xs">
                    <p className="font-medium text-foreground">{e.user}</p>
                    <p className="text-muted-foreground">{e.role}</p>
                  </div>
                  <div className="md:col-span-1">
                    <Badge variant="outline" className={`text-xs capitalize ${actionColors[e.action]}`}>
                      {e.action === "config_change" ? "Config" : e.action}
                    </Badge>
                  </div>
                  <div className="md:col-span-1">
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground capitalize">
                      <CategoryIcon className="h-3 w-3" />
                      {e.category}
                    </span>
                  </div>
                  <div className="md:col-span-2 text-xs font-medium">{e.resource}</div>
                  <div className="md:col-span-4 text-xs text-muted-foreground">{e.detail}</div>
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

      <p className="text-xs text-muted-foreground text-center">
        Audit entries are immutable. Showing platform-level activity log. For full historical export, use Reports &amp; Analytics.
      </p>
    </div>
  );
}

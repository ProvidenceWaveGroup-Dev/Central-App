"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  BarChart3,
  Download,
  Calendar,
  FileText,
  TrendingUp,
  Users,
  Activity,
  AlertTriangle,
  Search,
} from "lucide-react";

const reportTypes = [
  { id: 1, name: "Daily Activity Summary", description: "Patient activity and health metrics", lastGenerated: "Today 6:00 AM", frequency: "Daily" },
  { id: 2, name: "Weekly Incident Report", description: "All incidents and resolutions", lastGenerated: "Monday", frequency: "Weekly" },
  { id: 3, name: "Monthly Health Trends", description: "Health trend analysis for all patients", lastGenerated: "Jan 1, 2024", frequency: "Monthly" },
  { id: 4, name: "Caregiver Performance", description: "Response times and care quality metrics", lastGenerated: "Jan 1, 2024", frequency: "Monthly" },
  { id: 5, name: "Device Health Report", description: "Device status and maintenance needs", lastGenerated: "Yesterday", frequency: "Weekly" },
  { id: 6, name: "Compliance Audit", description: "HIPAA compliance and audit logs", lastGenerated: "Jan 1, 2024", frequency: "Monthly" },
];

const REPORTS_PER_PAGE = 5;

type FrequencyFilterType = "all" | "Daily" | "Weekly" | "Monthly";

export function ReportsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FrequencyFilterType>("all");

  // Filter reports
  const filteredReports = reportTypes.filter(report => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      report.name.toLowerCase().includes(query) ||
      report.description.toLowerCase().includes(query) ||
      report.frequency.toLowerCase().includes(query)
    );

    if (!matchesSearch) return false;

    if (activeFilter === "all") return true;
    return report.frequency === activeFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReports.length / REPORTS_PER_PAGE);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * REPORTS_PER_PAGE,
    currentPage * REPORTS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: FrequencyFilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const dailyReports = reportTypes.filter(r => r.frequency === "Daily");
  const weeklyReports = reportTypes.filter(r => r.frequency === "Weekly");
  const monthlyReports = reportTypes.filter(r => r.frequency === "Monthly");

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground">Generate and view system reports</p>
          </div>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Create Custom Report
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{reportTypes.length}</div>
                <div className="text-xs text-muted-foreground">All Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "Daily" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("Daily")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{dailyReports.length}</div>
                <div className="text-xs text-muted-foreground">Daily Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "Weekly" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("Weekly")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{weeklyReports.length}</div>
                <div className="text-xs text-muted-foreground">Weekly Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "Monthly" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("Monthly")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{monthlyReports.length}</div>
                <div className="text-xs text-muted-foreground">Monthly Reports</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        {/* Report Types */}
        <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Available Reports ({filteredReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-muted-foreground">{report.description}</div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Last: {report.lastGenerated}
                      </span>
                      <Badge variant="outline">{report.frequency}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">View</Button>
                  <Button size="sm" className="gap-1">
                    <Download className="h-3 w-3" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Fixed Pagination at Bottom */}
      <div className="flex-shrink-0 pt-4 border-t bg-background">
        <PaginationControlled
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredReports.length}
          itemsPerPage={REPORTS_PER_PAGE}
        />
      </div>
    </div>
  );
}

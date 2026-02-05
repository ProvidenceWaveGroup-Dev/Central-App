"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  PersonStanding,
  AlertOctagon,
  Clock,
  CheckCircle,
  Phone,
  MapPin,
  Activity,
  TrendingDown,
  Users,
  Shield,
  Search,
} from "lucide-react";

const fallIncidents = [
  {
    id: 1,
    patient: "Margaret Johnson",
    location: "Living Room",
    time: "2 min ago",
    status: "responding",
    severity: "high",
    responseTime: null,
    caregiver: "Sarah Williams",
    sensorType: "Motion + Impact",
  },
  {
    id: 2,
    patient: "Robert Smith",
    location: "Bathroom",
    time: "3 hours ago",
    status: "resolved",
    severity: "medium",
    responseTime: "4.2 min",
    caregiver: "John Davis",
    sensorType: "Wearable",
  },
  {
    id: 3,
    patient: "Helen Davis",
    location: "Bedroom",
    time: "Yesterday 8:30 PM",
    status: "resolved",
    severity: "low",
    responseTime: "2.8 min",
    caregiver: "Emily Brown",
    sensorType: "Motion",
  },
];

const ITEMS_PER_PAGE = 5;

type FilterType = "all" | "responding" | "resolved";

export function FallMonitoringSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Filter incidents based on search and filter
  const filteredIncidents = fallIncidents.filter(incident => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      incident.patient.toLowerCase().includes(query) ||
      incident.location.toLowerCase().includes(query) ||
      incident.status.toLowerCase().includes(query) ||
      incident.severity.toLowerCase().includes(query) ||
      incident.caregiver.toLowerCase().includes(query) ||
      incident.sensorType.toLowerCase().includes(query)
    );

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "responding":
        return incident.status === "responding";
      case "resolved":
        return incident.status === "resolved";
      default:
        return true;
    }
  });

  // Pagination
  const totalPages = Math.ceil(filteredIncidents.length / ITEMS_PER_PAGE);
  const paginatedIncidents = filteredIncidents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const activeIncidents = fallIncidents.filter(i => i.status === "responding");
  const resolvedIncidents = fallIncidents.filter(i => i.status === "resolved");

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fall Monitoring</h1>
            <p className="text-muted-foreground">
              Real-time fall detection and response tracking
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "responding" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("responding")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertOctagon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeIncidents.length}</div>
                <div className="text-xs text-muted-foreground">Active Fall Alert</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <PersonStanding className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{fallIncidents.length}</div>
                <div className="text-xs text-muted-foreground">Falls Today</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "resolved" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("resolved")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{resolvedIncidents.length}</div>
                <div className="text-xs text-muted-foreground">Resolved</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingDown className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">-15%</div>
                <div className="text-xs text-muted-foreground">vs Last Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">
        {/* Active Incidents */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PersonStanding className="h-5 w-5 text-primary" />
                Fall Incidents ({filteredIncidents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paginatedIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className={`p-4 rounded-lg border ${
                    incident.status === "responding"
                      ? "border-red-300 bg-red-50"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          incident.status === "responding"
                            ? "bg-red-100 animate-pulse"
                            : "bg-muted"
                        }`}
                      >
                        <PersonStanding
                          className={`h-5 w-5 ${
                            incident.status === "responding"
                              ? "text-red-600"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{incident.patient}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {incident.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          incident.status === "responding"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {incident.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {incident.time}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Severity:</span>
                      <Badge
                        variant="outline"
                        className={`ml-2 ${
                          incident.severity === "high"
                            ? "text-red-600 border-red-300"
                            : incident.severity === "medium"
                            ? "text-orange-600 border-orange-300"
                            : "text-green-600 border-green-300"
                        }`}
                      >
                        {incident.severity}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Response:</span>
                      <span className="ml-2 font-medium">
                        {incident.responseTime || "In progress..."}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sensor:</span>
                      <span className="ml-2">{incident.sensorType}</span>
                    </div>
                  </div>

                  {incident.status === "responding" && (
                    <div className="flex gap-2 mt-4">
                      <Button size="sm" variant="destructive" className="gap-1">
                        <Phone className="h-3 w-3" />
                        Contact EMS
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Mark Resolved
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <PaginationControlled
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredIncidents.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </CardContent>
          </Card>
        </div>

        {/* Monitoring Status */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Monitoring Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Patients Monitored</span>
                <span className="font-medium">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Sensors</span>
                <span className="font-medium text-green-600">312</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Offline Sensors</span>
                <span className="font-medium text-red-600">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Coverage Rate</span>
                <span className="font-medium">98.7%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Response Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Under 3 min</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>3-5 min</span>
                  <span className="font-medium">18%</span>
                </div>
                <Progress value={18} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2 text-sm">
                  <span>Over 5 min</span>
                  <span className="font-medium">4%</span>
                </div>
                <Progress value={4} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </div>
    </div>
  );
}

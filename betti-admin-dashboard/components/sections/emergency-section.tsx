"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Siren,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Users,
  Building2,
  Plus,
  Eye,
  Search,
} from "lucide-react";

// Schema-aligned: emergency_responders table
interface EmergencyResponder {
  responder_id: number;
  responder_type: "ems" | "fire" | "police" | "security";
  name: string;
  contact_number: string;
  coverage_area: string;
  avg_response_time: string;
  status: "available" | "dispatched" | "offline";
}

// Schema-aligned: routes, route_steps tables
interface EmergencyRoute {
  route_id: number;
  route_name: string;
  facility_id: number;
  facility_name: string;
  destination: string;
  total_steps: number;
  estimated_time: string;
  last_updated: string;
}

const emergencyResponders: EmergencyResponder[] = [
  {
    responder_id: 1,
    responder_type: "ems",
    name: "Delray EMS Unit 4",
    contact_number: "+1-561-555-0911",
    coverage_area: "Delray Beach, FL",
    avg_response_time: "6 min",
    status: "available"
  },
  {
    responder_id: 2,
    responder_type: "ems",
    name: "Palm Beach EMS Unit 7",
    contact_number: "+1-561-555-0912",
    coverage_area: "West Palm Beach, FL",
    avg_response_time: "8 min",
    status: "available"
  },
  {
    responder_id: 3,
    responder_type: "fire",
    name: "Delray Fire Station 2",
    contact_number: "+1-561-555-0922",
    coverage_area: "Delray Beach, FL",
    avg_response_time: "5 min",
    status: "available"
  },
  {
    responder_id: 4,
    responder_type: "police",
    name: "Delray Beach PD",
    contact_number: "+1-561-555-0933",
    coverage_area: "Delray Beach, FL",
    avg_response_time: "7 min",
    status: "dispatched"
  },
  {
    responder_id: 5,
    responder_type: "security",
    name: "Sunrise Security Team",
    contact_number: "+1-561-555-1234",
    coverage_area: "Sunrise Assisted Living",
    avg_response_time: "2 min",
    status: "available"
  },
  // Additional responders
  {
    responder_id: 6,
    responder_type: "ems",
    name: "Boca Raton EMS Unit 2",
    contact_number: "+1-561-555-0913",
    coverage_area: "Boca Raton, FL",
    avg_response_time: "7 min",
    status: "available"
  },
  {
    responder_id: 7,
    responder_type: "fire",
    name: "Boca Raton Fire Station 5",
    contact_number: "+1-561-555-0923",
    coverage_area: "Boca Raton, FL",
    avg_response_time: "6 min",
    status: "available"
  },
  {
    responder_id: 8,
    responder_type: "police",
    name: "Palm Beach County Sheriff",
    contact_number: "+1-561-555-0934",
    coverage_area: "Palm Beach County, FL",
    avg_response_time: "9 min",
    status: "available"
  },
  {
    responder_id: 9,
    responder_type: "ems",
    name: "Boynton Beach EMS Unit 3",
    contact_number: "+1-561-555-0914",
    coverage_area: "Boynton Beach, FL",
    avg_response_time: "8 min",
    status: "dispatched"
  },
  {
    responder_id: 10,
    responder_type: "security",
    name: "Golden Oaks Security",
    contact_number: "+1-561-555-1235",
    coverage_area: "Golden Oaks Senior Living",
    avg_response_time: "3 min",
    status: "available"
  },
  {
    responder_id: 11,
    responder_type: "fire",
    name: "Lantana Fire Station 1",
    contact_number: "+1-561-555-0924",
    coverage_area: "Lantana, FL",
    avg_response_time: "7 min",
    status: "offline"
  },
  {
    responder_id: 12,
    responder_type: "ems",
    name: "Lake Worth EMS Unit 6",
    contact_number: "+1-561-555-0915",
    coverage_area: "Lake Worth, FL",
    avg_response_time: "9 min",
    status: "available"
  },
  {
    responder_id: 13,
    responder_type: "police",
    name: "Boca Raton PD",
    contact_number: "+1-561-555-0935",
    coverage_area: "Boca Raton, FL",
    avg_response_time: "6 min",
    status: "available"
  },
  {
    responder_id: 14,
    responder_type: "security",
    name: "Palm Gardens Security",
    contact_number: "+1-561-555-1236",
    coverage_area: "Palm Gardens Facility",
    avg_response_time: "2 min",
    status: "dispatched"
  },
  {
    responder_id: 15,
    responder_type: "fire",
    name: "West Palm Fire Station 3",
    contact_number: "+1-561-555-0925",
    coverage_area: "West Palm Beach, FL",
    avg_response_time: "5 min",
    status: "available"
  },
];

const emergencyRoutes: EmergencyRoute[] = [
  {
    route_id: 1,
    route_name: "EMS Path – Room 214",
    facility_id: 12,
    facility_name: "Sunrise Assisted Living – Delray",
    destination: "Room 214 (Margaret Johnson)",
    total_steps: 8,
    estimated_time: "2 min",
    last_updated: "2026-01-15"
  },
  {
    route_id: 2,
    route_name: "EMS Path – Room 305",
    facility_id: 12,
    facility_name: "Sunrise Assisted Living – Delray",
    destination: "Room 305 (Helen Davis)",
    total_steps: 12,
    estimated_time: "3 min",
    last_updated: "2026-01-15"
  },
  {
    route_id: 3,
    route_name: "Fire Exit Route A",
    facility_id: 12,
    facility_name: "Sunrise Assisted Living – Delray",
    destination: "Main Parking Lot",
    total_steps: 6,
    estimated_time: "4 min",
    last_updated: "2026-01-10"
  },
  {
    route_id: 4,
    route_name: "EMS Path – Main Entrance",
    facility_id: 15,
    facility_name: "Golden Oaks Senior Living",
    destination: "Reception Area",
    total_steps: 4,
    estimated_time: "1 min",
    last_updated: "2026-01-20"
  },
  // Additional routes
  {
    route_id: 5,
    route_name: "EMS Path – Room 118",
    facility_id: 12,
    facility_name: "Sunrise Assisted Living – Delray",
    destination: "Room 118 (Robert Smith)",
    total_steps: 6,
    estimated_time: "2 min",
    last_updated: "2026-01-18"
  },
  {
    route_id: 6,
    route_name: "Fire Exit Route B",
    facility_id: 12,
    facility_name: "Sunrise Assisted Living – Delray",
    destination: "Side Parking Lot",
    total_steps: 5,
    estimated_time: "3 min",
    last_updated: "2026-01-10"
  },
  {
    route_id: 7,
    route_name: "EMS Path – Room 220",
    facility_id: 12,
    facility_name: "Sunrise Assisted Living – Delray",
    destination: "Room 220 (Charles Moore)",
    total_steps: 9,
    estimated_time: "2 min",
    last_updated: "2026-01-22"
  },
  {
    route_id: 8,
    route_name: "Wheelchair Evacuation Route",
    facility_id: 12,
    facility_name: "Sunrise Assisted Living – Delray",
    destination: "Emergency Assembly Area",
    total_steps: 10,
    estimated_time: "5 min",
    last_updated: "2026-01-12"
  },
  {
    route_id: 9,
    route_name: "EMS Path – Floor 3 Wing A",
    facility_id: 15,
    facility_name: "Golden Oaks Senior Living",
    destination: "Room 301-315 Corridor",
    total_steps: 7,
    estimated_time: "3 min",
    last_updated: "2026-01-25"
  },
  {
    route_id: 10,
    route_name: "Fire Exit Route C",
    facility_id: 15,
    facility_name: "Golden Oaks Senior Living",
    destination: "Rear Garden Exit",
    total_steps: 8,
    estimated_time: "4 min",
    last_updated: "2026-01-14"
  },
  {
    route_id: 11,
    route_name: "EMS Path – Memory Care Unit",
    facility_id: 12,
    facility_name: "Sunrise Assisted Living – Delray",
    destination: "Memory Care Wing (Secured)",
    total_steps: 11,
    estimated_time: "4 min",
    last_updated: "2026-01-28"
  },
  {
    route_id: 12,
    route_name: "Staff Emergency Route",
    facility_id: 15,
    facility_name: "Golden Oaks Senior Living",
    destination: "Staff Command Center",
    total_steps: 3,
    estimated_time: "1 min",
    last_updated: "2026-01-30"
  },
];

const responderTypeConfig: Record<EmergencyResponder["responder_type"], { label: string; color: string; bgColor: string }> = {
  ems: { label: "EMS", color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
  fire: { label: "Fire", color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
  police: { label: "Police", color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  security: { label: "Security", color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/30" },
};

const RESPONDERS_PER_PAGE = 5;
const ROUTES_PER_PAGE = 4;

type ResponderFilterType = "all" | "available" | "dispatched" | "routes";

export function EmergencySection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [responderPage, setResponderPage] = useState(1);
  const [routePage, setRoutePage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<ResponderFilterType>("all");
  const [addResponderOpen, setAddResponderOpen] = useState(false);
  const [newResponder, setNewResponder] = useState({
    name: "",
    responder_type: "",
    contact_number: "",
    coverage_area: "",
  });

  // Filter responders
  const filteredResponders = emergencyResponders.filter(responder => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      responder.name.toLowerCase().includes(query) ||
      responder.coverage_area.toLowerCase().includes(query) ||
      responder.responder_type.toLowerCase().includes(query) ||
      responder.status.toLowerCase().includes(query)
    );

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "available":
        return responder.status === "available";
      case "dispatched":
        return responder.status === "dispatched";
      default:
        return true;
    }
  });

  // Filter routes
  const filteredRoutes = emergencyRoutes.filter(route => {
    const query = searchQuery.toLowerCase();
    return (
      route.route_name.toLowerCase().includes(query) ||
      route.facility_name.toLowerCase().includes(query) ||
      route.destination.toLowerCase().includes(query)
    );
  });

  // Pagination for responders
  const totalResponderPages = Math.ceil(filteredResponders.length / RESPONDERS_PER_PAGE);
  const paginatedResponders = filteredResponders.slice(
    (responderPage - 1) * RESPONDERS_PER_PAGE,
    responderPage * RESPONDERS_PER_PAGE
  );

  // Pagination for routes
  const totalRoutePages = Math.ceil(filteredRoutes.length / ROUTES_PER_PAGE);
  const paginatedRoutes = filteredRoutes.slice(
    (routePage - 1) * ROUTES_PER_PAGE,
    routePage * ROUTES_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setResponderPage(1);
    setRoutePage(1);
  };

  const handleFilterChange = (filter: ResponderFilterType) => {
    setActiveFilter(filter);
    setResponderPage(1);
  };

  const availableResponders = emergencyResponders.filter(r => r.status === "available");
  const dispatchedResponders = emergencyResponders.filter(r => r.status === "dispatched");

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Emergency Response</h1>
            <p className="text-muted-foreground">Manage emergency responders and wayfinding routes</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={() => setAddResponderOpen(true)}>
              <Plus className="h-4 w-4" />
              Add Responder
            </Button>
            <Button className="gap-2">
              <Navigation className="h-4 w-4" />
              Create Route
            </Button>
          </div>
        </div>

        {/* Add Responder Dialog */}
        <Dialog open={addResponderOpen} onOpenChange={setAddResponderOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Emergency Responder</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="responder-name">Responder Name / Unit</Label>
                <Input
                  id="responder-name"
                  placeholder="e.g. Delray EMS Unit 5"
                  value={newResponder.name}
                  onChange={(e) => setNewResponder({ ...newResponder, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Responder Type</Label>
                <Select value={newResponder.responder_type} onValueChange={(v) => setNewResponder({ ...newResponder, responder_type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ems">EMS</SelectItem>
                    <SelectItem value="fire">Fire Service</SelectItem>
                    <SelectItem value="police">Police</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="responder-contact">Contact Number</Label>
                <Input
                  id="responder-contact"
                  placeholder="+1-561-555-0000"
                  value={newResponder.contact_number}
                  onChange={(e) => setNewResponder({ ...newResponder, contact_number: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="responder-coverage">Coverage Area</Label>
                <Input
                  id="responder-coverage"
                  placeholder="e.g. Palm Beach County"
                  value={newResponder.coverage_area}
                  onChange={(e) => setNewResponder({ ...newResponder, coverage_area: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddResponderOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setAddResponderOpen(false);
                  setNewResponder({ name: "", responder_type: "", contact_number: "", coverage_area: "" });
                }}
              >
                Add Responder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search responders, routes..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "available" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("available")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{availableResponders.length}</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "dispatched" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("dispatched")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Siren className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{dispatchedResponders.length}</div>
                <div className="text-xs text-muted-foreground">Dispatched</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "routes" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("routes")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Navigation className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{emergencyRoutes.length}</div>
                <div className="text-xs text-muted-foreground">Active Routes</div>
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
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{emergencyResponders.length}</div>
                <div className="text-xs text-muted-foreground">All Responders</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Side by Side Cards - No outer scroll */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Emergency Responders Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Siren className="h-5 w-5 text-primary" />
                Emergency Responders ({filteredResponders.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                {paginatedResponders.map((responder) => {
                  const config = responderTypeConfig[responder.responder_type];
                  return (
                    <div key={responder.responder_id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${config.bgColor}`}>
                            <Siren className={`h-4 w-4 ${config.color}`} />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{responder.name}</div>
                            <div className="text-xs text-muted-foreground">{config.label}</div>
                          </div>
                        </div>
                        <Badge
                          variant={responder.status === "available" ? "default" : responder.status === "dispatched" ? "destructive" : "secondary"}
                        >
                          {responder.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {responder.contact_number}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {responder.coverage_area}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          Avg response: {responder.avg_response_time}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-3 gap-1">
                        <Phone className="h-3 w-3" />
                        Contact
                      </Button>
                    </div>
                  );
                })}
              </div>
              <div className="pt-3 border-t mt-3">
                <PaginationControlled
                  currentPage={responderPage}
                  totalPages={totalResponderPages}
                  onPageChange={setResponderPage}
                  totalItems={filteredResponders.length}
                  itemsPerPage={RESPONDERS_PER_PAGE}
                />
              </div>
            </CardContent>
          </Card>

          {/* Wayfinding Routes Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-primary" />
                Wayfinding Routes ({filteredRoutes.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                {paginatedRoutes.map((route) => (
                  <div key={route.route_id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-sm">{route.route_name}</div>
                        <div className="text-xs text-muted-foreground">{route.facility_name}</div>
                      </div>
                      <Badge variant="outline">{route.total_steps} steps</Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        To: {route.destination}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Est. time: {route.estimated_time}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Eye className="h-3 w-3" />
                        View Route
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Navigation className="h-3 w-3" />
                        Navigate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t mt-3">
                <PaginationControlled
                  currentPage={routePage}
                  totalPages={totalRoutePages}
                  onPageChange={setRoutePage}
                  totalItems={filteredRoutes.length}
                  itemsPerPage={ROUTES_PER_PAGE}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

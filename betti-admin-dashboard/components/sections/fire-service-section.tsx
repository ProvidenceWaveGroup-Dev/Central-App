"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Flame,
  Search,
  Plus,
  Phone,
  MapPin,
  Users,
  Clock,
  Eye,
  Edit,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

// Schema-aligned: fire_service_units table
interface FireServiceUnit {
  unit_id: number;
  station_name: string;
  station_number: string;
  chief_name: string;
  phone: string;
  emergency_phone: string;
  address: string;
  coverage_area: string;
  status: "active" | "inactive" | "maintenance";
  // Operational data
  total_personnel: number;
  vehicles: number;
  avg_response_time: string;
  assigned_facilities: number;
  last_inspection: string;
}

const fireServiceUnits: FireServiceUnit[] = [
  {
    unit_id: 1,
    station_name: "Delray Beach Fire Station 2",
    station_number: "FS-002",
    chief_name: "Captain James Rodriguez",
    phone: "+1-561-555-0911",
    emergency_phone: "911",
    address: "1050 SW 2nd Ave, Delray Beach, FL",
    coverage_area: "Central Delray Beach, Atlantic Ave corridor",
    status: "active",
    total_personnel: 24,
    vehicles: 4,
    avg_response_time: "4 min",
    assigned_facilities: 2,
    last_inspection: "2026-01-15"
  },
  {
    unit_id: 2,
    station_name: "Boca Raton Fire Rescue Station 5",
    station_number: "FS-005",
    chief_name: "Captain Maria Santos",
    phone: "+1-561-555-0922",
    emergency_phone: "911",
    address: "6500 N Federal Hwy, Boca Raton, FL",
    coverage_area: "North Boca Raton, Palm Beach border",
    status: "active",
    total_personnel: 28,
    vehicles: 5,
    avg_response_time: "5 min",
    assigned_facilities: 3,
    last_inspection: "2026-01-10"
  },
  {
    unit_id: 3,
    station_name: "West Palm Beach Fire Station 7",
    station_number: "FS-007",
    chief_name: "Captain Robert Thompson",
    phone: "+1-561-555-0933",
    emergency_phone: "911",
    address: "2200 Okeechobee Blvd, West Palm Beach, FL",
    coverage_area: "Downtown West Palm Beach, CityPlace",
    status: "active",
    total_personnel: 32,
    vehicles: 6,
    avg_response_time: "3 min",
    assigned_facilities: 4,
    last_inspection: "2025-12-20"
  },
  {
    unit_id: 4,
    station_name: "Fort Lauderdale Fire Rescue 12",
    station_number: "FS-012",
    chief_name: "Captain Linda Chen",
    phone: "+1-954-555-0944",
    emergency_phone: "911",
    address: "1500 E Sunrise Blvd, Fort Lauderdale, FL",
    coverage_area: "East Fort Lauderdale, Beach areas",
    status: "active",
    total_personnel: 26,
    vehicles: 5,
    avg_response_time: "4 min",
    assigned_facilities: 1,
    last_inspection: "2026-01-05"
  },
  {
    unit_id: 5,
    station_name: "Palm Beach Gardens Station 3",
    station_number: "FS-003",
    chief_name: "Captain William Davis",
    phone: "+1-561-555-0955",
    emergency_phone: "911",
    address: "4000 Burns Rd, Palm Beach Gardens, FL",
    coverage_area: "Palm Beach Gardens, Northern Palm Beach",
    status: "maintenance",
    total_personnel: 20,
    vehicles: 3,
    avg_response_time: "6 min",
    assigned_facilities: 0,
    last_inspection: "2025-11-30"
  },
];

const ITEMS_PER_PAGE = 4;

type FilterType = "all" | "active" | "with-personnel" | "with-vehicles";

export function FireServiceSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [addStationOpen, setAddStationOpen] = useState(false);
  const [newStation, setNewStation] = useState({
    station_name: "",
    station_number: "",
    chief_name: "",
    phone: "",
    address: "",
    coverage_area: "",
  });

  const activeUnits = fireServiceUnits.filter(u => u.status === "active");
  const totalPersonnel = activeUnits.reduce((sum, u) => sum + u.total_personnel, 0);
  const totalVehicles = activeUnits.reduce((sum, u) => sum + u.vehicles, 0);

  const filteredUnits = fireServiceUnits.filter((unit) => {
    const matchesSearch = unit.station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           unit.chief_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           unit.coverage_area.toLowerCase().includes(searchQuery.toLowerCase()) ||
           unit.station_number.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "active":
        return unit.status === "active";
      case "with-personnel":
        return unit.total_personnel > 0;
      case "with-vehicles":
        return unit.vehicles > 0;
      default:
        return true;
    }
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredUnits.length / ITEMS_PER_PAGE);
  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddStation = () => {
    setAddStationOpen(true);
  };

  const handleViewDetails = (unit: FireServiceUnit) => {
    toast.info(unit.station_name, {
      description: `${unit.station_number} | Chief: ${unit.chief_name} | Phone: ${unit.phone}`,
      duration: 5000,
    });
  };

  const handleEditUnit = (unit: FireServiceUnit) => {
    toast.info("Edit Station", {
      description: `Editing ${unit.station_name} - This would open an edit form.`,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fire Service Units</h1>
            <p className="text-muted-foreground">Manage fire service stations and coverage</p>
          </div>
          <Button className="gap-2" onClick={handleAddStation}>
            <Plus className="h-4 w-4" />
            Add Station
          </Button>
        </div>

        {/* Add Station Dialog */}
        <Dialog open={addStationOpen} onOpenChange={setAddStationOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Fire Station</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="station-name">Station Name</Label>
                <Input
                  id="station-name"
                  placeholder="e.g. Delray Beach Fire Station 3"
                  value={newStation.station_name}
                  onChange={(e) => setNewStation({ ...newStation, station_name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="station-number">Station Number</Label>
                <Input
                  id="station-number"
                  placeholder="e.g. FS-003"
                  value={newStation.station_number}
                  onChange={(e) => setNewStation({ ...newStation, station_number: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="station-chief">Chief / Captain Name</Label>
                <Input
                  id="station-chief"
                  placeholder="Full name"
                  value={newStation.chief_name}
                  onChange={(e) => setNewStation({ ...newStation, chief_name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="station-phone">Phone</Label>
                <Input
                  id="station-phone"
                  placeholder="+1 (561) 555-0000"
                  value={newStation.phone}
                  onChange={(e) => setNewStation({ ...newStation, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="station-address">Address</Label>
                <Input
                  id="station-address"
                  placeholder="Street address"
                  value={newStation.address}
                  onChange={(e) => setNewStation({ ...newStation, address: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="station-coverage">Coverage Area</Label>
                <Input
                  id="station-coverage"
                  placeholder="e.g. Palm Beach County"
                  value={newStation.coverage_area}
                  onChange={(e) => setNewStation({ ...newStation, coverage_area: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddStationOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setAddStationOpen(false);
                  setNewStation({ station_name: "", station_number: "", chief_name: "", phone: "", address: "", coverage_area: "" });
                }}
              >
                Add Station
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search fire stations..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Flame className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{fireServiceUnits.length}</div>
                <div className="text-xs text-muted-foreground">Total Stations</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "active" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("active")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Flame className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeUnits.length}</div>
                <div className="text-xs text-muted-foreground">Active Stations</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "with-personnel" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("with-personnel")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalPersonnel}</div>
                <div className="text-xs text-muted-foreground">Total Personnel</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "with-vehicles" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("with-vehicles")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Truck className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalVehicles}</div>
                <div className="text-xs text-muted-foreground">Fire Vehicles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Scrollable Units Grid */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {paginatedUnits.map((unit) => (
          <Card key={unit.unit_id} className={unit.status !== "active" ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <Flame className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{unit.station_name}</h3>
                    <div className="text-sm text-muted-foreground">{unit.station_number} - {unit.chief_name}</div>
                  </div>
                </div>
                <Badge variant={unit.status === "active" ? "default" : unit.status === "maintenance" ? "secondary" : "outline"}>
                  {unit.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {unit.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {unit.coverage_area}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Avg Response: {unit.avg_response_time}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                <div className="p-2 bg-muted rounded-lg">
                  <div className="font-medium">{unit.total_personnel}</div>
                  <div className="text-xs text-muted-foreground">Personnel</div>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <div className="font-medium">{unit.vehicles}</div>
                  <div className="text-xs text-muted-foreground">Vehicles</div>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <div className="font-medium">{unit.assigned_facilities}</div>
                  <div className="text-xs text-muted-foreground">Facilities</div>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <div className="font-medium text-xs">{unit.last_inspection}</div>
                  <div className="text-xs text-muted-foreground">Inspected</div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleViewDetails(unit)}>
                  <Eye className="h-3 w-3" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEditUnit(unit)}>
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      {/* Fixed Pagination at Bottom */}
      <div className="flex-shrink-0 pt-4 border-t bg-background">
        <PaginationControlled
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredUnits.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  Building2,
  Plus,
  MapPin,
  Users,
  Activity,
  Settings,
  Search,
} from "lucide-react";

// Schema-aligned: facilities table
interface Facility {
  facility_id: number;
  name: string;
  address: string;
  facility_type: "assisted_living" | "hospital" | "senior_living" | "home_care";
  status: "active" | "inactive" | "pending";
  is_active: boolean;
  archived_at: string | null;
  // Computed from related tables
  patient_count: number;
  capacity: number;
  hub_count: number;
  staff_count: number;
}

const facilities: Facility[] = [
  {
    facility_id: 12,
    name: "Sunrise Assisted Living – Delray",
    address: "245 Atlantic Ave, Delray Beach, FL",
    facility_type: "assisted_living",
    status: "active",
    is_active: true,
    archived_at: null,
    patient_count: 45,
    capacity: 50,
    hub_count: 48,
    staff_count: 22
  },
  {
    facility_id: 15,
    name: "Golden Oaks Senior Living",
    address: "890 Oak Street, Boca Raton, FL",
    facility_type: "senior_living",
    status: "active",
    is_active: true,
    archived_at: null,
    patient_count: 38,
    capacity: 40,
    hub_count: 42,
    staff_count: 18
  },
  {
    facility_id: 23,
    name: "Palm Beach Regional Hospital",
    address: "1200 Medical Center Dr, West Palm Beach, FL",
    facility_type: "hospital",
    status: "active",
    is_active: true,
    archived_at: null,
    patient_count: 128,
    capacity: 150,
    hub_count: 156,
    staff_count: 85
  },
  {
    facility_id: 31,
    name: "Coastal Home Care Services",
    address: "567 Coastal Blvd, Fort Lauderdale, FL",
    facility_type: "home_care",
    status: "active",
    is_active: true,
    archived_at: null,
    patient_count: 72,
    capacity: 100,
    hub_count: 72,
    staff_count: 15
  },
  {
    facility_id: 8,
    name: "Heritage Care Center",
    address: "432 Heritage Lane, Miami, FL",
    facility_type: "assisted_living",
    status: "inactive",
    is_active: false,
    archived_at: "2025-12-01",
    patient_count: 0,
    capacity: 35,
    hub_count: 0,
    staff_count: 0
  },
];

const facilityTypeLabels: Record<Facility["facility_type"], string> = {
  assisted_living: "Assisted Living",
  hospital: "Hospital",
  senior_living: "Senior Living",
  home_care: "Home Care"
};

const ITEMS_PER_PAGE = 4;

type FilterType = "all" | "active" | "with-patients" | "with-hubs" | "with-staff" | "high-occupancy";

export function FacilitiesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const activeFacilities = facilities.filter(f => f.is_active);
  const totalPatients = activeFacilities.reduce((sum, f) => sum + f.patient_count, 0);
  const totalCapacity = activeFacilities.reduce((sum, f) => sum + f.capacity, 0);
  const totalHubs = activeFacilities.reduce((sum, f) => sum + f.hub_count, 0);
  const totalStaff = activeFacilities.reduce((sum, f) => sum + f.staff_count, 0);

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           facility.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
           facilityTypeLabels[facility.facility_type].toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    const occupancy = facility.capacity > 0 ? (facility.patient_count / facility.capacity) * 100 : 0;

    switch (activeFilter) {
      case "active":
        return facility.is_active;
      case "with-patients":
        return facility.patient_count > 0;
      case "with-hubs":
        return facility.hub_count > 0;
      case "with-staff":
        return facility.staff_count > 0;
      case "high-occupancy":
        return occupancy >= 80;
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

  const totalPages = Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE);
  const paginatedFacilities = filteredFacilities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Facilities</h1>
            <p className="text-muted-foreground">Manage care facilities and locations</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Facility
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{facilities.length}</div>
                <div className="text-xs text-muted-foreground">All Facilities</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "active" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange(activeFilter === "active" ? "all" : "active")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeFacilities.length}</div>
                <div className="text-xs text-muted-foreground">Active Facilities</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "with-patients" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange(activeFilter === "with-patients" ? "all" : "with-patients")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{facilities.filter(f => f.patient_count > 0).length}</div>
                <div className="text-xs text-muted-foreground">With Patients</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "with-hubs" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange(activeFilter === "with-hubs" ? "all" : "with-hubs")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                <Activity className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{facilities.filter(f => f.hub_count > 0).length}</div>
                <div className="text-xs text-muted-foreground">With Hubs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "with-staff" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange(activeFilter === "with-staff" ? "all" : "with-staff")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{facilities.filter(f => f.staff_count > 0).length}</div>
                <div className="text-xs text-muted-foreground">With Staff</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "high-occupancy" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange(activeFilter === "high-occupancy" ? "all" : "high-occupancy")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{facilities.filter(f => f.capacity > 0 && (f.patient_count / f.capacity) * 100 >= 80).length}</div>
                <div className="text-xs text-muted-foreground">High Occupancy</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Scrollable Facilities Grid */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {paginatedFacilities.map((facility) => {
          const occupancy = facility.capacity > 0
            ? Math.round((facility.patient_count / facility.capacity) * 100)
            : 0;
          return (
          <Card key={facility.facility_id} className={!facility.is_active ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-medium text-lg">{facility.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {facility.address}
                  </div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {facilityTypeLabels[facility.facility_type]}
                  </Badge>
                </div>
                <Badge variant={facility.is_active ? "default" : "secondary"}>
                  {facility.status}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Patients</span>
                    <div className="font-medium">{facility.patient_count}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Capacity</span>
                    <div className="font-medium">{facility.capacity}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Hubs</span>
                    <div className="font-medium">{facility.hub_count}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Staff</span>
                    <div className="font-medium">{facility.staff_count}</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Occupancy</span>
                    <span className="font-medium">{occupancy}%</span>
                  </div>
                  <Progress value={occupancy} className={`h-2 ${occupancy > 90 ? "[&>div]:bg-orange-500" : ""}`} />
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4 gap-1" disabled={!facility.is_active}>
                <Settings className="h-3 w-3" />
                Manage Facility
              </Button>
            </CardContent>
          </Card>
          );
        })}
        </div>
      </div>

      {/* Fixed Pagination at Bottom */}
      <div className="flex-shrink-0 pt-4 border-t bg-background">
        <PaginationControlled
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredFacilities.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}

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
  Shield,
  Search,
  Plus,
  Phone,
  MapPin,
  Users,
  Clock,
  Building2,
  Eye,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

// Schema-aligned: security_agencies table
interface SecurityAgency {
  agency_id: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  coverage_area: string;
  status: "active" | "inactive" | "suspended";
  contract_start: string;
  contract_end: string;
  // Computed fields
  assigned_facilities: number;
  total_guards: number;
  avg_response_time: string;
}

const securityAgencies: SecurityAgency[] = [
  {
    agency_id: 1,
    name: "SecureGuard Protection Services",
    contact_person: "Michael Torres",
    phone: "+1-561-555-7890",
    email: "m.torres@secureguard.com",
    address: "1250 Security Blvd, Delray Beach, FL",
    coverage_area: "Palm Beach County",
    status: "active",
    contract_start: "2025-01-01",
    contract_end: "2026-12-31",
    assigned_facilities: 3,
    total_guards: 15,
    avg_response_time: "4 min"
  },
  {
    agency_id: 2,
    name: "Coastal Security Solutions",
    contact_person: "Patricia Anderson",
    phone: "+1-561-555-8901",
    email: "p.anderson@coastalsecurity.com",
    address: "890 Ocean Drive, Boca Raton, FL",
    coverage_area: "Boca Raton, Delray Beach",
    status: "active",
    contract_start: "2025-03-15",
    contract_end: "2027-03-14",
    assigned_facilities: 2,
    total_guards: 8,
    avg_response_time: "5 min"
  },
  {
    agency_id: 3,
    name: "Elite Protection Agency",
    contact_person: "Robert Chen",
    phone: "+1-561-555-9012",
    email: "r.chen@eliteprotection.com",
    address: "456 Palm Ave, West Palm Beach, FL",
    coverage_area: "West Palm Beach, Palm Beach Gardens",
    status: "active",
    contract_start: "2024-06-01",
    contract_end: "2026-05-31",
    assigned_facilities: 4,
    total_guards: 22,
    avg_response_time: "3 min"
  },
  {
    agency_id: 4,
    name: "Guardian Force Security",
    contact_person: "Linda Martinez",
    phone: "+1-954-555-1234",
    email: "l.martinez@guardianforce.com",
    address: "789 Federal Hwy, Fort Lauderdale, FL",
    coverage_area: "Broward County",
    status: "active",
    contract_start: "2025-02-01",
    contract_end: "2026-01-31",
    assigned_facilities: 1,
    total_guards: 6,
    avg_response_time: "6 min"
  },
  {
    agency_id: 5,
    name: "SunCoast Security Inc.",
    contact_person: "James Wilson",
    phone: "+1-561-555-2345",
    email: "j.wilson@suncoastsec.com",
    address: "321 Sunrise Blvd, Pompano Beach, FL",
    coverage_area: "Northern Broward, Southern Palm Beach",
    status: "inactive",
    contract_start: "2023-01-01",
    contract_end: "2024-12-31",
    assigned_facilities: 0,
    total_guards: 0,
    avg_response_time: "N/A"
  },
];

const ITEMS_PER_PAGE = 4;

type FilterType = "all" | "active" | "with-guards" | "with-facilities";

export function SecurityAgenciesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [addAgencyOpen, setAddAgencyOpen] = useState(false);
  const [newAgency, setNewAgency] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    coverage_area: "",
  });

  const activeAgencies = securityAgencies.filter(a => a.status === "active");
  const agenciesWithGuards = securityAgencies.filter(a => a.total_guards > 0);
  const totalGuards = activeAgencies.reduce((sum, a) => sum + a.total_guards, 0);
  const totalFacilitiesCovered = activeAgencies.reduce((sum, a) => sum + a.assigned_facilities, 0);

  const filteredAgencies = securityAgencies.filter((agency) => {
    const matchesSearch = agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           agency.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
           agency.coverage_area.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "active":
        return agency.status === "active";
      case "with-guards":
        return agency.total_guards > 0;
      case "with-facilities":
        return agency.assigned_facilities > 0;
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

  const totalPages = Math.ceil(filteredAgencies.length / ITEMS_PER_PAGE);
  const paginatedAgencies = filteredAgencies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddAgency = () => {
    setAddAgencyOpen(true);
  };

  const handleViewDetails = (agency: SecurityAgency) => {
    toast.info(agency.name, {
      description: `Contact: ${agency.contact_person} | Phone: ${agency.phone}`,
      duration: 5000,
    });
  };

  const handleEditAgency = (agency: SecurityAgency) => {
    toast.info("Edit Agency", {
      description: `Editing ${agency.name} - This would open an edit form.`,
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Security Agencies</h1>
            <p className="text-muted-foreground">Manage security service providers and contracts</p>
          </div>
          <Button className="gap-2" onClick={handleAddAgency}>
            <Plus className="h-4 w-4" />
            Add Agency
          </Button>
        </div>

        {/* Add Agency Dialog */}
        <Dialog open={addAgencyOpen} onOpenChange={setAddAgencyOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Security Agency</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label htmlFor="agency-name">Agency Name</Label>
                <Input
                  id="agency-name"
                  placeholder="e.g. SecureGuard Protection Services"
                  value={newAgency.name}
                  onChange={(e) => setNewAgency({ ...newAgency, name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="agency-contact">Contact Person</Label>
                <Input
                  id="agency-contact"
                  placeholder="Full name"
                  value={newAgency.contact_person}
                  onChange={(e) => setNewAgency({ ...newAgency, contact_person: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="agency-phone">Phone</Label>
                <Input
                  id="agency-phone"
                  placeholder="+1 (561) 555-0000"
                  value={newAgency.phone}
                  onChange={(e) => setNewAgency({ ...newAgency, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="agency-email">Email</Label>
                <Input
                  id="agency-email"
                  type="email"
                  placeholder="contact@agency.com"
                  value={newAgency.email}
                  onChange={(e) => setNewAgency({ ...newAgency, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="agency-address">Address</Label>
                <Input
                  id="agency-address"
                  placeholder="Street address"
                  value={newAgency.address}
                  onChange={(e) => setNewAgency({ ...newAgency, address: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="agency-coverage">Coverage Area</Label>
                <Input
                  id="agency-coverage"
                  placeholder="e.g. Palm Beach County"
                  value={newAgency.coverage_area}
                  onChange={(e) => setNewAgency({ ...newAgency, coverage_area: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddAgencyOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setAddAgencyOpen(false);
                  setNewAgency({ name: "", contact_person: "", phone: "", email: "", address: "", coverage_area: "" });
                }}
              >
                Add Agency
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agencies..."
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
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{securityAgencies.length}</div>
                <div className="text-xs text-muted-foreground">Total Agencies</div>
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
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeAgencies.length}</div>
                <div className="text-xs text-muted-foreground">Active Contracts</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "with-guards" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("with-guards")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalGuards}</div>
                <div className="text-xs text-muted-foreground">Total Guards</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "with-facilities" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("with-facilities")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Building2 className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalFacilitiesCovered}</div>
                <div className="text-xs text-muted-foreground">Facilities Covered</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Scrollable Agencies Grid */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
        {paginatedAgencies.map((agency) => (
          <Card key={agency.agency_id} className={agency.status !== "active" ? "opacity-60" : ""}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{agency.name}</h3>
                    <div className="text-sm text-muted-foreground">{agency.contact_person}</div>
                  </div>
                </div>
                <Badge variant={agency.status === "active" ? "default" : "secondary"}>
                  {agency.status}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {agency.phone}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {agency.coverage_area}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Avg Response: {agency.avg_response_time}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="p-2 bg-muted rounded-lg">
                  <div className="font-medium">{agency.total_guards}</div>
                  <div className="text-xs text-muted-foreground">Guards</div>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <div className="font-medium">{agency.assigned_facilities}</div>
                  <div className="text-xs text-muted-foreground">Facilities</div>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <div className="font-medium text-xs">{agency.contract_end}</div>
                  <div className="text-xs text-muted-foreground">Contract End</div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleViewDetails(agency)}>
                  <Eye className="h-3 w-3" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEditAgency(agency)}>
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
          totalItems={filteredAgencies.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}

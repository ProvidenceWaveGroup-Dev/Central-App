"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { PropertyDetailView } from "@/components/property-detail-view"
import { PropertyInspectView } from "@/components/property-inspect-view"

type Property = {
  id: number
  name: string
  address: string
  units: number
  occupancy: number
  status: string
  riskLevel: string
  lastInspection: string
}

type ViewMode = "list" | "view" | "inspect"

const allProperties: Property[] = [
  { id: 1,  name: "Riverside Apartments",   address: "123 Main St, Springfield",    units: 48, occupancy: 92, status: "Active",      riskLevel: "Low",    lastInspection: "2024-10-15" },
  { id: 2,  name: "Green Valley Housing",   address: "456 Oak Ave, Shelbyville",    units: 32, occupancy: 78, status: "Active",      riskLevel: "Medium", lastInspection: "2024-10-10" },
  { id: 3,  name: "Downtown Residences",    address: "789 Elm St, Capital City",    units: 64, occupancy: 85, status: "Active",      riskLevel: "Low",    lastInspection: "2024-10-20" },
  { id: 4,  name: "Northside Complex",      address: "321 Pine Rd, Shelbyville",    units: 40, occupancy: 65, status: "Maintenance", riskLevel: "High",   lastInspection: "2024-09-28" },
  { id: 5,  name: "Westside Towers",        address: "555 Maple Dr, Springfield",   units: 56, occupancy: 88, status: "Active",      riskLevel: "Low",    lastInspection: "2024-10-18" },
  { id: 6,  name: "Eastside Manor",         address: "777 Cedar Ln, Capital City",  units: 28, occupancy: 71, status: "Active",      riskLevel: "Medium", lastInspection: "2024-10-12" },
  { id: 7,  name: "Central Park Housing",   address: "999 Birch Ave, Shelbyville",  units: 52, occupancy: 82, status: "Active",      riskLevel: "Low",    lastInspection: "2024-10-19" },
  { id: 8,  name: "Sunset Gardens",         address: "111 Spruce St, Springfield",  units: 36, occupancy: 76, status: "Active",      riskLevel: "Medium", lastInspection: "2024-10-14" },
  { id: 9,  name: "Hillside Residences",    address: "222 Ash Rd, Capital City",    units: 44, occupancy: 89, status: "Active",      riskLevel: "Low",    lastInspection: "2024-10-21" },
  { id: 10, name: "Lakeside Apartments",    address: "333 Willow Way, Shelbyville", units: 48, occupancy: 79, status: "Active",      riskLevel: "Medium", lastInspection: "2024-10-11" },
  { id: 11, name: "Mountain View Complex",  address: "444 Oak Ridge, Springfield",  units: 60, occupancy: 91, status: "Active",      riskLevel: "Low",    lastInspection: "2024-10-22" },
  { id: 12, name: "Valley Heights",         address: "555 Pine Valley, Capital City",units: 32, occupancy: 68, status: "Active",     riskLevel: "High",   lastInspection: "2024-09-30" },
  { id: 13, name: "Riverside Park",         address: "666 River Rd, Shelbyville",   units: 40, occupancy: 84, status: "Active",      riskLevel: "Low",    lastInspection: "2024-10-17" },
  { id: 14, name: "Meadow Lane Housing",    address: "777 Meadow Ln, Springfield",  units: 28, occupancy: 75, status: "Active",      riskLevel: "Medium", lastInspection: "2024-10-13" },
  { id: 15, name: "Sunset Ridge",           address: "888 Ridge Rd, Capital City",  units: 52, occupancy: 87, status: "Active",      riskLevel: "Low",    lastInspection: "2024-10-20" },
  { id: 16, name: "Brookside Manor",        address: "999 Brook St, Shelbyville",   units: 36, occupancy: 72, status: "Active",      riskLevel: "Medium", lastInspection: "2024-10-09" },
  { id: 17, name: "Parkside Towers",        address: "1010 Park Ave, Springfield",  units: 48, occupancy: 90, status: "Active",      riskLevel: "Low",    lastInspection: "2024-10-23" },
  { id: 18, name: "Creekside Apartments",   address: "1111 Creek Rd, Capital City", units: 44, occupancy: 80, status: "Active",      riskLevel: "Medium", lastInspection: "2024-10-16" },
  { id: 19, name: "Woodland Heights",       address: "1212 Wood Ln, Shelbyville",   units: 56, occupancy: 86, status: "Active",      riskLevel: "Low",    lastInspection: "2024-10-19" },
  { id: 20, name: "Stonegate Complex",      address: "1313 Stone Way, Springfield", units: 32, occupancy: 73, status: "Active",      riskLevel: "Medium", lastInspection: "2024-10-08" },
  { id: 21, name: "Clearwater Residences",  address: "1414 Clear St, Capital City", units: 40, occupancy: 81, status: "Active",      riskLevel: "Low",    lastInspection: "2024-10-21" },
  { id: 22, name: "Sunnydale Housing",      address: "1515 Sunny Ave, Shelbyville", units: 28, occupancy: 69, status: "Active",      riskLevel: "High",   lastInspection: "2024-10-01" },
]

export function PropertiesPage() {
  const [properties, setProperties]             = useState<Property[]>(allProperties)
  const [searchTerm, setSearchTerm]             = useState("")
  const [currentPage, setCurrentPage]           = useState(1)
  const [viewMode, setViewMode]                 = useState<ViewMode>("list")
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  // Add Property modal
  const [addOpen, setAddOpen]           = useState(false)
  const [addConfirmed, setAddConfirmed] = useState(false)
  const [addedName, setAddedName]       = useState("")
  const [form, setForm] = useState({
    name: "", address: "", units: "", status: "Active",
    riskLevel: "Low", lastInspection: "",
  })
  const formValid = form.name.trim() && form.address.trim() && Number(form.units) > 0

  function handleAddSubmit() {
    if (!formValid) return
    const today = new Date().toISOString().slice(0, 10)
    const newProp: Property = {
      id: Date.now(),
      name: form.name.trim(),
      address: form.address.trim(),
      units: Number(form.units),
      occupancy: 0,
      status: form.status,
      riskLevel: form.riskLevel,
      lastInspection: form.lastInspection || today,
    }
    setProperties((prev) => [newProp, ...prev])
    setAddedName(form.name.trim())
    setAddConfirmed(true)
  }

  function closeAddModal() {
    setAddOpen(false)
    setAddConfirmed(false)
    setForm({ name: "", address: "", units: "", status: "Active", riskLevel: "Low", lastInspection: "" })
  }

  const itemsPerPage = 20

  const filteredProperties = useMemo(
    () =>
      properties.filter(
        (prop) =>
          prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prop.address.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, properties],
  )

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage)

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Active" ? "text-green-600" : "text-orange-600"
  }

  const handleAddProperty = () => setAddOpen(true)

  // Route to detail / inspect views
  if (viewMode === "view" && selectedProperty) {
    return (
      <PropertyDetailView
        property={selectedProperty}
        onBack={() => { setViewMode("list"); setSelectedProperty(null) }}
      />
    )
  }

  if (viewMode === "inspect" && selectedProperty) {
    return (
      <PropertyInspectView
        property={selectedProperty}
        onBack={() => { setViewMode("list"); setSelectedProperty(null) }}
      />
    )
  }

  return (
    <main className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Properties</h1>
        <p className="text-muted-foreground">All registered housing units and facilities</p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by property name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={handleAddProperty}>
          <Plus className="w-4 h-4" /> Add Property
        </Button>
      </div>

      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Property Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Address</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Units</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Occupancy</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Risk Level</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Last Inspection</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProperties.map((property) => (
              <tr key={property.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-foreground">{property.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{property.address}</td>
                <td className="px-6 py-4 text-sm text-foreground">{property.units}</td>
                <td className="px-6 py-4 text-sm text-foreground">{property.occupancy}%</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`font-medium ${getStatusColor(property.status)}`}>{property.status}</span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Badge className={getRiskColor(property.riskLevel)}>{property.riskLevel}</Badge>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{property.lastInspection}</td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={() => { setSelectedProperty(property); setViewMode("view") }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={() => { setSelectedProperty(property); setViewMode("inspect") }}
                  >
                    Inspect
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProperties.length)} of{" "}
          {filteredProperties.length} properties
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-primary hover:bg-primary/90" : ""}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Add Property Modal ──────────────────────────────────────── */}
      <Dialog open={addOpen} onOpenChange={(open) => { if (!open) closeAddModal() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              {addConfirmed ? "Property Added" : "Add New Property"}
            </DialogTitle>
          </DialogHeader>

          {addConfirmed ? (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mx-auto">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                <strong>{addedName}</strong> has been added to the properties list.
              </p>
              <DialogFooter>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={closeAddModal}>Done</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-3 py-1">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Property Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. Oak Street Residences"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. 500 Oak St, Springfield"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Number of Units <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  min={1}
                  placeholder="e.g. 40"
                  value={form.units}
                  onChange={(e) => setForm((f) => ({ ...f, units: e.target.value }))}
                  className="text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Active</option>
                    <option>Maintenance</option>
                    <option>Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Risk Level</label>
                  <select
                    value={form.riskLevel}
                    onChange={(e) => setForm((f) => ({ ...f, riskLevel: e.target.value }))}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Last Inspection Date <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <Input
                  type="date"
                  value={form.lastInspection}
                  onChange={(e) => setForm((f) => ({ ...f, lastInspection: e.target.value }))}
                  className="text-sm"
                />
              </div>

              <DialogFooter className="gap-2 pt-1">
                <Button variant="outline" className="flex-1" onClick={closeAddModal}>Cancel</Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleAddSubmit}
                  disabled={!formValid}
                >
                  Add Property
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Phone, Mail, MessageSquare, UserPlus, CheckCircle2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ResidentProfileView } from "@/components/resident-profile-view"
import type { Resident } from "@/lib/types"

// ── Resident roster (extends base type with optional health fields) ─
const allResidents: Resident[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 123-4567",
    property: "Riverside Apartments",
    unit: "12A",
    move_in_date: "2023-06-15",
    status: "Active",
    behavioral_health_flag: true,
    daily_activity_level: "moderate",
    health_event_flags: ["Mental health assessment 2023-08-01", "Fall risk screening"],
    created_at: "2023-06-15",
    updated_at: "2024-07-01",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 234-5678",
    property: "Green Valley Housing",
    unit: "5B",
    move_in_date: "2022-03-20",
    status: "Active",
    mobility_limitation: true,
    daily_activity_level: "low",
    disability_notes: "Uses mobility aid — accessible unit required.",
    health_event_flags: ["Mobility assessment 2023-09-15"],
    created_at: "2022-03-20",
    updated_at: "2024-07-01",
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "mchen@email.com",
    phone: "(555) 345-6789",
    property: "Downtown Residences",
    unit: "23C",
    move_in_date: "2024-01-10",
    status: "Active",
    daily_activity_level: "high",
    created_at: "2024-01-10",
    updated_at: "2024-07-01",
  },
  {
    id: 4,  name: "Emily Rodriguez",  email: "emily.r@email.com",  phone: "(555) 456-7890",
    property: "Riverside Apartments",  unit: "8F",  move_in_date: "2023-09-05",  status: "Active",
    created_at: "2023-09-05", updated_at: "2024-07-01",
  },
  {
    id: 5,  name: "David Williams",  email: "dwilliams@email.com",  phone: "(555) 567-8901",
    property: "Northside Complex",  unit: "15D",  move_in_date: "2022-11-12",  status: "Inactive",
    behavioral_health_flag: true,  daily_activity_level: "low",
    created_at: "2022-11-12", updated_at: "2024-07-01",
  },
  {
    id: 6,  name: "Jessica Martinez",  email: "jmartinez@email.com",  phone: "(555) 678-9012",
    property: "Westside Towers",  unit: "7G",  move_in_date: "2023-04-08",  status: "Active",
    created_at: "2023-04-08", updated_at: "2024-07-01",
  },
  {
    id: 7,  name: "Robert Taylor",  email: "rtaylor@email.com",  phone: "(555) 789-0123",
    property: "Eastside Manor",  unit: "19H",  move_in_date: "2022-08-22",  status: "Active",
    created_at: "2022-08-22", updated_at: "2024-07-01",
  },
  {
    id: 8,  name: "Amanda Brown",  email: "abrown@email.com",  phone: "(555) 890-1234",
    property: "Central Park Housing",  unit: "11I",  move_in_date: "2023-11-30",  status: "Active",
    created_at: "2023-11-30", updated_at: "2024-07-01",
  },
  {
    id: 9,  name: "Christopher Lee",  email: "clee@email.com",  phone: "(555) 901-2345",
    property: "Sunset Gardens",  unit: "6J",  move_in_date: "2024-02-14",  status: "Active",
    created_at: "2024-02-14", updated_at: "2024-07-01",
  },
  {
    id: 10,  name: "Michelle Davis",  email: "mdavis@email.com",  phone: "(555) 012-3456",
    property: "Hillside Residences",  unit: "25K",  move_in_date: "2023-07-19",  status: "Active",
    created_at: "2023-07-19", updated_at: "2024-07-01",
  },
  {
    id: 11,  name: "James Wilson",  email: "jwilson@email.com",  phone: "(555) 123-4568",
    property: "Lakeside Apartments",  unit: "14L",  move_in_date: "2022-05-10",  status: "Active",
    created_at: "2022-05-10", updated_at: "2024-07-01",
  },
  {
    id: 12,  name: "Lisa Anderson",  email: "landerson@email.com",  phone: "(555) 234-5679",
    property: "Mountain View Complex",  unit: "3M",  move_in_date: "2023-12-01",  status: "Active",
    created_at: "2023-12-01", updated_at: "2024-07-01",
  },
  {
    id: 13,  name: "Daniel Thomas",  email: "dthomas@email.com",  phone: "(555) 345-6790",
    property: "Valley Heights",  unit: "9N",  move_in_date: "2024-03-15",  status: "Active",
    created_at: "2024-03-15", updated_at: "2024-07-01",
  },
  {
    id: 14,  name: "Karen Jackson",  email: "kjackson@email.com",  phone: "(555) 456-7891",
    property: "Riverside Park",  unit: "20O",  move_in_date: "2022-09-25",  status: "Inactive",
    created_at: "2022-09-25", updated_at: "2024-07-01",
  },
  {
    id: 15,  name: "Mark White",  email: "mwhite@email.com",  phone: "(555) 567-8902",
    property: "Meadow Lane Housing",  unit: "4P",  move_in_date: "2023-10-12",  status: "Active",
    created_at: "2023-10-12", updated_at: "2024-07-01",
  },
  {
    id: 16,  name: "Patricia Harris",  email: "pharris@email.com",  phone: "(555) 678-9013",
    property: "Sunset Ridge",  unit: "16Q",  move_in_date: "2023-01-20",  status: "Active",
    created_at: "2023-01-20", updated_at: "2024-07-01",
  },
  {
    id: 17,  name: "Steven Martin",  email: "smartin@email.com",  phone: "(555) 789-0124",
    property: "Brookside Manor",  unit: "8R",  move_in_date: "2024-04-05",  status: "Active",
    created_at: "2024-04-05", updated_at: "2024-07-01",
  },
  {
    id: 18,  name: "Nancy Garcia",  email: "ngarcia@email.com",  phone: "(555) 890-1235",
    property: "Parkside Towers",  unit: "22S",  move_in_date: "2023-06-30",  status: "Active",
    created_at: "2023-06-30", updated_at: "2024-07-01",
  },
  {
    id: 19,  name: "Paul Robinson",  email: "probinson@email.com",  phone: "(555) 901-2346",
    property: "Creekside Apartments",  unit: "10T",  move_in_date: "2022-12-08",  status: "Active",
    created_at: "2022-12-08", updated_at: "2024-07-01",
  },
  {
    id: 20,  name: "Sandra Clark",  email: "sclark@email.com",  phone: "(555) 012-3457",
    property: "Woodland Heights",  unit: "17U",  move_in_date: "2023-08-14",  status: "Active",
    created_at: "2023-08-14", updated_at: "2024-07-01",
  },
  {
    id: 21,  name: "Kevin Rodriguez",  email: "krodriguez@email.com",  phone: "(555) 123-4569",
    property: "Stonegate Complex",  unit: "2V",  move_in_date: "2024-01-22",  status: "Active",
    created_at: "2024-01-22", updated_at: "2024-07-01",
  },
  {
    id: 22,  name: "Donna Lewis",  email: "dlewis@email.com",  phone: "(555) 234-5680",
    property: "Clearwater Residences",  unit: "13W",  move_in_date: "2023-05-17",  status: "Active",
    created_at: "2023-05-17", updated_at: "2024-07-01",
  },
]

// Known property names for the dropdown
const propertyOptions = [
  "Riverside Apartments","Green Valley Housing","Downtown Residences","Northside Complex",
  "Westside Towers","Eastside Manor","Central Park Housing","Sunset Gardens",
  "Hillside Residences","Lakeside Apartments","Mountain View Complex","Valley Heights",
  "Riverside Park","Meadow Lane Housing","Sunset Ridge","Brookside Manor",
  "Parkside Towers","Creekside Apartments","Woodland Heights","Stonegate Complex",
  "Clearwater Residences","Sunnydale Housing",
]

// ── Page ────────────────────────────────────────────────────────────
export function ResidentsPage() {
  const [residents, setResidents]               = useState<Resident[]>(allResidents)
  const [searchTerm, setSearchTerm]             = useState("")
  const [currentPage, setCurrentPage]           = useState(1)
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null)
  const [contactResident, setContactResident]   = useState<Resident | null>(null)

  // Add Resident modal
  const [addOpen, setAddOpen]         = useState(false)
  const [addConfirmed, setAddConfirmed] = useState(false)
  const [addedName, setAddedName]     = useState<string>("")
  const [form, setForm] = useState({
    name: "", email: "", phone: "", property: propertyOptions[0],
    unit: "", move_in_date: "", status: "Active",
  })
  const formValid = form.name.trim() && form.email.trim() && form.phone.trim() && form.unit.trim() && form.move_in_date

  function handleAddSubmit() {
    if (!formValid) return
    const newResident: Resident = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      property: form.property,
      unit: form.unit.trim(),
      move_in_date: form.move_in_date,
      status: form.status as "Active" | "Inactive",
      created_at: new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString().slice(0, 10),
    }
    setResidents((prev) => [newResident, ...prev])
    setAddedName(form.name.trim())
    setAddConfirmed(true)
  }

  function closeAddModal() {
    setAddOpen(false)
    setAddConfirmed(false)
    setForm({ name: "", email: "", phone: "", property: propertyOptions[0], unit: "", move_in_date: "", status: "Active" })
  }

  const itemsPerPage = 20

  const filteredResidents = useMemo(
    () =>
      residents.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.property.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [searchTerm, residents],
  )

  const totalPages  = Math.ceil(filteredResidents.length / itemsPerPage)
  const startIndex  = (currentPage - 1) * itemsPerPage
  const paginated   = filteredResidents.slice(startIndex, startIndex + itemsPerPage)

  // ── Profile view ────────────────────────────────────────────────
  if (selectedResident) {
    return (
      <ResidentProfileView
        resident={selectedResident}
        onBack={() => setSelectedResident(null)}
      />
    )
  }

  // ── Roster table ────────────────────────────────────────────────
  return (
    <main className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Residents</h1>
        <p className="text-muted-foreground">
          View occupants — click <strong>Profile</strong> to see longitudinal housing journey and health indicators
        </p>
      </div>

      {/* Search + Add */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by name, email, or property..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="flex-1"
        />
        <Button className="bg-primary hover:bg-primary/90 gap-2" onClick={() => setAddOpen(true)}>
          <UserPlus className="w-4 h-4" /> Add Resident
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground hidden md:table-cell">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Property</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground hidden sm:table-cell">Unit</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground hidden lg:table-cell">Move-in</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((resident) => (
              <tr
                key={resident.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  <div className="flex items-center gap-2">
                    {resident.name}
                    {(resident.behavioral_health_flag || resident.mobility_limitation) && (
                      <span
                        className="w-2 h-2 rounded-full bg-orange-400 shrink-0"
                        title="Health flags present — view profile"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{resident.email}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{resident.phone}</td>
                <td className="px-6 py-4 text-sm text-foreground">{resident.property}</td>
                <td className="px-6 py-4 text-sm text-foreground hidden sm:table-cell">{resident.unit}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">
                  {resident.move_in_date}
                </td>
                <td className="px-6 py-4 text-sm">
                  <Badge variant={resident.status === "Active" ? "default" : "secondary"}>
                    {resident.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => setSelectedResident(resident)}
                    >
                      Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent hidden sm:inline-flex"
                      onClick={() => setContactResident(resident)}
                    >
                      Contact
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, filteredResidents.length)} of{" "}
          {filteredResidents.length} residents
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-primary hover:bg-primary/90 w-8" : "w-8"}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* ── Add Resident Modal ────────────────────────────────────── */}
      <Dialog open={addOpen} onOpenChange={(open) => { if (!open) closeAddModal() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              {addConfirmed ? "Resident Added" : "Add New Resident"}
            </DialogTitle>
          </DialogHeader>

          {addConfirmed ? (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mx-auto">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                <strong>{addedName}</strong> has been added to the resident roster.
              </p>
              <DialogFooter>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={closeAddModal}>Done</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-3 py-1">
              {[
                { label: "Full Name",   field: "name",  type: "text",  placeholder: "e.g. Maria Torres",      required: true },
                { label: "Email",       field: "email", type: "email", placeholder: "email@example.com",      required: true },
                { label: "Phone",       field: "phone", type: "tel",   placeholder: "(555) 000-0000",          required: true },
                { label: "Unit",        field: "unit",  type: "text",  placeholder: "e.g. 4A",                required: true },
                { label: "Move-in Date",field: "move_in_date", type: "date", placeholder: "", required: true },
              ].map(({ label, field, type, placeholder, required }) => (
                <div key={field}>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">
                    {label} {required && <span className="text-red-500">*</span>}
                  </label>
                  <Input
                    type={type}
                    placeholder={placeholder}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Property <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.property}
                  onChange={(e) => setForm((f) => ({ ...f, property: e.target.value }))}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {propertyOptions.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <DialogFooter className="gap-2 pt-1">
                <Button variant="outline" className="flex-1" onClick={closeAddModal}>Cancel</Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleAddSubmit}
                  disabled={!formValid}
                >
                  Add Resident
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Contact Modal ─────────────────────────────────────────── */}
      <Dialog open={!!contactResident} onOpenChange={(open) => { if (!open) setContactResident(null) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">Contact Resident</DialogTitle>
          </DialogHeader>

          {contactResident && (
            <div className="space-y-5 py-1">
              {/* Resident identity */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-base">
                    {contactResident.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{contactResident.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {contactResident.property} · Unit {contactResident.unit}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Phone */}
                <div className="border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone
                  </p>
                  <p className="text-sm font-medium text-foreground mb-3">{contactResident.phone}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90 text-white gap-1.5"
                      asChild
                    >
                      <a href={`tel:${contactResident.phone.replace(/\D/g, "")}`}>
                        <Phone className="w-3.5 h-3.5" /> Call
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-1.5 bg-transparent"
                      asChild
                    >
                      <a href={`sms:${contactResident.phone.replace(/\D/g, "")}`}>
                        <MessageSquare className="w-3.5 h-3.5" /> SMS
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Email */}
                <div className="border border-border rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </p>
                  <p className="text-sm font-medium text-foreground mb-3 break-all">{contactResident.email}</p>
                  <Button
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-white gap-1.5"
                    asChild
                  >
                    <a href={`mailto:${contactResident.email}`}>
                      <Mail className="w-3.5 h-3.5" /> Send Email
                    </a>
                  </Button>
                </div>
              </div>

              {/* Preferred method note */}
              {contactResident.daily_activity_level && (
                <p className="text-xs text-muted-foreground text-center">
                  Activity level: <span className="font-medium capitalize">{contactResident.daily_activity_level}</span>
                  {" — "}consider best time to reach this resident.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

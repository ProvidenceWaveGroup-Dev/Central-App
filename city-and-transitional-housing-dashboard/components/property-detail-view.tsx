"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Building2,
  Users,
  AlertTriangle,
  ClipboardCheck,
  MapPin,
  CalendarDays,
  TrendingUp,
} from "lucide-react"

interface Property {
  id: number
  name: string
  address: string
  units: number
  occupancy: number
  status: string
  riskLevel: string
  lastInspection: string
}

interface PropertyDetailViewProps {
  property: Property
  onBack: () => void
}

// Mock residents per property (in production: GET /api/properties/:id/residents)
const mockResidents: Record<number, { name: string; unit: string; status: string; moveIn: string }[]> = {
  1: [
    { name: "John Smith",      unit: "12A", status: "Active",   moveIn: "2023-06-15" },
    { name: "Emily Rodriguez", unit: "8F",  status: "Active",   moveIn: "2023-09-05" },
    { name: "Laura Bennett",   unit: "3B",  status: "Active",   moveIn: "2022-11-01" },
    { name: "Tony Marsh",      unit: "21C", status: "Inactive", moveIn: "2021-05-20" },
  ],
  2: [
    { name: "Sarah Johnson",   unit: "5B",  status: "Active",   moveIn: "2022-03-20" },
    { name: "Greg Willis",     unit: "9D",  status: "Active",   moveIn: "2023-01-14" },
  ],
  3: [
    { name: "Michael Chen",    unit: "23C", status: "Active",   moveIn: "2024-01-10" },
    { name: "Alicia Voss",     unit: "7A",  status: "Active",   moveIn: "2023-07-22" },
    { name: "James Okafor",    unit: "15F", status: "Active",   moveIn: "2022-09-30" },
  ],
  4: [
    { name: "David Williams",  unit: "15D", status: "Inactive", moveIn: "2022-11-12" },
    { name: "Beth Carlson",    unit: "6C",  status: "Active",   moveIn: "2023-04-08" },
  ],
}

// Mock recent alerts per property (in production: GET /api/properties/:id/alerts)
const mockAlerts: Record<number, { type: string; unit: string; severity: string; date: string }[]> = {
  1: [
    { type: "Fall Detection",   unit: "12A", severity: "critical", date: "2024-10-23" },
    { type: "Air Quality",      unit: "3B",  severity: "medium",   date: "2024-10-20" },
  ],
  4: [
    { type: "Maintenance",      unit: "15D", severity: "high",     date: "2024-10-15" },
    { type: "Water Leak",       unit: "6C",  severity: "high",     date: "2024-10-18" },
  ],
}

const riskColors: Record<string, string> = {
  Low:    "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High:   "bg-red-100 text-red-800",
}

const severityColors: Record<string, string> = {
  critical: "border-l-4 border-red-500 bg-red-50",
  high:     "border-l-4 border-orange-500 bg-orange-50",
  medium:   "border-l-4 border-yellow-500 bg-yellow-50",
  low:      "border-l-4 border-blue-500 bg-blue-50",
}

export function PropertyDetailView({ property, onBack }: PropertyDetailViewProps) {
  const occupied   = Math.round((property.occupancy / 100) * property.units)
  const vacant     = property.units - occupied
  const residents  = mockResidents[property.id] ?? []
  const alerts     = mockAlerts[property.id]    ?? []

  return (
    <main className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mt-1 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Properties
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-foreground"
            style={{ fontFamily: "'Georgia Pro', Georgia, serif" }}
          >
            {property.name}
          </h1>
          <p className="text-muted-foreground flex items-center gap-1.5 mt-1 text-sm">
            <MapPin className="w-4 h-4 shrink-0" />
            {property.address}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className={riskColors[property.riskLevel]}>{property.riskLevel} Risk</Badge>
          <Badge variant={property.status === "Active" ? "default" : "secondary"}>
            {property.status}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Units",     value: property.units,           icon: Building2,     color: "text-primary" },
          { label: "Occupied",        value: occupied,                  icon: Users,         color: "text-green-600" },
          { label: "Vacant",          value: vacant,                    icon: TrendingUp,    color: "text-muted-foreground" },
          { label: "Occupancy Rate",  value: `${property.occupancy}%`,  icon: ClipboardCheck, color: "text-blue-600" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <Icon className={`w-8 h-8 ${stat.color} shrink-0`} />
                <div>
                  <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Resident Roster */}
        <Card className="border-border lg:col-span-2">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-base font-serif flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Current Residents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {residents.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">No resident records for this property.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Name</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Unit</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground hidden sm:table-cell">Move-in</th>
                    <th className="px-4 py-2 text-left font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {residents.map((r, i) => (
                    <tr key={i} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.unit}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{r.moveIn}</td>
                      <td className="px-4 py-3">
                        <Badge variant={r.status === "Active" ? "default" : "secondary"} className="text-xs">
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="space-y-4">
          {/* Property details */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-sm">
              {[
                { label: "Last Inspection", value: property.lastInspection },
                { label: "Program Type",    value: "Permanent Supportive Housing" },
                { label: "Managing Agency", value: "City Housing Department" },
                { label: "Case Manager",    value: "M. Okafor" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-medium text-foreground text-right">{row.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent alerts */}
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-2">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent alerts.</p>
              ) : (
                alerts.map((a, i) => (
                  <div key={i} className={`rounded p-2.5 text-sm ${severityColors[a.severity]}`}>
                    <p className="font-medium text-foreground">{a.type}</p>
                    <p className="text-xs text-muted-foreground">Unit {a.unit} · {a.date}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

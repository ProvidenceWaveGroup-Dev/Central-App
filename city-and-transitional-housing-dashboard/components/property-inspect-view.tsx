"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ClipboardList,
  CalendarDays,
  User,
  MapPin,
  Clock,
  ClipboardCheck,
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

interface PropertyInspectViewProps {
  property: Property
  onBack: () => void
}

type CheckStatus = "pass" | "fail" | "warning"

interface CheckItem {
  item: string
  status: CheckStatus
  note?: string
}

interface CheckCategory {
  category: string
  items: CheckItem[]
}

// Mock inspection data (in production: GET /api/properties/:id/inspections/latest)
const mockInspections: Record<number, {
  inspector: string
  date: string
  type: string
  nextDate: string
  overallScore: number
  checklist: CheckCategory[]
  issues: { description: string; severity: string; action: string }[]
}> = {
  1: {
    inspector:    "R. Nguyen — City Compliance Office",
    date:         "2024-10-15",
    type:         "Annual Health & Safety Inspection",
    nextDate:     "2025-10-15",
    overallScore: 91,
    checklist: [
      {
        category: "Safety & Emergency Systems",
        items: [
          { item: "Smoke detectors functional",         status: "pass" },
          { item: "Fire extinguishers current",          status: "pass" },
          { item: "Emergency exit signage visible",      status: "pass" },
          { item: "Sprinkler system tested",             status: "warning", note: "Zone 3 pressure low — re-test scheduled" },
        ],
      },
      {
        category: "Structural & Common Areas",
        items: [
          { item: "Roof and exterior walls intact",      status: "pass" },
          { item: "Common area flooring safe",           status: "pass" },
          { item: "Stairwells and handrails secure",     status: "pass" },
          { item: "Elevator current inspection cert",    status: "pass" },
        ],
      },
      {
        category: "HVAC & Ventilation",
        items: [
          { item: "HVAC filters replaced",               status: "pass" },
          { item: "Ventilation in all units adequate",   status: "warning", note: "Unit 3B airflow restricted — review needed" },
          { item: "CO detector coverage",                status: "pass" },
        ],
      },
      {
        category: "Plumbing & Water",
        items: [
          { item: "Hot water temperature compliant",     status: "pass" },
          { item: "No visible leaks in common areas",    status: "pass" },
          { item: "Backflow prevention devices present", status: "pass" },
        ],
      },
      {
        category: "Electrical",
        items: [
          { item: "Panel boxes labeled and accessible",  status: "pass" },
          { item: "GFCI outlets in wet areas",           status: "pass" },
          { item: "No exposed wiring observed",          status: "pass" },
        ],
      },
    ],
    issues: [
      {
        description: "Sprinkler zone 3 pressure reading below threshold",
        severity:    "medium",
        action:      "Schedule re-test with licensed sprinkler contractor within 30 days",
      },
      {
        description: "Unit 3B ventilation airflow restricted",
        severity:    "low",
        action:      "Maintenance team to inspect ductwork and clear obstruction",
      },
    ],
  },
  4: {
    inspector:    "T. Patel — City Compliance Office",
    date:         "2024-09-28",
    type:         "Annual Health & Safety Inspection",
    nextDate:     "2025-03-28",
    overallScore: 67,
    checklist: [
      {
        category: "Safety & Emergency Systems",
        items: [
          { item: "Smoke detectors functional",          status: "pass" },
          { item: "Fire extinguishers current",           status: "fail",    note: "Units 10–15D extinguishers expired" },
          { item: "Emergency exit signage visible",       status: "warning", note: "Basement exit sign damaged" },
          { item: "Sprinkler system tested",              status: "pass" },
        ],
      },
      {
        category: "Structural & Common Areas",
        items: [
          { item: "Roof and exterior walls intact",       status: "warning", note: "Roof section C shows surface cracking" },
          { item: "Common area flooring safe",            status: "fail",    note: "Lobby floor tiles cracked — trip hazard" },
          { item: "Stairwells and handrails secure",      status: "pass" },
          { item: "Elevator current inspection cert",     status: "pass" },
        ],
      },
      {
        category: "HVAC & Ventilation",
        items: [
          { item: "HVAC filters replaced",                status: "fail",    note: "Filters overdue by 4 months" },
          { item: "Ventilation in all units adequate",    status: "warning", note: "Multiple units below standard CFM" },
          { item: "CO detector coverage",                 status: "pass" },
        ],
      },
      {
        category: "Plumbing & Water",
        items: [
          { item: "Hot water temperature compliant",      status: "pass" },
          { item: "No visible leaks in common areas",     status: "fail",    note: "Active leak near unit 6C utility room" },
          { item: "Backflow prevention devices present",  status: "pass" },
        ],
      },
      {
        category: "Electrical",
        items: [
          { item: "Panel boxes labeled and accessible",   status: "pass" },
          { item: "GFCI outlets in wet areas",            status: "warning", note: "Unit 15D bathroom GFCI not tripping" },
          { item: "No exposed wiring observed",           status: "pass" },
        ],
      },
    ],
    issues: [
      {
        description: "Fire extinguishers expired in units 10–15D",
        severity:    "high",
        action:      "Replace immediately — contact supplier within 72 hours",
      },
      {
        description: "Lobby floor tiles cracked — active trip hazard",
        severity:    "high",
        action:      "Cordon area and schedule tile replacement within 7 days",
      },
      {
        description: "Active water leak near unit 6C utility room",
        severity:    "high",
        action:      "Emergency plumbing dispatch — isolate valve and repair",
      },
      {
        description: "HVAC filters overdue for replacement",
        severity:    "medium",
        action:      "Replace all filters during next maintenance window",
      },
      {
        description: "Roof section C surface cracking observed",
        severity:    "medium",
        action:      "Engage roofing contractor for assessment within 30 days",
      },
    ],
  },
}

const defaultInspection = {
  inspector:    "City Compliance Office",
  date:         "",
  type:         "Annual Health & Safety Inspection",
  nextDate:     "—",
  overallScore: 85,
  checklist:    [] as CheckCategory[],
  issues:       [] as { description: string; severity: string; action: string }[],
}

const statusIcon = (s: CheckStatus) => {
  if (s === "pass")    return <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
  if (s === "fail")    return <XCircle      className="w-4 h-4 text-red-600    shrink-0" />
  return                      <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
}

const severityBadge = (s: string) => {
  const map: Record<string, string> = {
    high:   "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low:    "bg-blue-100 text-blue-800",
  }
  return <Badge className={map[s] ?? "bg-gray-100 text-gray-700"}>{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>
}

const scoreColor = (score: number) =>
  score >= 85 ? "text-green-600" : score >= 70 ? "text-yellow-600" : "text-red-600"

export function PropertyInspectView({ property, onBack }: PropertyInspectViewProps) {
  const data       = mockInspections[property.id] ?? { ...defaultInspection, date: property.lastInspection }
  const passCount  = data.checklist.flatMap((c) => c.items).filter((i) => i.status === "pass").length
  const failCount  = data.checklist.flatMap((c) => c.items).filter((i) => i.status === "fail").length
  const warnCount  = data.checklist.flatMap((c) => c.items).filter((i) => i.status === "warning").length

  // Schedule modal state
  const [scheduleOpen, setScheduleOpen]     = useState(false)
  const [confirmed, setConfirmed]           = useState(false)
  const [inspectorName, setInspectorName]   = useState("")
  const [inspectDate, setInspectDate]       = useState(data.nextDate !== "—" ? data.nextDate : "")
  const [inspectType, setInspectType]       = useState("Annual")
  const [preferredTime, setPreferredTime]   = useState("Morning (9 am – 12 pm)")
  const [notes, setNotes]                   = useState("")
  const [scheduledDetails, setScheduledDetails] = useState<{ date: string; type: string; inspector: string; time: string } | null>(null)

  function handleScheduleSubmit() {
    if (!inspectorName.trim() || !inspectDate) return
    setScheduledDetails({ date: inspectDate, type: inspectType, inspector: inspectorName.trim(), time: preferredTime })
    setConfirmed(true)
  }

  function handleScheduleClose() {
    setScheduleOpen(false)
    // reset form for next open, but keep confirmed state so card updates
    setConfirmed(false)
    setInspectorName("")
    setNotes("")
  }

  const displayNextDate   = scheduledDetails?.date   ?? data.nextDate
  const displayInspector  = scheduledDetails?.inspector ?? data.inspector
  const displayType       = scheduledDetails?.type   ?? "Annual"
  const isScheduled       = !!scheduledDetails

  return (
    <main className="p-4 md:p-6 space-y-6">
      {/* Back */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Properties
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold text-foreground"
            style={{ fontFamily: "'Georgia Pro', Georgia, serif" }}
          >
            Inspection Report
          </h1>
          <p className="text-muted-foreground font-medium mt-0.5">{property.name}</p>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            {property.address}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className={`text-4xl font-bold ${scoreColor(data.overallScore)}`}>{data.overallScore}</p>
          <p className="text-xs text-muted-foreground">Overall Score</p>
        </div>
      </div>

      {/* Inspection meta */}
      <Card className="border-border">
        <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            { label: "Inspector",       value: data.inspector,  icon: User },
            { label: "Inspection Date", value: data.date || property.lastInspection, icon: CalendarDays },
            { label: "Type",            value: data.type,       icon: ClipboardList },
            { label: "Next Due",        value: data.nextDate,   icon: CalendarDays },
          ].map((row) => {
            const Icon = row.icon
            return (
              <div key={row.label} className="flex items-start gap-2">
                <Icon className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{row.label}</p>
                  <p className="font-medium text-foreground leading-tight">{row.value}</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Summary counts */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Passed",   value: passCount, color: "text-green-600",  bg: "bg-green-50 border-green-200" },
          { label: "Warnings", value: warnCount, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
          { label: "Failed",   value: failCount, color: "text-red-600",    bg: "bg-red-50 border-red-200" },
        ].map((s) => (
          <Card key={s.label} className={`border ${s.bg}`}>
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Checklist */}
        <div className="lg:col-span-2 space-y-4">
          {data.checklist.map((cat) => (
            <Card key={cat.category} className="border-border">
              <CardHeader className="border-b border-border py-3 px-4">
                <CardTitle className="text-sm font-semibold text-foreground">{cat.category}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-border">
                {cat.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3">
                    {statusIcon(item.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{item.item}</p>
                      {item.note && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium shrink-0 ${
                        item.status === "pass"
                          ? "text-green-600"
                          : item.status === "fail"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {data.checklist.length === 0 && (
            <Card className="border-border">
              <CardContent className="p-6 text-center text-sm text-muted-foreground">
                No checklist data available for this property. Run an inspection to generate a report.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Issues & Recommendations */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-base font-serif flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Issues Found
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-3">
              {data.issues.length === 0 ? (
                <p className="text-sm text-green-600 font-medium">No issues identified.</p>
              ) : (
                data.issues.map((issue, i) => (
                  <div key={i} className="border border-border rounded-md p-3 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground leading-snug">{issue.description}</p>
                      {severityBadge(issue.severity)}
                    </div>
                    <p className="text-xs text-muted-foreground">{issue.action}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Next Inspection card — redesigned */}
          <Card className="border-border overflow-hidden">
            <div className="bg-primary px-4 py-3 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-white" />
              <h3
                className="text-sm font-semibold text-white"
                style={{ fontFamily: "'Georgia Pro', Georgia, serif" }}
              >
                Next Inspection
              </h3>
              {isScheduled && (
                <Badge className="ml-auto bg-green-500 text-white text-xs">Scheduled</Badge>
              )}
            </div>

            <CardContent className="p-4 space-y-4">
              {/* Date highlight */}
              <div className="flex items-center gap-3 bg-muted rounded-lg p-3">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <CalendarDays className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Scheduled Date</p>
                  <p className="text-base font-bold text-foreground">
                    {displayNextDate !== "—" ? displayNextDate : "Not yet scheduled"}
                  </p>
                </div>
              </div>

              {/* Detail rows */}
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    Inspection Type
                  </span>
                  <Badge variant="outline" className="text-xs font-medium">{displayType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="w-3.5 h-3.5" />
                    Inspector
                  </span>
                  <span className="font-medium text-foreground text-right max-w-[55%] truncate">
                    {isScheduled ? displayInspector : "TBD"}
                  </span>
                </div>
                {isScheduled && scheduledDetails && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      Preferred Time
                    </span>
                    <span className="font-medium text-foreground text-right max-w-[55%] text-xs">
                      {scheduledDetails.time}
                    </span>
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white"
                size="sm"
                onClick={() => setScheduleOpen(true)}
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                {isScheduled ? "Reschedule Inspection" : "Schedule Inspection"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Schedule Inspection Dialog ───────────────────────────── */}
      <Dialog open={scheduleOpen} onOpenChange={(open) => { if (!open) handleScheduleClose() }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg">
              {confirmed ? "Inspection Scheduled" : "Schedule Inspection"}
            </DialogTitle>
          </DialogHeader>

          {confirmed ? (
            /* ── Confirmation state ── */
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 mx-auto">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                The inspection for <strong>{property.name}</strong> has been scheduled.
              </p>
              <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                {[
                  { label: "Date",            value: scheduledDetails?.date },
                  { label: "Type",            value: scheduledDetails?.type },
                  { label: "Inspector",       value: scheduledDetails?.inspector },
                  { label: "Preferred Time",  value: scheduledDetails?.time },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-foreground">{row.value}</span>
                  </div>
                ))}
              </div>
              <DialogFooter>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleScheduleClose}>
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            /* ── Form state ── */
            <div className="space-y-4 py-1">
              {/* Property — read only */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Property</label>
                <Input value={property.name} disabled className="bg-muted text-sm" />
              </div>

              {/* Inspector name */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Inspector Name <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="e.g. R. Nguyen"
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Inspection Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={inspectDate}
                  onChange={(e) => setInspectDate(e.target.value)}
                  className="text-sm"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Inspection Type</label>
                <select
                  value={inspectType}
                  onChange={(e) => setInspectType(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Annual</option>
                  <option>Quarterly</option>
                  <option>Follow-up</option>
                  <option>Emergency</option>
                </select>
              </div>

              {/* Preferred time */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Preferred Time</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option>Morning (9 am – 12 pm)</option>
                  <option>Afternoon (12 pm – 5 pm)</option>
                  <option>Any time</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Notes (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Access instructions, specific concerns…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <DialogFooter className="gap-2 pt-1">
                <Button variant="outline" className="flex-1" onClick={handleScheduleClose}>
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleScheduleSubmit}
                  disabled={!inspectorName.trim() || !inspectDate}
                >
                  Confirm Schedule
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, User, AlertTriangle, Activity, Brain, Calendar } from "lucide-react"
import { ResidentTransitionTimeline } from "@/components/resident-transition-timeline"
import { ResidentLivingEnvironmentTimeline } from "@/components/resident-living-environment-timeline"
import type { Resident, ResidentTransition, LivingEnvironment, ResidentHealthScore } from "@/lib/types"

// ── Mock longitudinal data (replace with API calls in production) ─
// GET /api/residents/:id/transitions
// GET /api/residents/:id/environments
// GET /api/residents/:id/health-scores

const mockTransitions: Record<number, ResidentTransition[]> = {
  1: [
    {
      id: 1, resident_id: 1,
      agency_name: "STRA — State Housing Authority",
      program_name: "Emergency Housing Assistance",
      program_type: "emergency",
      entry_date: "2022-03-15", exit_date: "2022-09-28",
      transition_reason: "Stable transitional placement secured",
      case_manager: "D. Rivera",
      created_at: "2022-03-15",
    },
    {
      id: 2, resident_id: 1,
      agency_name: "City Housing Department",
      program_name: "Bridge Transitional Program",
      program_type: "transitional",
      entry_date: "2022-10-01", exit_date: "2023-05-31",
      transition_reason: "Qualified for permanent housing",
      case_manager: "D. Rivera",
      created_at: "2022-10-01",
    },
    {
      id: 3, resident_id: 1,
      agency_name: "City Housing Department",
      program_name: "Riverside Apartments — Unit 12A",
      program_type: "permanent_supportive",
      entry_date: "2023-06-15", exit_date: null,
      case_manager: "M. Okafor",
      created_at: "2023-06-15",
    },
  ],
  2: [
    {
      id: 4, resident_id: 2,
      agency_name: "CHCS — Center for Health Care Strategies",
      program_name: "Health-Linked Housing Initiative",
      program_type: "transitional",
      entry_date: "2021-01-10", exit_date: "2022-02-28",
      transition_reason: "Program completion — met stability milestones",
      case_manager: "L. Tran",
      created_at: "2021-01-10",
    },
    {
      id: 5, resident_id: 2,
      agency_name: "City Housing Department",
      program_name: "Green Valley Housing — Unit 5B",
      program_type: "permanent_supportive",
      entry_date: "2022-03-20", exit_date: null,
      case_manager: "L. Tran",
      created_at: "2022-03-20",
    },
  ],
  3: [
    {
      id: 6, resident_id: 3,
      agency_name: "Nonprofit: New Directions Housing",
      program_name: "Rapid Rehousing Program",
      program_type: "rapid_rehousing",
      entry_date: "2023-09-01", exit_date: "2024-01-05",
      transition_reason: "Transitioned to city housing program",
      case_manager: "A. Patel",
      created_at: "2023-09-01",
    },
    {
      id: 7, resident_id: 3,
      agency_name: "City Housing Department",
      program_name: "Downtown Residences — Unit 23C",
      program_type: "city_housing",
      entry_date: "2024-01-10", exit_date: null,
      case_manager: "A. Patel",
      created_at: "2024-01-10",
    },
  ],
}

const mockEnvironments: Record<number, LivingEnvironment[]> = {
  1: [
    {
      id: 1, resident_id: 1,
      environment_type: "unknown",
      location_name: "Unhoused — Street / Vehicle",
      city: "Springfield",
      entry_date: "2022-01-01", exit_date: "2022-03-14",
      notes: "Gap period prior to STRA intake",
      created_at: "2022-01-01",
    },
    {
      id: 2, resident_id: 1,
      environment_type: "emergency_shelter",
      location_name: "Eastside Emergency Shelter",
      city: "Springfield",
      entry_date: "2022-03-15", exit_date: "2022-09-28",
      created_at: "2022-03-15",
    },
    {
      id: 3, resident_id: 1,
      environment_type: "transitional_housing",
      location_name: "City Bridge Transitional Center",
      city: "Springfield",
      entry_date: "2022-10-01", exit_date: "2023-05-31",
      created_at: "2022-10-01",
    },
    {
      id: 4, resident_id: 1,
      environment_type: "permanent_supportive",
      location_name: "Riverside Apartments",
      city: "Springfield",
      entry_date: "2023-06-15", exit_date: null,
      created_at: "2023-06-15",
    },
  ],
  2: [
    {
      id: 5, resident_id: 2,
      environment_type: "emergency_shelter",
      location_name: "Northside Community Shelter",
      city: "Shelbyville",
      entry_date: "2020-11-01", exit_date: "2021-01-09",
      notes: "Referred by county intake",
      created_at: "2020-11-01",
    },
    {
      id: 6, resident_id: 2,
      environment_type: "transitional_housing",
      location_name: "CHCS Transitional Residence",
      city: "Shelbyville",
      entry_date: "2021-01-10", exit_date: "2022-02-28",
      created_at: "2021-01-10",
    },
    {
      id: 7, resident_id: 2,
      environment_type: "permanent_supportive",
      location_name: "Green Valley Housing",
      city: "Shelbyville",
      entry_date: "2022-03-20", exit_date: null,
      created_at: "2022-03-20",
    },
  ],
  3: [
    {
      id: 8, resident_id: 3,
      environment_type: "medical_facility",
      location_name: "Capital City Medical Center",
      city: "Capital City",
      entry_date: "2023-06-01", exit_date: "2023-08-25",
      notes: "Recovery stay following health event",
      created_at: "2023-06-01",
    },
    {
      id: 9, resident_id: 3,
      environment_type: "transitional_housing",
      location_name: "New Directions Rapid Housing",
      city: "Capital City",
      entry_date: "2023-09-01", exit_date: "2024-01-05",
      created_at: "2023-09-01",
    },
    {
      id: 10, resident_id: 3,
      environment_type: "permanent_supportive",
      location_name: "Downtown Residences",
      city: "Capital City",
      entry_date: "2024-01-10", exit_date: null,
      created_at: "2024-01-10",
    },
  ],
}

const mockHealthScores: Record<number, ResidentHealthScore[]> = {
  1: [
    { id: 1, resident_id: 1, record_date: "2024-01-01", mobility_score: 72, activity_score: 65, overall_health_index: 69, behavioral_health_indicator: 55, created_at: "2024-01-01" },
    { id: 2, resident_id: 1, record_date: "2024-04-01", mobility_score: 78, activity_score: 71, overall_health_index: 75, behavioral_health_indicator: 62, created_at: "2024-04-01" },
    { id: 3, resident_id: 1, record_date: "2024-07-01", mobility_score: 83, activity_score: 76, overall_health_index: 80, behavioral_health_indicator: 70, created_at: "2024-07-01" },
  ],
  2: [
    { id: 4, resident_id: 2, record_date: "2024-01-01", mobility_score: 55, activity_score: 48, overall_health_index: 52, created_at: "2024-01-01" },
    { id: 5, resident_id: 2, record_date: "2024-04-01", mobility_score: 60, activity_score: 54, overall_health_index: 57, created_at: "2024-04-01" },
    { id: 6, resident_id: 2, record_date: "2024-07-01", mobility_score: 64, activity_score: 58, overall_health_index: 61, created_at: "2024-07-01" },
  ],
  3: [
    { id: 7, resident_id: 3, record_date: "2024-01-01", mobility_score: 80, activity_score: 75, overall_health_index: 78, created_at: "2024-01-01" },
    { id: 8, resident_id: 3, record_date: "2024-04-01", mobility_score: 85, activity_score: 80, overall_health_index: 83, created_at: "2024-04-01" },
    { id: 9, resident_id: 3, record_date: "2024-07-01", mobility_score: 88, activity_score: 84, overall_health_index: 86, created_at: "2024-07-01" },
  ],
}

// ── Component ───────────────────────────────────────────────────────

interface Props {
  resident: Resident
  onBack: () => void
}

export function ResidentProfileView({ resident, onBack }: Props) {
  const transitions = mockTransitions[resident.id] ?? []
  const environments = mockEnvironments[resident.id] ?? []
  const healthScores = mockHealthScores[resident.id] ?? []
  const latestScore = healthScores[healthScores.length - 1]

  return (
    <main className="p-4 md:p-6 space-y-6">
      {/* Back navigation */}
      <Button
        variant="outline"
        size="sm"
        className="bg-transparent gap-1.5"
        onClick={onBack}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Residents
      </Button>

      {/* Resident header */}
      <Card className="border-border">
        <CardContent className="pt-5 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Georgia Pro', Georgia, serif" }}>
                  {resident.name}
                </h1>
                <Badge variant={resident.status === "Active" ? "default" : "secondary"}>
                  {resident.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {resident.property} · Unit {resident.unit}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Move-in: {resident.move_in_date ?? resident.moveInDate}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="bg-transparent">Contact</Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">Edit Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health signals (Feature Update 4) */}
      <Card className="border-border">
        <CardHeader className="border-b border-border py-3">
          <CardTitle className="text-base font-serif flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            Health &amp; Wellness Indicators
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Latest Overall Health Index */}
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground mb-1">Health Index</p>
              <p className="text-2xl font-bold text-primary">
                {latestScore ? latestScore.overall_health_index : "—"}
              </p>
              {latestScore && (
                <p className="text-xs text-muted-foreground mt-0.5">as of {latestScore.record_date}</p>
              )}
            </div>

            {/* Mobility score */}
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground mb-1">Mobility Score</p>
              <p className="text-2xl font-bold text-foreground">
                {latestScore ? latestScore.mobility_score : "—"}
              </p>
              {resident.mobility_limitation && (
                <p className="text-xs text-orange-600 font-medium mt-0.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Mobility limitation flagged
                </p>
              )}
            </div>

            {/* Activity score */}
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground mb-1">Activity Score</p>
              <p className="text-2xl font-bold text-foreground">
                {latestScore ? latestScore.activity_score : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                {resident.daily_activity_level ?? "moderate"} activity level
              </p>
            </div>

            {/* Behavioral health */}
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                <Brain className="w-3 h-3" /> Behavioral Health
              </p>
              <p className="text-2xl font-bold text-foreground">
                {latestScore?.behavioral_health_indicator ?? "—"}
              </p>
              {resident.behavioral_health_flag && (
                <p className="text-xs text-orange-600 font-medium mt-0.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Active flag — see case notes
                </p>
              )}
            </div>
          </div>

          {/* Health event flags */}
          {resident.health_event_flags && resident.health_event_flags.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Health Event Flags
              </p>
              <div className="flex flex-wrap gap-2">
                {resident.health_event_flags.map((flag, i) => (
                  <Badge key={i} className="text-xs bg-orange-100 text-orange-700">{flag}</Badge>
                ))}
              </div>
            </div>
          )}

          {resident.disability_notes && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-1">Disability Notes</p>
              <p className="text-sm text-foreground">{resident.disability_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Housing transition history */}
      <ResidentTransitionTimeline
        transitions={transitions}
        residentName={resident.name}
      />

      {/* Living environment timeline */}
      <ResidentLivingEnvironmentTimeline
        environments={environments}
        residentName={resident.name}
      />
    </main>
  )
}

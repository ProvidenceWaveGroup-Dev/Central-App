// ─────────────────────────────────────────────────────────────────
// City and Transitional Housing Intelligence Platform
// Database schema type definitions
// ─────────────────────────────────────────────────────────────────

// ── residents ──────────────────────────────────────────────────────
export interface Resident {
  id: number
  name: string
  email: string
  phone: string
  property: string
  unit: string
  move_in_date: string        // ISO date
  moveInDate?: string         // legacy alias — same value
  status: "Active" | "Inactive"
  created_at: string
  updated_at: string
  // Extended optional fields (Feature Update 4)
  mobility_limitation?: boolean
  behavioral_health_flag?: boolean
  disability_notes?: string
  daily_activity_level?: "low" | "moderate" | "high"
  health_event_flags?: string[]   // e.g. ["Fall risk", "Mental health assessment"]
}

// ── agency_partners ────────────────────────────────────────────────
export type AgencyType =
  | "state_federal"       // STRA
  | "health_strategy"     // CHCS
  | "nonprofit_housing"
  | "city_housing_dept"
  | "other"

export interface AgencyPartner {
  id: number
  agency_name: string
  agency_type: AgencyType
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  created_at: string
}

// ── resident_transitions ───────────────────────────────────────────
export type ProgramType =
  | "emergency"
  | "transitional"
  | "permanent_supportive"
  | "city_housing"
  | "rapid_rehousing"

export interface ResidentTransition {
  id: number
  resident_id: number
  agency_name: string
  program_name: string
  program_type: ProgramType
  entry_date: string            // ISO date
  exit_date: string | null      // null = current placement
  transition_reason?: string
  case_manager?: string
  created_at: string
}

// ── resident_living_environments ───────────────────────────────────
export type EnvironmentType =
  | "emergency_shelter"
  | "transitional_housing"
  | "permanent_supportive"
  | "private_residence"
  | "medical_facility"
  | "unknown"

export interface LivingEnvironment {
  id: number
  resident_id: number
  environment_type: EnvironmentType
  location_name: string
  city: string
  entry_date: string            // ISO date
  exit_date: string | null      // null = current
  notes?: string
  created_at: string
}

// ── resident_health_scores ─────────────────────────────────────────
export interface ResidentHealthScore {
  id: number
  resident_id: number
  record_date: string           // ISO date — one record per period
  mobility_score: number        // 0–100
  activity_score: number        // 0–100
  overall_health_index: number  // computed: round((mobility + activity) / 2)
  behavioral_health_indicator?: number  // 0–100, optional
  notes?: string
  created_at: string
}

// ── community_health_snapshot (aggregated, not per-resident) ───────
export interface CommunityHealthSnapshot {
  month: string                 // "Jan", "Feb" …
  mobility: number
  activity: number
  healthIndex: number
}

// ─────────────────────────────────────────────────────────────────
// API endpoint contracts
// ─────────────────────────────────────────────────────────────────
//
// GET  /api/residents                       → Resident[]
// GET  /api/residents/:id                   → Resident
// POST /api/residents                       → Resident
// PUT  /api/residents/:id                   → Resident
//
// GET  /api/residents/:id/transitions       → ResidentTransition[]
// POST /api/residents/:id/transitions       → ResidentTransition
//
// GET  /api/residents/:id/environments      → LivingEnvironment[]
// POST /api/residents/:id/environments      → LivingEnvironment
//
// GET  /api/residents/:id/health-scores     → ResidentHealthScore[]
// POST /api/residents/:id/health-scores     → ResidentHealthScore
//
// GET  /api/community/health-index          → CommunityHealthSnapshot[]
// GET  /api/agencies                        → AgencyPartner[]
// ─────────────────────────────────────────────────────────────────

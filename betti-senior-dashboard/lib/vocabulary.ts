/**
 * Betti Platform — System-Wide Vocabulary
 *
 * Single source of truth for terms used across all dashboard families.
 * Import these constants wherever labels, headings, or descriptions appear
 * so that every dashboard uses identical language.
 *
 * NON-DIAGNOSTIC: All terms are framed around observed system events and
 * environmental signals. No term implies clinical diagnosis or health staging.
 */

// ── People ────────────────────────────────────────────────────────────────────

export const VOCAB = {
  // The individual being monitored/supported
  RESIDENT:         "Resident",
  RESIDENTS:        "Residents",

  // Care and support staff
  CAREGIVER:        "Caregiver",
  CARE_STAFF:       "Care Staff",
  STAFF_OPERATOR:   "Staff Operator",

  // Partner responders
  EMS_RESPONDER:    "EMS Responder",
  SECURITY:         "Security",
  FIRE_RESCUE:      "Fire & Rescue",

  // ── Sections / Nav ──────────────────────────────────────────────────────────

  // Core navigation labels — use these everywhere instead of ad-hoc strings
  DASHBOARD:        "Dashboard",
  ALERT_QUEUE:      "Alert Queue",
  EVENTS:           "Events",
  MONITORING:       "Monitoring",
  RESIDENT_STATUS:  "Resident Status",
  INCIDENTS:        "Incidents",
  ACTIVITY_FEED:    "Activity Feed",
  COMMUNICATION:    "Communication",
  REPORTS:          "Reports & Analytics",
  SETTINGS:         "Settings",

  // ── Metrics ─────────────────────────────────────────────────────────────────

  // Avoid "Wellness Score", "Health Score", or diagnostic language in UI labels
  WELLBEING_SCORE:  "Daily Well-being Score",   // senior dashboard (0–100)
  VITALS_SUMMARY:   "Vitals Summary",
  ENVIRONMENT:      "Environment",
  DEVICE_HEALTH:    "Device Health",

  // ── Organisational tiers ────────────────────────────────────────────────────
  TIER_ORG:         "Organizational",
  TIER_FACILITY:    "Facility Operations",
  TIER_RESPONDER:   "Response Partners",
  TIER_RESIDENT:    "Resident & Household",

  // ── Housing / Impact ────────────────────────────────────────────────────────
  HOUSING:          "Housing & Transitional Living",
  COMPLIANCE:       "Compliance",
  AUDIT_LOG:        "Audit Log",
  SOCIAL_IMPACT:    "Social Impact",
} as const;

export type VocabKey = keyof typeof VOCAB;

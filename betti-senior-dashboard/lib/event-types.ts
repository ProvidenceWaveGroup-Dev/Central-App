/**
 * Betti Platform — Shared Event Taxonomy
 *
 * Single source of truth for all system-generated event types.
 * Use EVENT_TYPE keys wherever alert types, incident types, or
 * activity classifications are referenced in any dashboard.
 *
 * NON-DIAGNOSTIC: All events represent sensor observations and
 * system-detected signals. No event implies clinical diagnosis,
 * prognosis, or health staging.
 *
 * Usage:
 *   import { EVENT_TYPE, EVENT_META } from "@/lib/event-types";
 *   const label = EVENT_META[EVENT_TYPE.FALL_DETECTED].label;
 */

// ── Event Type Keys ───────────────────────────────────────────────────────────

export const EVENT_TYPE = {

  // Movement & Safety
  FALL_DETECTED:         "fall_detected",
  WANDERING:             "wandering",

  // Vitals & Environmental Signals
  VITALS_OUT_OF_RANGE:   "vitals_out_of_range",
  BP_ELEVATED:           "bp_elevated",         // observed sensor reading above threshold
  TEMP_SPIKE:            "temp_spike",           // ambient or skin-surface temperature signal
  SPO2_LOW:              "spo2_low",

  // Activity & Routine
  INACTIVITY:            "inactivity",           // no movement detected beyond threshold window
  MISSED_CHECK_IN:       "missed_check_in",
  MISSED_MEDICATION:     "missed_medication",
  CHECK_IN_UNANSWERED:   "check_in_unanswered",  // AI-initiated check-in received no response

  // Emergency Activation
  EMERGENCY_BUTTON:      "emergency_button",     // resident-pressed emergency/panic button
  WELFARE_CHECK:         "welfare_check",        // staff-initiated welfare check flag

  // Device & Connectivity
  DEVICE_OFFLINE:        "device_offline",
  DEVICE_RECONNECTED:    "device_reconnected",
  LOW_BATTERY:           "low_battery",

  // Environment
  DOOR_LEFT_OPEN:        "door_left_open",

} as const;

export type EventTypeKey = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];

// ── Severity Levels ──────────────────────────────────────────────────────────

export type Severity = "critical" | "warning" | "info";

// ── Category Labels ──────────────────────────────────────────────────────────

export type EventCategory =
  | "movement_safety"
  | "vitals_signals"
  | "activity_routine"
  | "emergency"
  | "device_connectivity"
  | "environment";

export const CATEGORY_LABEL: Record<EventCategory, string> = {
  movement_safety:     "Movement & Safety",
  vitals_signals:      "Vitals & Signals",
  activity_routine:    "Activity & Routine",
  emergency:           "Emergency",
  device_connectivity: "Device & Connectivity",
  environment:         "Environment",
};

// ── Event Metadata ────────────────────────────────────────────────────────────

export type EventMeta = {
  /** Display label used in UI (tables, alerts, modals) */
  label: string;
  /** One-line description of what triggered this event */
  description: string;
  /** System-assigned default severity — may be overridden by rule engine */
  defaultSeverity: Severity;
  /** Functional grouping */
  category: EventCategory;
};

export const EVENT_META: Record<EventTypeKey, EventMeta> = {

  // ── Movement & Safety ────────────────────────────────────────────────────
  [EVENT_TYPE.FALL_DETECTED]: {
    label:           "Fall Detected",
    description:     "Sensor detected an impact or positional change consistent with a fall event.",
    defaultSeverity: "critical",
    category:        "movement_safety",
  },
  [EVENT_TYPE.WANDERING]: {
    label:           "Wandering",
    description:     "Resident movement detected outside expected zones or at unexpected hours.",
    defaultSeverity: "warning",
    category:        "movement_safety",
  },

  // ── Vitals & Signals ─────────────────────────────────────────────────────
  [EVENT_TYPE.VITALS_OUT_OF_RANGE]: {
    label:           "Vitals Out of Range",
    description:     "One or more observed vitals readings fell outside configured thresholds.",
    defaultSeverity: "warning",
    category:        "vitals_signals",
  },
  [EVENT_TYPE.BP_ELEVATED]: {
    label:           "Elevated Blood Pressure",
    description:     "Blood pressure sensor reading exceeded the configured upper threshold.",
    defaultSeverity: "critical",
    category:        "vitals_signals",
  },
  [EVENT_TYPE.TEMP_SPIKE]: {
    label:           "Temperature Spike",
    description:     "Ambient or surface temperature reading exceeded the configured threshold.",
    defaultSeverity: "warning",
    category:        "vitals_signals",
  },
  [EVENT_TYPE.SPO2_LOW]: {
    label:           "Low SpO₂ Reading",
    description:     "Pulse oximetry sensor reading fell below the configured lower threshold.",
    defaultSeverity: "warning",
    category:        "vitals_signals",
  },

  // ── Activity & Routine ───────────────────────────────────────────────────
  [EVENT_TYPE.INACTIVITY]: {
    label:           "Inactivity",
    description:     "No movement or interaction detected beyond the configured time window.",
    defaultSeverity: "warning",
    category:        "activity_routine",
  },
  [EVENT_TYPE.MISSED_CHECK_IN]: {
    label:           "Missed Check-in",
    description:     "Resident did not respond to or complete a scheduled check-in.",
    defaultSeverity: "warning",
    category:        "activity_routine",
  },
  [EVENT_TYPE.MISSED_MEDICATION]: {
    label:           "Missed Medication",
    description:     "Medication dispenser or schedule log recorded a missed dose event.",
    defaultSeverity: "warning",
    category:        "activity_routine",
  },
  [EVENT_TYPE.CHECK_IN_UNANSWERED]: {
    label:           "Check-in Unanswered",
    description:     "AI-initiated check-in received no response within the expected window.",
    defaultSeverity: "warning",
    category:        "activity_routine",
  },

  // ── Emergency ────────────────────────────────────────────────────────────
  [EVENT_TYPE.EMERGENCY_BUTTON]: {
    label:           "Emergency Button Activated",
    description:     "Resident manually activated the personal emergency button.",
    defaultSeverity: "critical",
    category:        "emergency",
  },
  [EVENT_TYPE.WELFARE_CHECK]: {
    label:           "Welfare Check",
    description:     "Staff-initiated welfare check flag raised for review.",
    defaultSeverity: "warning",
    category:        "emergency",
  },

  // ── Device & Connectivity ────────────────────────────────────────────────
  [EVENT_TYPE.DEVICE_OFFLINE]: {
    label:           "Device Offline",
    description:     "A monitoring device lost connectivity and stopped reporting.",
    defaultSeverity: "info",
    category:        "device_connectivity",
  },
  [EVENT_TYPE.DEVICE_RECONNECTED]: {
    label:           "Device Reconnected",
    description:     "A previously offline monitoring device re-established connectivity.",
    defaultSeverity: "info",
    category:        "device_connectivity",
  },
  [EVENT_TYPE.LOW_BATTERY]: {
    label:           "Low Battery",
    description:     "Device battery level fell below the configured low-battery threshold.",
    defaultSeverity: "info",
    category:        "device_connectivity",
  },

  // ── Environment ──────────────────────────────────────────────────────────
  [EVENT_TYPE.DOOR_LEFT_OPEN]: {
    label:           "Door Left Open",
    description:     "Entry/exit sensor detected a door held open beyond the expected duration.",
    defaultSeverity: "info",
    category:        "environment",
  },
};

// ── Convenience Helpers ───────────────────────────────────────────────────────

/** All event types grouped by category */
export const EVENTS_BY_CATEGORY: Record<EventCategory, EventTypeKey[]> = Object.entries(
  EVENT_META
).reduce<Record<EventCategory, EventTypeKey[]>>(
  (acc, [key, meta]) => {
    const cat = meta.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(key as EventTypeKey);
    return acc;
  },
  {} as Record<EventCategory, EventTypeKey[]>
);

/** All critical-severity event types */
export const CRITICAL_EVENT_TYPES: EventTypeKey[] = Object.entries(EVENT_META)
  .filter(([, meta]) => meta.defaultSeverity === "critical")
  .map(([key]) => key as EventTypeKey);

/** Resolve a string event type back to its metadata (graceful fallback) */
export function resolveEventMeta(type: string): EventMeta | null {
  return EVENT_META[type as EventTypeKey] ?? null;
}

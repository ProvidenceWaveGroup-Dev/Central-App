/**
 * Betti Senior Dashboard — Daily Well-being Score
 *
 * Produces a 0–100 composite score from six dimensions of daily health data.
 *
 * NON-DIAGNOSTIC: This score reflects observed sensor and care-log data only.
 * It does not classify, stage, or diagnose any health condition.
 *
 * ─────────────────────────────────────────────────────────────────────
 * DIMENSION          WEIGHT   DATABASE SOURCE
 * ─────────────────────────────────────────────────────────────────────
 * Medication         25 %     daily_adherence / medication_logs
 * Vitals             25 %     vital_metrics
 * Hydration          15 %     daily_adherence / hydration_logs
 * Sleep              15 %     daily_adherence / vital_metrics
 * Activity           10 %     daily_adherence / sensor_readings
 * Mood               10 %     behavior_wellness_logs
 * ─────────────────────────────────────────────────────────────────────
 *
 * API fields that map to each input:
 *
 *   adherence.medications_taken   → daily_adherence.medications_taken
 *   adherence.medications_missed  → daily_adherence.medications_missed
 *   adherence.hydration_glasses   → daily_adherence.hydration_glasses
 *   adherence.hydration_goal      → daily_adherence.hydration_goal      (default 8)
 *   adherence.steps_walked        → daily_adherence.steps_walked
 *   adherence.steps_goal          → daily_adherence.steps_goal          (default 3 000)
 *   adherence.sleep_hours         → daily_adherence.sleep_hours
 *
 *   vitals.heart_rate             → vital_metrics.heart_rate
 *   vitals.blood_pressure_systolic→ vital_metrics.blood_pressure_systolic
 *   vitals.blood_sugar_mg_dl      → sensor_readings (glucose sensor) or vital_metrics extension
 *   vitals.respiratory_rate       → sensor_readings (vital sensor)
 *
 *   mentalHealth.stress_level     → behavior_wellness_logs.stress_level  (0.0 – 1.0)
 *   mentalHealth.mood             → behavior_wellness_logs.mood          (string fallback)
 */

// ── Input / Output types ──────────────────────────────────────────────────────

export interface WellbeingInputs {
  /** Sourced from daily_adherence (one row per patient per day) */
  adherence: {
    medications_taken:  number;
    medications_missed: number;
    hydration_glasses:  number;
    hydration_goal:     number;  // pass 0 to use default of 8 glasses
    steps_walked:       number;
    steps_goal:         number;  // pass 0 to use default of 3 000 steps
    sleep_hours:        number;
  };
  /** Sourced from vital_metrics (latest row for the day) */
  vitals: {
    heart_rate?:              number | null;
    blood_pressure_systolic?: number | null;
    blood_sugar_mg_dl?:       number | null;
    respiratory_rate?:        number | null;
  };
  /** Sourced from behavior_wellness_logs (latest row for the day) */
  mentalHealth: {
    /** 0.0 = completely calm, 1.0 = maximum stress */
    stress_level?: number | null;
    /** Text mood value used when stress_level is unavailable */
    mood?:         string | null;
  };
}

export interface WellbeingBreakdown {
  medication: number;  // 0–100
  vitals:     number;  // 0–100
  hydration:  number;  // 0–100
  sleep:      number;  // 0–100
  activity:   number;  // 0–100
  mood:       number;  // 0–100
}

export interface WellbeingResult {
  /** Composite score, 0–100, rounded to nearest integer */
  score: number;
  rating: "Excellent" | "Good" | "Fair" | "Needs Attention" | "Critical";
  /** Individual dimension scores before weighting (each 0–100) */
  breakdown: WellbeingBreakdown;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

// ── Dimension scorers (each returns 0–100) ────────────────────────────────────

/**
 * Medication compliance.
 * Full marks if no medications are scheduled for the day.
 */
function scoreMedication(taken: number, missed: number): number {
  const total = taken + missed;
  if (total === 0) return 100;
  return clamp((taken / total) * 100, 0, 100);
}

/**
 * Heart rate (bpm).
 * Reference: normal adult resting range 60–100 bpm.
 */
function scoreHeartRate(bpm: number): number {
  if (bpm >= 60 && bpm <= 100) return 100;
  if ((bpm >= 50 && bpm < 60) || (bpm > 100 && bpm <= 110)) return 75;
  if ((bpm >= 40 && bpm < 50) || (bpm > 110 && bpm <= 120)) return 50;
  return 25;
}

/**
 * Blood pressure — systolic only (mmHg).
 * Reference: AHA classification.
 *   Normal:      < 120      → 100
 *   Elevated:    120–129    →  85
 *   High Stage 1:130–139    →  65
 *   High Stage 2:140–179    →  40
 *   Crisis:      ≥ 180      →  15
 */
function scoreBloodPressure(systolic: number): number {
  if (systolic < 120) return 100;
  if (systolic < 130) return 85;
  if (systolic < 140) return 65;
  if (systolic < 180) return 40;
  return 15;
}

/**
 * Blood sugar (mg/dL) — fasting reference ranges.
 *   Normal:        70–99    → 100
 *   Pre-diabetic: 100–125   →  75
 *   Diabetic:     ≥ 126     →  40
 *   Hypoglycemia:  < 70     →  30
 */
function scoreBloodSugar(mgDl: number): number {
  if (mgDl >= 70 && mgDl < 100) return 100;
  if (mgDl >= 100 && mgDl < 126) return 75;
  if (mgDl >= 126) return 40;
  return 30;
}

/**
 * Respiratory rate (breaths/min).
 * Reference: normal adult range 12–20/min.
 */
function scoreRespiratoryRate(perMin: number): number {
  if (perMin >= 12 && perMin <= 20) return 100;
  if ((perMin >= 10 && perMin < 12) || (perMin > 20 && perMin <= 25)) return 70;
  return 35;
}

/**
 * Composite vitals score — average of whichever vital fields are present.
 * Returns 100 (neutral) if no vitals data is available yet.
 */
function scoreVitals(v: WellbeingInputs["vitals"]): number {
  const scores: number[] = [];
  if (v.heart_rate != null)              scores.push(scoreHeartRate(v.heart_rate));
  if (v.blood_pressure_systolic != null) scores.push(scoreBloodPressure(v.blood_pressure_systolic));
  if (v.blood_sugar_mg_dl != null)       scores.push(scoreBloodSugar(v.blood_sugar_mg_dl));
  if (v.respiratory_rate != null)        scores.push(scoreRespiratoryRate(v.respiratory_rate));
  if (scores.length === 0) return 100;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

/**
 * Hydration — glasses consumed vs. daily goal.
 * Default goal: 8 glasses (64 oz) if goal is 0 or missing.
 */
function scoreHydration(glasses: number, goal: number): number {
  const effectiveGoal = goal > 0 ? goal : 8;
  return clamp((glasses / effectiveGoal) * 100, 0, 100);
}

/**
 * Sleep duration (hours).
 * Reference: NHS/CDC recommended 7–9 hours for adults.
 *   7–9 hrs  → 100
 *   6–7 hrs  →  80
 *   9–10 hrs →  80   (slightly over — still good)
 *   5–6 hrs  →  60
 *   < 5 or > 10 → 35
 */
function scoreSleep(hours: number): number {
  if (hours >= 7 && hours <= 9)  return 100;
  if (hours >= 6 && hours < 7)   return 80;
  if (hours > 9  && hours <= 10) return 80;
  if (hours >= 5 && hours < 6)   return 60;
  return 35;
}

/**
 * Activity — steps walked vs. daily goal.
 * Default goal: 3 000 steps (elderly-appropriate baseline).
 */
function scoreActivity(steps: number, goal: number): number {
  const effectiveGoal = goal > 0 ? goal : 3000;
  return clamp((steps / effectiveGoal) * 100, 0, 100);
}

/**
 * Mood / mental health.
 * Prefers numeric stress_level (0 = calm → 1 = max stress).
 * Falls back to mood string if stress_level is unavailable.
 */
function scoreMood(stressLevel?: number | null, mood?: string | null): number {
  if (stressLevel != null) {
    return clamp((1 - stressLevel) * 100, 0, 100);
  }
  const m = (mood ?? "").toLowerCase().trim();
  if (["happy", "calm", "stable", "good", "content", "cheerful"].includes(m)) return 100;
  if (["neutral", "okay", "ok", "fine"].includes(m))                          return 75;
  if (["anxious", "sad", "tired", "restless", "low"].includes(m))             return 50;
  if (["distressed", "agitated", "angry", "confused", "depressed"].includes(m)) return 25;
  return 75; // unknown value → treat as neutral
}

// ── Weights ───────────────────────────────────────────────────────────────────

export const WELLBEING_WEIGHTS = {
  medication: 0.25,
  vitals:     0.25,
  hydration:  0.15,
  sleep:      0.15,
  activity:   0.10,
  mood:       0.10,
} as const;

// ── Rating bands ──────────────────────────────────────────────────────────────

export const RATING_BANDS: { min: number; label: WellbeingResult["rating"]; color: string }[] = [
  { min: 90, label: "Excellent",        color: "#5C7F39" },
  { min: 75, label: "Good",             color: "#5C7F39" },
  { min: 60, label: "Fair",             color: "#d97706" },
  { min: 40, label: "Needs Attention",  color: "#dc2626" },
  { min:  0, label: "Critical",         color: "#991b1b" },
];

export function getRatingColor(rating: WellbeingResult["rating"]): string {
  return RATING_BANDS.find((b) => b.label === rating)?.color ?? "#5C7F39";
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Compute the Daily Well-being Score from today's adherence, vitals, and
 * mental health data.
 *
 * @example
 * const result = computeWellbeingScore({
 *   adherence: {
 *     medications_taken: 3, medications_missed: 0,
 *     hydration_glasses: 6, hydration_goal: 8,
 *     steps_walked: 2800,   steps_goal: 3000,
 *     sleep_hours: 7.5,
 *   },
 *   vitals: { heart_rate: 68, blood_pressure_systolic: 118,
 *             blood_sugar_mg_dl: 92, respiratory_rate: 16 },
 *   mentalHealth: { stress_level: 0.15 },
 * });
 * // → { score: 96, rating: "Excellent", breakdown: { ... } }
 */
export function computeWellbeingScore(inputs: WellbeingInputs): WellbeingResult {
  const raw: WellbeingBreakdown = {
    medication: scoreMedication(
      inputs.adherence.medications_taken,
      inputs.adherence.medications_missed,
    ),
    vitals:    scoreVitals(inputs.vitals),
    hydration: scoreHydration(
      inputs.adherence.hydration_glasses,
      inputs.adherence.hydration_goal,
    ),
    sleep:    scoreSleep(inputs.adherence.sleep_hours),
    activity: scoreActivity(
      inputs.adherence.steps_walked,
      inputs.adherence.steps_goal,
    ),
    mood: scoreMood(inputs.mentalHealth.stress_level, inputs.mentalHealth.mood),
  };

  const composite =
    raw.medication * WELLBEING_WEIGHTS.medication +
    raw.vitals     * WELLBEING_WEIGHTS.vitals     +
    raw.hydration  * WELLBEING_WEIGHTS.hydration  +
    raw.sleep      * WELLBEING_WEIGHTS.sleep      +
    raw.activity   * WELLBEING_WEIGHTS.activity   +
    raw.mood       * WELLBEING_WEIGHTS.mood;

  const score = Math.round(clamp(composite, 0, 100));

  const rating: WellbeingResult["rating"] =
    score >= 90 ? "Excellent"       :
    score >= 75 ? "Good"            :
    score >= 60 ? "Fair"            :
    score >= 40 ? "Needs Attention" :
                  "Critical";

  return {
    score,
    rating,
    breakdown: {
      medication: Math.round(raw.medication),
      vitals:     Math.round(raw.vitals),
      hydration:  Math.round(raw.hydration),
      sleep:      Math.round(raw.sleep),
      activity:   Math.round(raw.activity),
      mood:       Math.round(raw.mood),
    },
  };
}

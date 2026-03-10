"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type PageContextPayload = {
  dashboard_name: string;
  page_title: string;
  page_route: string;
  page_terms: string[];
  page_snippets: string[];
  page_kv: Record<string, string>;
};

type AssignedPatient = {
  patient_id: number;
  patient_name?: string | null;
  patient_dob?: string | null;
  patient_gender?: string | null;
  facility_name?: string | null;
  chronic_conditions?: string | null;
  medications?: string[] | null;
  active_alerts?: number | null;
  latest_alert?: string | null;
  latest_risk_score?: number | string | null;
  next_appointment?: {
    provider_name?: string | null;
    appointment_type?: string | null;
    start_time?: string | null;
  } | null;
};

type CaregiverAssistResponse = {
  status?: string;
  alert_id?: number;
  patient_id?: number;
  patient_name?: string;
  notified_count?: number;
  on_duty_count?: number;
  caregivers_notified?: Array<{
    user_id?: number;
    name?: string;
    duty_status?: string;
    current_shift?: string;
  }>;
};

type CaregiverAssistResult =
  | { ok: true; data: CaregiverAssistResponse }
  | { ok: false; code?: number; detail: string };

type ApiVital = {
  patient_id: number;
  event_time?: string | null;
  recorded_time?: string | null;
  heart_rate?: number | string | null;
  blood_pressure_systolic?: number | string | null;
  blood_pressure_diastolic?: number | string | null;
  skin_temp?: number | string | null;
  hydration_level?: number | string | null;
};

type ApiAlert = {
  patient_id?: number | null;
  status?: string | null;
  description?: string | null;
  event_time?: string | null;
};

type ApiPatient = {
  patient_id: number;
  first_name?: string | null;
  last_name?: string | null;
  dob?: string | null;
  gender?: string | null;
  facility_name?: string | null;
  chronic_conditions?: string | null;
};

type CaregiverContext = {
  patientId: string;
  patientName: string;
  facilityName: string;
  vitalTimestamp: string | null;
  riskScore: number | null;
  activeAlerts: number;
  latestAlert: string;
  clinicalContext: {
    patient_id: string;
    patient_name?: string;
    facility_name?: string;
    active_alerts?: number;
    latest_alert?: string;
    age?: number;
    conditions: string[];
    current_vitals: Record<string, number>;
    recent_alerts: string[];
    medications: string[];
  };
  snapshot: {
    conditions: string[];
    medications: string[];
    nextAppointment?: string;
  };
  assignedPatients: Array<{
    patientId: string;
    patientName: string;
    facilityName: string;
    activeAlerts: number;
    latestAlert: string;
    riskScore: number | null;
    latestVitalsTime: string | null;
  }>;
};

type TranscriptAlternative = { transcript: string };
type TranscriptResult = ArrayLike<TranscriptAlternative>;
type SpeechRecognitionResultEvent = Event & { results: ArrayLike<TranscriptResult> };

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export function AiAssistantFab() {
  const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);
  const sendInFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const requestAbortRef = useRef<AbortController | null>(null);
  const groundReportPattern =
    /\bground report\b|\bassigned patient\b|\bpatient status\b|\bhow is (the )?patient\b|\bstatus report\b|\bis (the )?patient (fine|okay|ok|stable)\b|\bfrom (the )?(metrics|vitals)\b|\bhow does (the )?senior look\b|\bis (he|she|the senior) good\b|\bneed my assistance\b/i;
  const multiPatientPattern =
    /\bmy patients\b|\ball patients\b|\bassigned patients\b|\bpatients status\b|\bstatus of (all|my) patients\b|\bhow(?:'| a)?re my patients\b/i;

  const normalizeLine = (value: string): string =>
    value.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();

  const messageId = () =>
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const makeMessage = (role: ChatMessage["role"], content: string): ChatMessage => ({
    id: messageId(),
    role,
    content,
  });

  const appendMessage = (role: ChatMessage["role"], content: string) => {
    setMessages((prev) => [...prev, makeMessage(role, content)]);
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      requestAbortRef.current?.abort();
      requestAbortRef.current = null;
      recognitionRef.current?.stop();
      if (typeof window !== "undefined") {
        window.speechSynthesis?.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const node = messageListRef.current;
    if (!node) {
      return;
    }
    const frameId = window.requestAnimationFrame(() => {
      node.scrollTop = node.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [messages, isOpen, isLoading, error]);

  const collectPageContext = (dashboardName: string): PageContextPayload | null => {
    if (typeof window === "undefined") {
      return null;
    }
    const mainRoot = document.querySelector("main") || document.body;
    if (!mainRoot) {
      return null;
    }
    const aiRoot = document.querySelector("[data-betti-ai-root='true']");
    const skip = new Set(["AI", "X", "Mic", "Stop", "Send", "Read aloud"]);
    const seen = new Set<string>();

    const isVisible = (element: Element): boolean => {
      const htmlEl = element as HTMLElement;
      const style = window.getComputedStyle(htmlEl);
      return style.display !== "none" && style.visibility !== "hidden";
    };

    const terms: string[] = [];
    for (const node of Array.from(mainRoot.querySelectorAll("h1,h2,h3,h4,label,th"))) {
      if (aiRoot && aiRoot.contains(node)) {
        continue;
      }
      if (!isVisible(node)) {
        continue;
      }
      const text = normalizeLine((node as HTMLElement).innerText || node.textContent || "");
      if (text.length < 3 || text.length > 90 || skip.has(text)) {
        continue;
      }
      if (!seen.has(text)) {
        seen.add(text);
        terms.push(text);
      }
      if (terms.length >= 50) {
        break;
      }
    }

    const isLeafTextNode = (node: Element): boolean => {
      const tag = node.tagName.toLowerCase();
      if (tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4") {
        return true;
      }
      return node.childElementCount === 0;
    };

    const snippets: string[] = [];
    for (const node of Array.from(mainRoot.querySelectorAll("h1,h2,h3,h4,p,li,label,th,td,dt,dd,button,span,div"))) {
      if (aiRoot && aiRoot.contains(node)) {
        continue;
      }
      if (!isVisible(node)) {
        continue;
      }
      if (!isLeafTextNode(node)) {
        continue;
      }
      const text = normalizeLine((node as HTMLElement).innerText || node.textContent || "");
      if (text.length < 4 || text.length > 140 || skip.has(text)) {
        continue;
      }
      if (text.toLowerCase().includes("betti ai assistant")) {
        continue;
      }
      if (!seen.has(text)) {
        seen.add(text);
        snippets.push(text);
      }
      if (snippets.length >= 120) {
        break;
      }
    }

    const pageKv: Record<string, string> = {};
    const addPageKv = (rawKey: string, rawValue: string) => {
      const key = normalizeLine(rawKey).replace(/\s*:\s*.*$/, "");
      const value = normalizeLine(rawValue);
      if (!key || !value || key.length > 64 || value.length > 120) {
        return;
      }
      if (!(key in pageKv)) {
        pageKv[key] = value;
      }
    };
    for (const line of snippets) {
      const idx = line.indexOf(":");
      if (idx <= 1 || idx >= 55) {
        continue;
      }
      const key = normalizeLine(line.slice(0, idx));
      const value = normalizeLine(line.slice(idx + 1));
      if (!key || !value || key.length > 48 || value.length > 100) {
        continue;
      }
      addPageKv(key, value);
      if (Object.keys(pageKv).length >= 40) {
        break;
      }
    }

    const resolveLabel = (node: HTMLElement): string => {
      const id = node.id || "";
      if (id) {
        const label = mainRoot.querySelector(`label[for="${id}"]`);
        const labelText = normalizeLine((label as HTMLElement | null)?.innerText || label?.textContent || "");
        if (labelText) {
          return labelText;
        }
      }
      const aria = normalizeLine(node.getAttribute("aria-label") || "");
      if (aria) {
        return aria;
      }
      const nameAttr = normalizeLine(node.getAttribute("name") || "");
      if (nameAttr) {
        return nameAttr.replace(/[_-]+/g, " ");
      }
      return "";
    };

    for (const node of Array.from(mainRoot.querySelectorAll("input,select,textarea"))) {
      if (aiRoot && aiRoot.contains(node)) {
        continue;
      }
      if (!isVisible(node)) {
        continue;
      }
      const element = node as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
      const label = resolveLabel(element);
      if (!label) {
        continue;
      }
      if (element instanceof HTMLInputElement && (element.type === "hidden" || element.type === "password")) {
        continue;
      }

      let value = "";
      if (element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio")) {
        value = element.checked ? "Enabled" : "Disabled";
      } else if (element instanceof HTMLSelectElement) {
        value = normalizeLine(element.selectedOptions?.[0]?.textContent || element.value || "");
      } else {
        value = normalizeLine((element as HTMLInputElement | HTMLTextAreaElement).value || "");
      }
      if (!value) {
        continue;
      }
      addPageKv(label, value);
      if (Object.keys(pageKv).length >= 60) {
        break;
      }
    }

    const pageTitle =
      terms[0] || normalizeLine(document.title || "") || `${dashboardName} page`;

    return {
      dashboard_name: dashboardName,
      page_title: pageTitle,
      page_route: window.location.pathname,
      page_terms: terms.slice(0, 40),
      page_snippets: snippets.slice(0, 80),
      page_kv: pageKv,
    };
  };

  const toArray = <T,>(payload: unknown): T[] => {
    if (Array.isArray(payload)) {
      return payload as T[];
    }
    if (payload && typeof payload === "object") {
      const objectPayload = payload as { value?: unknown; items?: unknown; data?: unknown };
      if (Array.isArray(objectPayload.value)) {
        return objectPayload.value as T[];
      }
      if (Array.isArray(objectPayload.items)) {
        return objectPayload.items as T[];
      }
      if (Array.isArray(objectPayload.data)) {
        return objectPayload.data as T[];
      }
    }
    return [];
  };

  const toNumber = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
    return null;
  };

  const toTimestamp = (value?: string | null): number => {
    if (!value) {
      return 0;
    }
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const computeAge = (dob?: string | null): number | undefined => {
    if (!dob) {
      return undefined;
    }
    const birthDate = new Date(dob);
    if (Number.isNaN(birthDate.getTime())) {
      return undefined;
    }
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age >= 0 ? age : undefined;
  };

  const decodeJwtSub = (token?: string | null): number | null => {
    if (!token) {
      return null;
    }
    try {
      const payloadPart = token.split(".")[1];
      if (!payloadPart) {
        return null;
      }
      const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
      const decoded = atob(padded);
      const parsed = JSON.parse(decoded) as { sub?: unknown };
      const sub = Number(parsed?.sub);
      return Number.isFinite(sub) && sub > 0 ? sub : null;
    } catch {
      return null;
    }
  };

  const formatTimestamp = (timestamp?: string | null): string => {
    if (!timestamp) {
      return "";
    }
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleString();
  };

  const parseConditions = (value?: string | null): string[] => {
    if (!value) {
      return [];
    }
    return value
      .split(";")
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
  };

  const isGroundReportQuery = (text: string): boolean => groundReportPattern.test(text);
  const isMultiPatientQuery = (text: string): boolean => multiPatientPattern.test(text);

  const isFallEmergencyMessage = (message: string): boolean => {
    const text = (message || "").trim().toLowerCase();
    if (!text) {
      return false;
    }
    const normalized = text.replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
    const compact = normalized.replace(/\s+/g, "");
    if (
      /(\bi\s+(just\s+)?fell\b|\bi\s+have\s+fallen\b|\bi\s+fell(?:\s+|-)down\b|\bi\s+felldown\b|\bi\s+fall(?:ing)?\s+down\b|\bi\s+slipped\b|\bi\s+tripped\b|\bi\s+(am|m)\s+on\s+the\s+floor\b|\bi\s+can'?t\s+get\s+up\b|\bi\s+hit\s+my\s+head\b)/i.test(
        normalized,
      )
    ) {
      return true;
    }
    return (
      compact.includes("ifelldown") ||
      compact.includes("ifell") ||
      compact.includes("ihavefallen") ||
      compact.includes("islipped") ||
      compact.includes("itripped")
    );
  };

  const fallPrecautionMessage =
    "Immediate precautions: Do not stand up quickly. Take slow breaths. Check for bleeding or severe pain. If movement increases pain, stay still and wait for help. Call your caregiver or EMS now if needed.";

  const buildAuthHeaders = (): { token: string; headers: Record<string, string> } | null => {
    if (typeof window === "undefined") {
      return null;
    }
    const params = new URLSearchParams(window.location.search);
    const token = localStorage.getItem("betti_token") || params.get("betti_token") || params.get("token") || "";
    if (!token) {
      return null;
    }
    return { token, headers: { Authorization: `Bearer ${token}` } };
  };

  const requestCaregiverAssist = async (
    note: string,
    patientId?: number,
  ): Promise<CaregiverAssistResult> => {
    const auth = buildAuthHeaders();
    if (!auth) {
      return {
        ok: false,
        code: 401,
        detail: "Login session not found. Please sign in again to notify caregiver.",
      };
    }
    const response = await fetch(`${apiUrl}/api/alerts/request-caregiver-assist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({
        patient_id: patientId,
        note,
      }),
    });
    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { detail?: unknown; message?: unknown };
      const detail =
        (typeof payload.detail === "string" && payload.detail) ||
        (typeof payload.message === "string" && payload.message) ||
        "Unable to notify caregiver right now.";
      return {
        ok: false,
        code: response.status,
        detail,
      };
    }
    const data = (await response.json().catch(() => null)) as CaregiverAssistResponse | null;
    if (!data) {
      return {
        ok: false,
        code: 500,
        detail: "Caregiver assist request did not return a valid response.",
      };
    }
    return { ok: true, data };
  };

  const formatFallAssistMessage = (result: CaregiverAssistResponse, fallbackPatientName: string): string => {
    const patientName = normalizeLine(String(result?.patient_name || fallbackPatientName || "you"));
    const notified = Number(result?.notified_count || 0);
    const onDuty = Number(result?.on_duty_count || 0);
    const primary = (result?.caregivers_notified || []).find((entry) => entry?.name) || null;
    const caregiverName = normalizeLine(String(primary?.name || ""));
    const shift = normalizeLine(String(primary?.current_shift || ""));
    if (notified > 0 && caregiverName) {
      return `${caregiverName} has been notified that ${patientName} may have fallen and needs an immediate safety check.${shift ? ` Shift: ${shift}.` : ""}`;
    }
    if (notified > 0) {
      return `Your on-duty caregiver team has been notified that ${patientName} may have fallen and needs an immediate safety check.`;
    }
    if (onDuty > 0) {
      return `I created a fall alert for ${patientName}. Care team notification is in progress.`;
    }
    return `I created a fall alert for ${patientName}. No on-duty caregiver was detected, so the request is queued for the care team.`;
  };

  const formatCaregiverAssistFailure = (result: CaregiverAssistResult): string => {
    if (result.ok) {
      return "";
    }
    const detail = normalizeLine(result.detail || "");
    if (result.code === 401 || result.code === 403) {
      return "I could not notify your caregiver because your login session is missing or expired. Please sign in again.";
    }
    if (result.code === 404) {
      return "I could not notify caregiver because this account has no linked patient. Please ask admin to link your profile.";
    }
    if (detail) {
      return `I could not notify caregiver right now: ${detail}`;
    }
    return "I could not notify caregiver right now. Please retry in a few seconds.";
  };

  const getRiskLabel = (score: number | null): string => {
    if (score === null) {
      return "unknown";
    }
    if (score >= 0.7) {
      return "high";
    }
    if (score >= 0.4) {
      return "moderate";
    }
    return "low";
  };

  const buildCaregiverContext = async (): Promise<CaregiverContext | null> => {
    try {
      if (typeof window === "undefined") {
        return null;
      }
      const token = localStorage.getItem("betti_token");
      let userId = localStorage.getItem("betti_user_id");
      const sub = decodeJwtSub(token);
      if (sub) {
        userId = String(sub);
        localStorage.setItem("betti_user_id", userId);
      }
      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      let assignedPatient: AssignedPatient | null = null;
      let assignedPatients: AssignedPatient[] = [];
      if (userId) {
        const assignedUrls = [
          `${apiUrl}/api/users/${userId}/assigned-patients?active_only=true`,
          `${apiUrl}/api/users/${userId}/assigned-patients?active_only=true&home_only=false`,
          `${apiUrl}/api/users/${userId}/assigned-patients?active_only=false&home_only=false`,
        ];

        for (const url of assignedUrls) {
          const assignedRes = await fetch(url, { headers });
          if (!assignedRes.ok) {
            continue;
          }
          const assignedRows = toArray<AssignedPatient>(await assignedRes.json());
          if (assignedRows.length > 0 && typeof assignedRows[0]?.patient_id === "number") {
            assignedPatients = assignedRows.filter(
              (row) => typeof row?.patient_id === "number",
            );
            assignedPatient = assignedRows[0];
            break;
          }
        }
      }

      let vitalsRows: ApiVital[] = [];
      let alertsRows: ApiAlert[] = [];

      if (!assignedPatient) {
        // Fallback for unassigned caregiver test accounts: pick the most relevant live patient from telemetry.
        const [patientsResResult, vitalsResResult, alertsResResult] = await Promise.allSettled([
          fetch(`${apiUrl}/api/patients?home_only=false`, { headers }),
          fetch(`${apiUrl}/api/vitals`, { headers }),
          fetch(`${apiUrl}/api/alerts?limit=50`, { headers }),
        ]);
        const patientsRows =
          patientsResResult.status === "fulfilled" && patientsResResult.value.ok
            ? toArray<ApiPatient>(await patientsResResult.value.json().catch(() => []))
            : [];
        vitalsRows =
          vitalsResResult.status === "fulfilled" && vitalsResResult.value.ok
            ? toArray<ApiVital>(await vitalsResResult.value.json().catch(() => []))
            : [];
        alertsRows =
          alertsResResult.status === "fulfilled" && alertsResResult.value.ok
            ? toArray<ApiAlert>(await alertsResResult.value.json().catch(() => []))
            : [];

        const activeAlerts = alertsRows
          .filter(
            (alert) =>
              typeof alert.patient_id === "number" &&
              (alert.status || "").toLowerCase() === "active",
          )
          .sort((a, b) => toTimestamp(b.event_time) - toTimestamp(a.event_time));

        const latestVitals = [...vitalsRows].sort((a, b) => {
          const aTime = toTimestamp(a.recorded_time || a.event_time || null);
          const bTime = toTimestamp(b.recorded_time || b.event_time || null);
          return bTime - aTime;
        });

        const candidatePatientId =
          latestVitals.find((vital) => typeof vital.patient_id === "number")?.patient_id ??
          activeAlerts.find((alert) => typeof alert.patient_id === "number")?.patient_id ??
          patientsRows.find((patient) => typeof patient.patient_id === "number")?.patient_id ??
          null;

        if (!candidatePatientId) {
          return null;
        }

        const patient = patientsRows.find((row) => row.patient_id === candidatePatientId) || null;
        const patientName = patient
          ? `${patient.first_name || ""} ${patient.last_name || ""}`.trim()
          : "";

        assignedPatient = {
          patient_id: candidatePatientId,
          patient_name: patientName || `Patient #${candidatePatientId}`,
          patient_dob: patient?.dob ?? null,
          patient_gender: patient?.gender ?? null,
          facility_name: patient?.facility_name ?? "Monitored Home",
          chronic_conditions: patient?.chronic_conditions ?? null,
          medications: [],
        };
        assignedPatients = [assignedPatient];
      }

      if (!assignedPatient || typeof assignedPatient.patient_id !== "number") {
        return null;
      }

      if (vitalsRows.length === 0 && alertsRows.length === 0) {
        const [vitalsResResult, alertsResResult] = await Promise.allSettled([
          fetch(`${apiUrl}/api/vitals`, { headers }),
          fetch(`${apiUrl}/api/alerts?limit=50`, { headers }),
        ]);

        vitalsRows =
          vitalsResResult.status === "fulfilled" && vitalsResResult.value.ok
            ? toArray<ApiVital>(await vitalsResResult.value.json().catch(() => []))
            : [];
        alertsRows =
          alertsResResult.status === "fulfilled" && alertsResResult.value.ok
            ? toArray<ApiAlert>(await alertsResResult.value.json().catch(() => []))
            : [];
      }

      const patientVital = vitalsRows.find((row) => row.patient_id === assignedPatient.patient_id) || null;
      const heartRate = toNumber(patientVital?.heart_rate);
      const systolic = toNumber(patientVital?.blood_pressure_systolic);
      const diastolic = toNumber(patientVital?.blood_pressure_diastolic);
      const skinTemp = toNumber(patientVital?.skin_temp);
      const hydrationRaw = toNumber(patientVital?.hydration_level);
      const hydration =
        hydrationRaw === null ? null : hydrationRaw <= 1 ? hydrationRaw * 100 : hydrationRaw;

      const currentVitals: Record<string, number> = {};
      if (heartRate !== null) {
        currentVitals.heart_rate = Number(heartRate.toFixed(1));
      }
      if (systolic !== null) {
        currentVitals.blood_pressure_systolic = Number(systolic.toFixed(1));
      }
      if (diastolic !== null) {
        currentVitals.blood_pressure_diastolic = Number(diastolic.toFixed(1));
      }
      if (skinTemp !== null) {
        currentVitals.skin_temp_f = Number(skinTemp.toFixed(1));
      }
      if (hydration !== null) {
        currentVitals.hydration_level_percent = Number(hydration.toFixed(1));
      }

      const recentPatientAlerts = alertsRows
        .filter(
          (alert) =>
            alert.patient_id === assignedPatient.patient_id &&
            (alert.status || "").toLowerCase() === "active",
        )
        .sort((a, b) => toTimestamp(b.event_time) - toTimestamp(a.event_time))
        .map((alert) => alert.description?.trim())
        .filter((value): value is string => Boolean(value))
        .filter((value, index, all) => all.indexOf(value) === index)
        .slice(0, 3);

      const medications =
        (assignedPatient.medications || [])
          .map((medication) => medication.trim())
          .filter((medication) => medication.length > 0) || [];
      const conditions = parseConditions(assignedPatient.chronic_conditions);
      const nextAppointment = assignedPatient.next_appointment?.start_time
        ? `${assignedPatient.next_appointment.provider_name || "Provider"} (${assignedPatient.next_appointment.appointment_type || "visit"}) on ${formatTimestamp(assignedPatient.next_appointment.start_time)}`
        : undefined;

      const assignedPatientSummaries = (assignedPatients.length > 0 ? assignedPatients : [assignedPatient]).map(
        (row) => {
          const patientId = Number(row.patient_id);
          const rowVitals = vitalsRows.find((vital) => vital.patient_id === patientId) || null;
          const rowAlerts = alertsRows
            .filter(
              (alert) =>
                alert.patient_id === patientId &&
                (alert.status || "").toLowerCase() === "active",
            )
            .sort((a, b) => toTimestamp(b.event_time) - toTimestamp(a.event_time));
          const latestAlert = row.latest_alert?.trim() || rowAlerts[0]?.description?.trim() || "None";
          const activeAlerts = Number(row.active_alerts || rowAlerts.length || 0);
          return {
            patientId: String(patientId),
            patientName: row.patient_name?.trim() || `Patient #${patientId}`,
            facilityName: row.facility_name?.trim() || "Assigned Home",
            activeAlerts,
            latestAlert,
            riskScore: toNumber(row.latest_risk_score),
            latestVitalsTime: rowVitals?.recorded_time ?? rowVitals?.event_time ?? null,
          };
        },
      );

      return {
        patientId: String(assignedPatient.patient_id),
        patientName: assignedPatient.patient_name?.trim() || `Patient #${assignedPatient.patient_id}`,
        facilityName: assignedPatient.facility_name?.trim() || "Assigned Home",
        vitalTimestamp: patientVital?.recorded_time ?? patientVital?.event_time ?? null,
        riskScore: toNumber(assignedPatient.latest_risk_score),
        activeAlerts: Number(assignedPatient.active_alerts || recentPatientAlerts.length || 0),
        latestAlert: assignedPatient.latest_alert?.trim() || recentPatientAlerts[0] || "None",
        clinicalContext: {
          patient_id: String(assignedPatient.patient_id),
          patient_name: assignedPatient.patient_name?.trim() || `Patient #${assignedPatient.patient_id}`,
          facility_name: assignedPatient.facility_name?.trim() || "Assigned Home",
          active_alerts: Number(assignedPatient.active_alerts || recentPatientAlerts.length || 0),
          latest_alert: assignedPatient.latest_alert?.trim() || recentPatientAlerts[0] || "None",
          age: computeAge(assignedPatient.patient_dob),
          conditions,
          current_vitals: currentVitals,
          recent_alerts: recentPatientAlerts,
          medications,
        },
        snapshot: {
          conditions,
          medications,
          nextAppointment,
        },
        assignedPatients: assignedPatientSummaries,
      };
    } catch {
      return null;
    }
  };

  const formatGroundReport = (context: CaregiverContext): string => {
    const vitals = context.clinicalContext.current_vitals;
    const lines: string[] = [];
    const atTime = formatTimestamp(context.vitalTimestamp);
    const riskLabel = getRiskLabel(context.riskScore);

    lines.push(`Ground report for assigned patient ${context.patientName} (ID ${context.patientId})`);
    lines.push(`Location: ${context.facilityName}`);
    lines.push(
      `Current risk: ${riskLabel.toUpperCase()}${context.riskScore !== null ? ` (score ${context.riskScore.toFixed(2)})` : ""}`,
    );

    const vitalParts: string[] = [];
    if (vitals.heart_rate !== undefined) {
      vitalParts.push(`HR ${vitals.heart_rate} bpm`);
    }
    if (
      vitals.blood_pressure_systolic !== undefined &&
      vitals.blood_pressure_diastolic !== undefined
    ) {
      vitalParts.push(
        `BP ${vitals.blood_pressure_systolic}/${vitals.blood_pressure_diastolic} mmHg`,
      );
    }
    if (vitals.skin_temp_f !== undefined) {
      vitalParts.push(`Temp ${vitals.skin_temp_f} F`);
    }
    if (vitals.hydration_level_percent !== undefined) {
      vitalParts.push(`Hydration ${vitals.hydration_level_percent}%`);
    }
    lines.push(
      `Latest vitals${atTime ? ` at ${atTime}` : ""}: ${vitalParts.length > 0 ? vitalParts.join(", ") : "not available"}`,
    );

    if (context.snapshot.conditions.length > 0) {
      lines.push(`Chronic conditions: ${context.snapshot.conditions.join("; ")}`);
    }
    if (context.snapshot.medications.length > 0) {
      lines.push(`Medications: ${context.snapshot.medications.slice(0, 3).join("; ")}`);
    }
    if (context.activeAlerts > 0) {
      lines.push(`Active alerts: ${context.activeAlerts} (${context.latestAlert})`);
      lines.push("Immediate caregiver action: perform in-person safety check and acknowledge/escalate if symptoms worsen.");
    } else {
      lines.push("Active alerts: none at this moment.");
    }
    if (context.snapshot.nextAppointment) {
      lines.push(`Next appointment: ${context.snapshot.nextAppointment}`);
    }
    return lines.join("\n");
  };

  const formatMultiPatientReport = (context: CaregiverContext): string => {
    const rows = context.assignedPatients || [];
    if (rows.length === 0) {
      return "No assigned patients found in this caregiver session.";
    }
    const lines: string[] = [];
    lines.push(`You have ${rows.length} assigned patients on this shift:`);
    rows.slice(0, 5).forEach((row, index) => {
      const riskLabel = getRiskLabel(row.riskScore).toUpperCase();
      const vitalsAt = formatTimestamp(row.latestVitalsTime);
      const vitalsText = vitalsAt ? `latest vitals ${vitalsAt}` : "vitals pending";
      lines.push(
        `${index + 1}. ${row.patientName} (ID ${row.patientId}) - ${row.facilityName}; risk ${riskLabel}${
          row.riskScore !== null ? ` (${row.riskScore.toFixed(2)})` : ""
        }; active alerts ${row.activeAlerts}; latest alert: ${row.latestAlert}; ${vitalsText}.`,
      );
    });
    if (rows.length > 5) {
      lines.push(`...and ${rows.length - 5} more assigned patients.`);
    }
    lines.push("This is a non-diagnostic operational snapshot.");
    return lines.join("\n");
  };

  const speechSupported = useMemo(
    () =>
      typeof window !== "undefined" &&
      (Boolean(window.SpeechRecognition) || Boolean(window.webkitSpeechRecognition)),
    [],
  );

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const normalizeAssistantMessage = (raw: string | undefined): string => {
    if (!raw) {
      return "I could not generate a response.";
    }
    const trimmed = raw.trim();
    if (!(trimmed.startsWith("{") && trimmed.endsWith("}"))) {
      return raw;
    }
    try {
      const parsed = JSON.parse(trimmed) as { response?: unknown; message?: unknown };
      if (typeof parsed.response === "string" && parsed.response.trim()) {
        return parsed.response.trim();
      }
      if (typeof parsed.message === "string" && parsed.message.trim()) {
        return parsed.message.trim();
      }
    } catch {
      return raw;
    }
    return raw;
  };

  const shouldRetryCompanionRequest = (status: number, detail: string): boolean => {
    if (status === 429 || status === 503 || status === 504) {
      return true;
    }
    const text = normalizeLine(detail).toLowerCase();
    return (
      text.includes("temporary") ||
      text.includes("high demand") ||
      text.includes("timeout") ||
      text.includes("retry")
    );
  };

  const isQuickGeneralPrompt = (message: string): boolean => {
    const raw = (message || "").trim().toLowerCase();
    if (!raw) {
      return false;
    }
    const normalized = raw.replace(/[’']/g, "");
    const exactMatches = new Set([
      "hi",
      "hello",
      "hey",
      "thanks",
      "thank you",
      "good morning",
      "good afternoon",
      "good evening",
      "how are you",
      "howre you",
      "hru",
      "who are you",
      "what can you do",
      "help",
      "ok",
      "okay",
    ]);
    if (exactMatches.has(raw) || exactMatches.has(normalized)) {
      return true;
    }
    const quickStarts = ["hi ", "hello ", "hey ", "thanks ", "thank you ", "how are you", "howre you", "can you help"];
    return quickStarts.some((prefix) => raw.startsWith(prefix) || normalized.startsWith(prefix));
  };

  const buildQuickGeneralResponse = (message: string): string => {
    const text = (message || "").trim().toLowerCase();
    if (!text) {
      return "I am here with you. What do you need help with right now?";
    }
    if (text.includes("how are you") || text.includes("how're you") || text.includes("howre you") || text === "hru") {
      return "I am ready to help. Would you like a patient status summary, alert overview, or reminder support?";
    }
    return "I hear you. What would you like help with: patient status, alerts, reminders, or caregiver actions?";
  };

  const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sendInFlightRef.current || isLoading) {
      return;
    }
    sendInFlightRef.current = true;
    setIsLoading(true);
    setIsRetrying(false);
    setError("");
    appendMessage("user", trimmed);
    setInput("");

    if (isQuickGeneralPrompt(trimmed)) {
      appendMessage("assistant", buildQuickGeneralResponse(trimmed));
      sendInFlightRef.current = false;
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();
    requestAbortRef.current?.abort();
    requestAbortRef.current = abortController;
    const timeoutId = window.setTimeout(() => abortController.abort(), 60000);

    try {
      const pageContext = collectPageContext("caregiver-dashboard");
      const caregiverContext = await buildCaregiverContext();
      const fallEmergency = isFallEmergencyMessage(trimmed);
      if (fallEmergency) {
        const assistNote = `Possible fall reported via AI chat: ${trimmed}`;
        const patientId = caregiverContext?.patientId ? Number(caregiverContext.patientId) : undefined;
        const assistResult = await requestCaregiverAssist(assistNote, Number.isFinite(patientId || NaN) ? patientId : undefined);
        if (assistResult.ok) {
          const assistMessage = `${formatFallAssistMessage(assistResult.data, caregiverContext?.patientName || "you")} ${fallPrecautionMessage}`;
          appendMessage("assistant", assistMessage);
          return;
        }
        const assistError = `${formatCaregiverAssistFailure(assistResult)} ${fallPrecautionMessage}`;
        appendMessage("assistant", assistError);
        return;
      }
      const multiPatientRequested = isMultiPatientQuery(trimmed);
      const groundReportRequested = isGroundReportQuery(trimmed);
      if (!caregiverContext && /\b(metric|metrics|vital|vitals|patient|senior)\b/i.test(trimmed)) {
        appendMessage(
          "assistant",
          "Live metrics are temporarily unavailable in this session. Reopen the dashboard once and retry.",
        );
        return;
      }

      if (caregiverContext && multiPatientRequested) {
        appendMessage("assistant", formatMultiPatientReport(caregiverContext));
        return;
      }

      let contextualMessage = trimmed;
      const detailedTelemetryRequested = groundReportRequested;
      if (caregiverContext) {
        if (detailedTelemetryRequested) {
          contextualMessage = [
            "Caregiver request for a live ground report.",
            "Use the live context below and respond in a concise non-diagnostic operational summary.",
            "",
            formatGroundReport(caregiverContext),
            "",
            `Caregiver question: ${trimmed}`,
            "Include: status, key vitals interpretation, active alerts, and immediate next actions.",
          ].join("\n");
        } else {
          contextualMessage = `Caregiver question: ${trimmed}`;
        }
      }

      const auth = buildAuthHeaders();
      const contextualClinical = caregiverContext?.clinicalContext
        ? {
            ...caregiverContext.clinicalContext,
            current_vitals: detailedTelemetryRequested ? caregiverContext.clinicalContext.current_vitals : {},
            recent_alerts: detailedTelemetryRequested ? caregiverContext.clinicalContext.recent_alerts : [],
          }
        : {
            conditions: [],
            recent_alerts: [],
            medications: [],
            current_vitals: {},
          };

      const requestBody = {
        conversation_id: conversationId,
        message: contextualMessage,
        patient_id: caregiverContext?.patientId,
        clinical_context:
          contextualClinical || pageContext
            ? {
                ...contextualClinical,
                ...(pageContext || {}),
                ui_context: pageContext
                  ? {
                      ...pageContext,
                      requester_role: "caregiver",
                      user_role: "caregiver",
                      account_role: "caregiver",
                    }
                  : {
                      requester_role: "caregiver",
                      user_role: "caregiver",
                      account_role: "caregiver",
                    },
              }
            : undefined,
      };

      let delivered = false;
      for (let attempt = 0; attempt < 2 && !delivered; attempt += 1) {
        const response = await fetch(`${apiUrl}/api/companion/conversation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(auth?.headers || {}),
          },
          signal: abortController.signal,
          body: JSON.stringify(requestBody),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          const detail = String(payload?.detail || "AI request failed");
          const canRetry = attempt === 0 && shouldRetryCompanionRequest(response.status, detail);
          if (canRetry) {
            if (mountedRef.current) {
              setIsRetrying(true);
              setError("Retrying assistant response...");
            }
            await sleep(700);
            continue;
          }
          if (mountedRef.current) {
            setError(detail);
          }
          appendMessage("assistant", "I could not process that request right now. Please retry.");
          return;
        }

        const nextConversationId = payload?.conversation_id || null;
        if (nextConversationId) {
          setConversationId(nextConversationId);
        }
        const assistantMessage = normalizeAssistantMessage(payload?.message?.content);
        appendMessage("assistant", assistantMessage);
        delivered = true;
      }
    } catch (requestError) {
      const isAbort =
        requestError instanceof DOMException && requestError.name === "AbortError";
      const message = isAbort
        ? "The assistant request timed out. Please retry."
        : "Unable to reach Betti Companion service.";
      setError(message);
      appendMessage("assistant", message);
    } finally {
      window.clearTimeout(timeoutId);
      if (requestAbortRef.current === abortController) {
        requestAbortRef.current = null;
      }
      sendInFlightRef.current = false;
      if (mountedRef.current) {
        setIsRetrying(false);
        setIsLoading(false);
      }
    }
  };

  const toggleVoiceInput = () => {
    if (!speechSupported || isLoading) {
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not available in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      const transcript = event?.results?.[0]?.[0]?.transcript || "";
      setInput(transcript);
    };
    recognition.onerror = () => {
      setError("Speech recognition failed. Try typing your message.");
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      setError("Microphone could not start. Please type your message.");
      setIsListening(false);
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await sendMessage(input);
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className="fixed bottom-6 right-6 z-50 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-lg transition hover:opacity-90"
          onClick={() => setIsOpen(true)}
          aria-label="Open Betti AI"
        >
          AI
        </button>
      )}

      {isOpen && (
        <div
          data-betti-ai-root="true"
          className="fixed bottom-24 right-6 z-50 flex h-[420px] w-[350px] flex-col rounded-xl border bg-background shadow-2xl"
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div>
              <h3 className="text-sm font-semibold">Betti AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Chat, voice input, and read-aloud replies</p>
            </div>
            <button
              type="button"
              className="rounded p-1 text-muted-foreground hover:bg-muted"
              onClick={() => setIsOpen(false)}
              aria-label="Close Betti AI"
            >
              X
            </button>
          </div>

          <div ref={messageListRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.length === 0 && (
              <div className="rounded-lg border border-dashed p-3 text-xs text-muted-foreground">
                Ask Betti AI about alerts, patient safety, or workflow guidance.
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-lg px-3 py-2 text-sm ${
                  message.role === "user"
                    ? "ml-8 bg-primary text-primary-foreground"
                    : "mr-8 bg-muted text-foreground"
                }`}
              >
                <div>{message.content}</div>
                {message.role === "assistant" && (
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => speakText(message.content)}
                  >
                    Read aloud
                  </button>
                )}
              </div>
            ))}
          </div>

          {(error || isRetrying) && (
            <div className="px-3 pb-2 text-xs text-destructive">
              {isRetrying ? "Retrying..." : error}
            </div>
          )}

          <form onSubmit={onSubmit} className="border-t p-3">
            <div className="flex items-center gap-2">
              <input
                className="h-9 flex-1 rounded-md border bg-background px-3 text-sm outline-none"
                placeholder="Ask Betti AI..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    if (!isLoading && input.trim()) {
                      void sendMessage(input);
                    }
                  }
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                className="rounded-md border p-2 hover:bg-muted disabled:opacity-50"
                onClick={toggleVoiceInput}
                disabled={!speechSupported || isLoading}
                aria-label="Voice input"
              >
                {isListening ? "Stop" : "Mic"}
              </button>
              <button
                type="submit"
                className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

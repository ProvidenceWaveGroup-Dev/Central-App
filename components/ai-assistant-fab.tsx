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
  const requestAbortRef = useRef<AbortController | null>(null);
  const sendInFlightRef = useRef(false);
  const messageCounterRef = useRef(0);

  const makeMessage = (role: ChatMessage["role"], content: string): ChatMessage => ({
    id: `msg-${Date.now()}-${messageCounterRef.current++}`,
    role,
    content,
  });

  const appendMessage = (role: ChatMessage["role"], content: string) => {
    setMessages((prev) => [...prev, makeMessage(role, content)]);
  };

  useEffect(() => {
    if (!isOpen || !messageListRef.current) {
      return;
    }
    const el = messageListRef.current;
    const frameId = window.requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [messages, isOpen]);

  useEffect(() => {
    return () => {
      requestAbortRef.current?.abort();
      requestAbortRef.current = null;
      recognitionRef.current?.stop();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const normalizeLine = (value: string): string =>
    value.replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();

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
      const key = label.replace(/[_-]+/g, " ");
      addPageKv(key, value);
      if (Object.keys(pageKv).length >= 60) {
        break;
      }
    }

    const pageTitle = terms[0] || normalizeLine(document.title || "") || `${dashboardName} page`;

    return {
      dashboard_name: dashboardName,
      page_title: pageTitle,
      page_route: window.location.pathname,
      page_terms: terms.slice(0, 40),
      page_snippets: snippets.slice(0, 80),
      page_kv: pageKv,
    };
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

  const buildAuthHeaders = (): { token: string; headers: Record<string, string> } | null => {
    if (typeof window === "undefined") {
      return null;
    }
    const params = new URLSearchParams(window.location.search);
    const token = localStorage.getItem("betti_token") || params.get("betti_token") || params.get("token") || "";
    let userId = localStorage.getItem("betti_user_id") || params.get("betti_user_id") || params.get("user_id") || "";
    if (token && !localStorage.getItem("betti_token")) {
      localStorage.setItem("betti_token", token);
    }
    const sub = decodeJwtSub(token);
    if (sub) {
      userId = String(sub);
      localStorage.setItem("betti_user_id", userId);
    }
    if (!token) {
      return null;
    }
    return { token, headers: { Authorization: `Bearer ${token}` } };
  };

  const getSessionRole = (): string => {
    if (typeof window === "undefined") {
      return "";
    }
    const params = new URLSearchParams(window.location.search);
    const roleFromStorage = (localStorage.getItem("betti_user_role") || "").trim();
    const roleFromQuery = (params.get("betti_role") || params.get("role") || "").trim();
    const role = roleFromStorage || roleFromQuery;
    return role.toLowerCase();
  };

  const inferDashboardName = (role: string): string => {
    if (typeof window === "undefined") {
      return "shared-dashboard";
    }
    const path = window.location.pathname.toLowerCase();
    if (role) {
      if (role === "admin") return "admin-dashboard";
      if (role === "caregiver") return "caregiver-dashboard";
      if (role === "senior") return "senior-dashboard";
      if (role === "ems") return "ems-dashboard";
      if (role === "fire_service") return "fire-service-dashboard";
      if (role === "security") return "security-dashboard";
      if (role === "facility_operator" || role === "operator") return "operator-dashboard";
    }
    if (path.includes("/admin")) return "admin-dashboard";
    if (path.includes("/caregiver")) return "caregiver-dashboard";
    if (path.includes("/senior")) return "senior-dashboard";
    if (path.includes("/ems")) return "ems-dashboard";
    if (path.includes("/fire")) return "fire-service-dashboard";
    if (path.includes("/security")) return "security-dashboard";
    if (path.includes("/operator")) return "operator-dashboard";
    return "shared-dashboard";
  };

  const isCaretakerPresenceQuestion = (message: string): boolean => {
    const text = (message || "").trim().toLowerCase();
    if (!text) {
      return false;
    }
    const normalized = text.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    const hasCareWord =
      /(caretaker|care taker|caregiver|care giver|care team|carer)/i.test(normalized) ||
      /\bcare\s+t[a-z]{2,7}r\b/i.test(normalized);
    if (!hasCareWord) {
      return false;
    }
    const assistanceIntent =
      /(need|help|assist|support|come|send|tell|notify|call|ping|reach|contact|want)/i.test(normalized) ||
      /where\s+is\s+my/.test(text) ||
      /ask(?:ing)?\s+for/.test(text);
    const infoOnly =
      /(name|phone|email|number|contact details)/i.test(normalized) &&
      /(what|who|show|give|tell me)/i.test(normalized) &&
      !/(need|help|assist|support|come|send|notify|call|ping|reach|where\s+is\s+my)/i.test(text);
    return assistanceIntent && !infoOnly;
  };

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

  const requestCaregiverAssist = async (note: string): Promise<CaregiverAssistResult> => {
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
      body: JSON.stringify({ note }),
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

  const formatCaregiverAssistMessage = (result: CaregiverAssistResponse): string => {
    const patientName = normalizeLine(String(result?.patient_name || "you"));
    const notified = Number(result?.notified_count || 0);
    const onDuty = Number(result?.on_duty_count || 0);
    const primary = (result?.caregivers_notified || []).find((entry) => entry?.name) || null;
    const caregiverName = normalizeLine(String(primary?.name || ""));
    const shift = normalizeLine(String(primary?.current_shift || ""));
    if (notified > 0 && caregiverName) {
      return `${caregiverName} has been notified that ${patientName} is asking for support.${shift ? ` Shift: ${shift}.` : ""}`;
    }
    if (notified > 0) {
      return `Your on-duty caregiver team has been notified that ${patientName} is asking for support.`;
    }
    if (onDuty > 0) {
      return `I created an assist alert for ${patientName}. Care team notification is in progress.`;
    }
    return `I created an assist alert for ${patientName}. No on-duty caregiver was detected, so the request is queued for the care team.`;
  };

  const formatFallAssistMessage = (result: CaregiverAssistResponse): string => {
    const patientName = normalizeLine(String(result?.patient_name || "you"));
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

  const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

  const sendMessage = async (text: string) => {
    if (sendInFlightRef.current) {
      return;
    }
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    sendInFlightRef.current = true;
    setIsLoading(true);
    setIsRetrying(false);
    setError("");
    appendMessage("user", trimmed);
    setInput("");

    const abortController = new AbortController();
    requestAbortRef.current?.abort();
    requestAbortRef.current = abortController;
    const timeoutId = window.setTimeout(() => abortController.abort(), 60000);

    try {
      const fallEmergency = isFallEmergencyMessage(trimmed);
      if (fallEmergency || isCaretakerPresenceQuestion(trimmed)) {
        const assistNote = fallEmergency ? `Possible fall reported via AI chat: ${trimmed}` : trimmed;
        const assistResult = await requestCaregiverAssist(assistNote);
        if (assistResult.ok) {
          const assistedMessage = fallEmergency
            ? `${formatFallAssistMessage(assistResult.data)} ${fallPrecautionMessage}`
            : formatCaregiverAssistMessage(assistResult.data);
          appendMessage("assistant", assistedMessage);
          return;
        }
        const failedMessage = fallEmergency
          ? `${formatCaregiverAssistFailure(assistResult)} ${fallPrecautionMessage}`
          : formatCaregiverAssistFailure(assistResult);
        appendMessage("assistant", failedMessage);
        return;
      }

      const sessionRole = getSessionRole();
      const dashboardName = inferDashboardName(sessionRole);
      const pageContext = collectPageContext(dashboardName);
      const auth = buildAuthHeaders();
      const requestPayload: Record<string, unknown> = {
        conversation_id: conversationId,
        message: trimmed,
      };
      if (pageContext) {
        requestPayload.clinical_context = {
          conditions: [],
          recent_alerts: [],
          medications: [],
          current_vitals: {},
          ...pageContext,
          ui_context: {
            ...pageContext,
            requester_role: sessionRole,
            user_role: sessionRole,
            account_role: sessionRole,
          },
        };
      }

      let delivered = false;
      for (let attempt = 0; attempt < 2 && !delivered; attempt += 1) {
        const response = await fetch(`${apiUrl}/api/companion/conversation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(auth?.headers || {}),
          },
          signal: abortController.signal,
          body: JSON.stringify(requestPayload),
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          const detail = String(payload?.detail || "AI request failed");
          const canRetry = attempt === 0 && shouldRetryCompanionRequest(response.status, detail);
          if (canRetry) {
            setIsRetrying(true);
            setError("Retrying assistant response...");
            await sleep(700);
            continue;
          }
          setError(detail);
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
      const isAbort = requestError instanceof DOMException && requestError.name === "AbortError";
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
      setIsRetrying(false);
      setIsLoading(false);
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
    recognition.start();
    setIsListening(true);
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

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

type ApiUser = {
  user_id?: number | null;
  role_name?: string | null;
};

type AdminStats = {
  patients: number;
  facilities: number;
  alerts: number;
  users: number;
  caregivers: number;
  seniors: number;
  admins: number;
  loadedAt: string;
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
  // TODO: re-enable when backend is available
  // const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
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
  const patientCountPattern =
    /\b(how many|number of|count|total)\b.*\bpatients?\b|\bpatients?\b.*\b(how many|count|total)\b/i;
  const caregiverCountPattern =
    /\b(how many|number of|count|total)\b.*\bcaregivers?\b|\bcaregivers?\b.*\b(how many|count|total)\b/i;
  const seniorCountPattern =
    /\b(how many|number of|count|total)\b.*\bseniors?\b|\bseniors?\b.*\b(how many|count|total)\b/i;
  const adminCountPattern =
    /\b(how many|number of|count|total)\b.*\badmins?\b|\badmins?\b.*\b(how many|count|total)\b/i;
  const facilityCountPattern =
    /\b(how many|number of|count|total)\b.*\b(facilities|homes?)\b|\b(facilities|homes?)\b.*\b(how many|count|total)\b/i;
  const alertCountPattern =
    /\b(how many|number of|count|total)\b.*\balerts?\b|\balerts?\b.*\b(how many|count|total)\b/i;

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

  const countDistinctUsers = (rows: ApiUser[], role?: string): number => {
    const ids = new Set<number>();
    const normalizedRole = role ? role.trim().toLowerCase() : "";
    rows.forEach((row) => {
      const userId = row.user_id;
      if (typeof userId !== "number") {
        return;
      }
      if (normalizedRole) {
        if ((row.role_name || "").toLowerCase() !== normalizedRole) {
          return;
        }
      }
      ids.add(userId);
    });
    return ids.size;
  };

  // TODO: re-enable when backend is available
  /*
  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {};
    if (typeof window === "undefined") {
      return headers;
    }
    const token = localStorage.getItem("betti_token");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };
  */

  // TODO: re-enable when backend is available
  /*
  const buildAdminStats = async (signal?: AbortSignal): Promise<AdminStats | null> => {
    const authHeaders = getAuthHeaders();
    if (!authHeaders.Authorization) {
      return null;
    }

    const fetchArray = async <T,>(url: string): Promise<{ ok: boolean; rows: T[]; status: number }> => {
      try {
        const response = await fetch(url, { headers: authHeaders, signal });
        if (!response.ok) {
          return { ok: false, rows: [], status: response.status };
        }
        const payload = await response.json().catch(() => []);
        return { ok: true, rows: toArray<T>(payload), status: response.status };
      } catch {
        return { ok: false, rows: [], status: 0 };
      }
    };

    const fetchArrayWithFallback = async <T,>(
      primaryUrl: string,
      fallbackUrl?: string,
    ): Promise<{ ok: boolean; rows: T[]; status: number }> => {
      const primaryResult = await fetchArray<T>(primaryUrl);
      if (primaryResult.ok || !fallbackUrl) {
        return primaryResult;
      }
      return fetchArray<T>(fallbackUrl);
    };

    try {
      const [patientsResult, caregiversResult, facilitiesResult, alertsResult, usersResult] = await Promise.all([
        fetchArrayWithFallback<Record<string, unknown>>(`${apiUrl}/api/patients?home_only=true`, `${apiUrl}/api/patients`),
        fetchArrayWithFallback<Record<string, unknown>>(`${apiUrl}/api/caregivers?home_only=true`, `${apiUrl}/api/caregivers`),
        fetchArrayWithFallback<Record<string, unknown>>(`${apiUrl}/api/facilities?home_only=true`, `${apiUrl}/api/facilities`),
        fetchArray<Record<string, unknown>>(`${apiUrl}/api/alerts?limit=200&home_only=true`),
        fetchArray<ApiUser>(`${apiUrl}/api/users`),
      ]);

      const anyLiveFeedLoaded =
        patientsResult.ok || caregiversResult.ok || facilitiesResult.ok || alertsResult.ok || usersResult.ok;
      if (!anyLiveFeedLoaded) {
        return null;
      }

      const users = usersResult.rows as ApiUser[];
      const caregiversFromUsers = countDistinctUsers(users, "caregiver");
      const seniorsFromUsers = countDistinctUsers(users, "senior");
      const adminsFromUsers = countDistinctUsers(users, "admin");
      const totalUsersFromUsers = countDistinctUsers(users);

      return {
        patients: patientsResult.rows.length,
        facilities: facilitiesResult.rows.length,
        alerts: alertsResult.rows.length,
        users: totalUsersFromUsers,
        caregivers: caregiversFromUsers > 0 ? caregiversFromUsers : caregiversResult.rows.length,
        seniors: seniorsFromUsers,
        admins: adminsFromUsers,
        loadedAt: new Date().toISOString(),
      };
    } catch {
      return null;
    }
  };
  */

  const buildCountResponse = (question: string, stats: AdminStats): string | null => {
    const asOf = new Date(stats.loadedAt).toLocaleString();
    const asksPatients = patientCountPattern.test(question);
    const asksCaregivers = caregiverCountPattern.test(question);
    const asksSeniors = seniorCountPattern.test(question);
    const asksAdmins = adminCountPattern.test(question);
    const asksFacilities = facilityCountPattern.test(question);
    const asksAlerts = alertCountPattern.test(question);

    if (asksPatients && asksCaregivers) {
      return `There are currently ${stats.patients} patients and ${stats.caregivers} caregivers in Betti Home (live DB), as of ${asOf}.`;
    }
    if (asksPatients) {
      return `There are currently ${stats.patients} patients in Betti Home (live DB), as of ${asOf}.`;
    }
    if (asksCaregivers) {
      return `There are currently ${stats.caregivers} caregivers in the system, as of ${asOf}.`;
    }
    if (asksSeniors) {
      return `There are currently ${stats.seniors} senior users in the system, as of ${asOf}.`;
    }
    if (asksAdmins) {
      return `There are currently ${stats.admins} admin users in the system, as of ${asOf}.`;
    }
    if (asksFacilities) {
      return `There are currently ${stats.facilities} Betti Home facilities, as of ${asOf}.`;
    }
    if (asksAlerts) {
      return `There are currently ${stats.alerts} recent alerts in the admin feed, as of ${asOf}.`;
    }
    return null;
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
      return "I am online and ready. Ask me for live counts, alert summaries, or workflow guidance.";
    }
    return "I hear you. What would you like help with: live metrics, alerts, assignments, or admin workflow steps?";
  };

  const needsAdminCountStats = (message: string): boolean =>
    patientCountPattern.test(message) ||
    caregiverCountPattern.test(message) ||
    seniorCountPattern.test(message) ||
    adminCountPattern.test(message) ||
    facilityCountPattern.test(message) ||
    alertCountPattern.test(message) ||
    /\balerts?\b/i.test(message) && /\b(summary|summarize|overview|brief|status)\b/i.test(message);

  const buildAlertsSummaryResponse = (question: string, stats: AdminStats): string | null => {
    const asksAlertsSummary =
      /\balerts?\b/i.test(question) &&
      /\b(summary|summarize|overview|brief|status)\b/i.test(question);
    if (!asksAlertsSummary) {
      return null;
    }
    const asOf = new Date(stats.loadedAt).toLocaleString();
    return `Active alerts snapshot: ${stats.alerts} recent alerts in the live admin feed as of ${asOf}.`;
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
      // TODO: re-enable when backend is available
      /*
      const adminStats = needsAdminCountStats(trimmed)
        ? await buildAdminStats(abortController.signal)
        : null;
      const pageContext = collectPageContext("admin-dashboard");
      if (adminStats) {
        const directCountResponse = buildCountResponse(trimmed, adminStats);
        if (directCountResponse) {
          appendMessage("assistant", directCountResponse);
          return;
        }
        const alertsSummaryResponse = buildAlertsSummaryResponse(trimmed, adminStats);
        if (alertsSummaryResponse) {
          appendMessage("assistant", alertsSummaryResponse);
          return;
        }
      }
      const contextualMessage = trimmed;

      const requestPayload: Record<string, unknown> = {
        conversation_id: conversationId,
        message: contextualMessage,
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
            requester_role: "admin",
            user_role: "admin",
            account_role: "admin",
          },
        };
      }

      let delivered = false;
      for (let attempt = 0; attempt < 2 && !delivered; attempt += 1) {
        const response = await fetch(`${apiUrl}/api/companion/conversation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
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
      */
      appendMessage("assistant", "AI assistant is offline. Backend not yet connected.");
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

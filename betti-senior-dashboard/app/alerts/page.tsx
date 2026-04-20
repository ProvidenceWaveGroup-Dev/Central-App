"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Droplets,
  Pill,
  Activity,
  Wind,
  Thermometer,
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  ShieldAlert,
  Volume2,
  VolumeX,
  Play,
  Square,
  PhoneCall,
  ThumbsUp,
} from "lucide-react";

const RESIDENT_NAME = "Margaret";
const COUNTDOWN_SECONDS = 30;

// ── Types ────────────────────────────────────────────────────────────────────

type Priority = "critical" | "medium" | "low";

interface Alert {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  priority: Priority;
  acknowledged: boolean;
  arrivedAt: number; // timestamp for audio trigger
}

// ── Severity Config ───────────────────────────────────────────────────────────

const priorityConfig: Record<Priority, {
  label: string;
  badge: string;
  card: string;
  iconBg: string;
  iconColor: string;
  sectionBg: string;
  sectionBorder: string;
  sectionTitle: string;
  countBg: string;
}> = {
  critical: {
    label: "Critical",
    badge: "bg-red-100 text-red-700 border-red-300",
    card: "border-l-4 border-l-red-500 bg-red-50/40",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    sectionBg: "bg-red-50",
    sectionBorder: "border-red-200",
    sectionTitle: "text-red-700",
    countBg: "bg-red-500 text-white",
  },
  medium: {
    label: "Medium",
    badge: "bg-amber-100 text-amber-700 border-amber-300",
    card: "border-l-4 border-l-amber-500 bg-amber-50/40",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    sectionBg: "bg-amber-50",
    sectionBorder: "border-amber-200",
    sectionTitle: "text-amber-700",
    countBg: "bg-amber-500 text-white",
  },
  low: {
    label: "Low",
    badge: "bg-sky-100 text-sky-700 border-sky-300",
    card: "border-l-4 border-l-sky-400 bg-sky-50/30",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    sectionBg: "bg-sky-50",
    sectionBorder: "border-sky-200",
    sectionTitle: "text-sky-700",
    countBg: "bg-sky-400 text-white",
  },
};

// ── Icon Map ──────────────────────────────────────────────────────────────────

const typeIcon: Record<string, React.ElementType> = {
  fall:       ShieldAlert,
  medication: Pill,
  hydration:  Droplets,
  activity:   Activity,
  environment:Wind,
  temperature:Thermometer,
  default:    Bell,
};

function AlertIcon({ type, priority }: { type: string; priority: Priority }) {
  const cfg = priorityConfig[priority];
  const Icon = typeIcon[type] ?? typeIcon.default;
  return (
    <div className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center ${cfg.iconBg} ${cfg.iconColor}`}>
      <Icon className="h-5 w-5" />
    </div>
  );
}

// ── Simulation Dataset ────────────────────────────────────────────────────────

const SIMULATION_ALERTS: Omit<Alert, "id" | "acknowledged" | "arrivedAt">[] = [
  {
    type: "fall",
    title: "Fall Detected — Living Room",
    message: "Sensor detected an impact event consistent with a fall. Please confirm you are okay.",
    time: "Now",
    priority: "critical",
  },
  {
    type: "medication",
    title: "Missed Medication — Morning Dose",
    message: "Your 9:00 AM medication has not been recorded as taken.",
    time: "9:15 AM",
    priority: "medium",
  },
  {
    type: "hydration",
    title: "Hydration Reminder",
    message: "No hydration activity recorded in the last 3 hours.",
    time: "11:30 AM",
    priority: "low",
  },
  {
    type: "environment",
    title: "Air Quality Alert — Bedroom",
    message: "CO₂ levels in the bedroom have exceeded the safe threshold.",
    time: "Now",
    priority: "critical",
  },
  {
    type: "activity",
    title: "Inactivity Detected",
    message: "No movement recorded in the last 90 minutes. A check-in may be needed.",
    time: "1:45 PM",
    priority: "medium",
  },
  {
    type: "temperature",
    title: "Room Temperature Low",
    message: "Living room temperature has dropped below comfortable range (17°C).",
    time: "2:10 PM",
    priority: "low",
  },
];

// ── Speech Synthesis ──────────────────────────────────────────────────────────

function speakAlert(title: string, priority: Priority) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const prefix =
    priority === "critical" ? "Critical alert. " :
    priority === "medium"   ? "Alert. " : "";
  const utterance = new SpeechSynthesisUtterance(`${prefix}${title}`);
  utterance.rate = priority === "critical" ? 0.85 : 0.9;
  utterance.pitch = priority === "critical" ? 1.1 : 1.0;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

// ── Critical Alert Modal ──────────────────────────────────────────────────────

function CriticalAlertModal({
  alert,
  onFine,
  onHelp,
  onEscalated,
}: {
  alert: Alert;
  onFine: () => void;
  onHelp: () => void;
  onEscalated: () => void;
}) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [escalated, setEscalated] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setEscalated(true);
      onEscalated();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onEscalated]);

  const pct = Math.round((countdown / COUNTDOWN_SECONDS) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl text-center">

        {/* Icon */}
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-red-600 mb-1">{alert.title}</h2>
        <p className="text-gray-600 mb-6">{RESIDENT_NAME}, are you okay?</p>

        {/* Countdown */}
        {!escalated ? (
          <>
            <p className="text-5xl font-bold text-red-600 mb-1">{countdown}</p>
            <p className="text-sm text-gray-500 mb-4">seconds until emergency services are contacted</p>
            {/* Progress bar */}
            <div className="w-full rounded-full bg-red-100 h-2.5 mb-7 overflow-hidden">
              <div
                className="h-2.5 rounded-full bg-red-500 transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        ) : (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 mb-7">
            <p className="text-sm font-semibold text-red-700">Emergency services have been contacted.</p>
          </div>
        )}

        {/* Actions */}
        {!escalated && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={onFine}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#5C7F39] px-6 py-4 text-base font-bold text-white transition hover:bg-[#4f6b32]"
            >
              <ThumbsUp className="h-5 w-5" />
              I&apos;m Fine
            </button>
            <button
              type="button"
              onClick={onHelp}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-base font-bold text-white transition hover:bg-red-700"
            >
              <PhoneCall className="h-5 w-5" />
              I Need Help
            </button>
          </div>
        )}

        {escalated && (
          <button
            type="button"
            onClick={onFine}
            className="w-full rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
          >
            Close
          </button>
        )}

        <p className="mt-5 text-xs text-gray-400 leading-relaxed">
          If you don&apos;t respond, we&apos;ll automatically contact your emergency contacts and services.
        </p>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: "medication",
      title: "Afternoon Medication",
      message: "Time for your 2:00 PM medication.",
      time: "2:00 PM",
      priority: "medium",
      acknowledged: false,
      arrivedAt: 0,
    },
    {
      id: 2,
      type: "hydration",
      title: "Hydration Reminder",
      message: "You haven't had water in 2 hours. Time to hydrate.",
      time: "3:30 PM",
      priority: "low",
      acknowledged: false,
      arrivedAt: 0,
    },
  ]);

  const [audioEnabled, setAudioEnabled]     = useState(true);
  const [simRunning, setSimRunning]         = useState(false);
  const [modalAlert, setModalAlert]         = useState<Alert | null>(null);
  const simIndexRef  = useRef(0);
  const simTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextIdRef    = useRef(100);
  const lastAudioRef = useRef<Set<number>>(new Set());

  // Play audio for new unacknowledged alerts
  useEffect(() => {
    if (!audioEnabled) return;
    alerts.forEach((alert) => {
      if (!alert.acknowledged && !lastAudioRef.current.has(alert.id) && alert.arrivedAt > 0) {
        lastAudioRef.current.add(alert.id);
        speakAlert(alert.title, alert.priority);
      }
    });
  }, [alerts, audioEnabled]);

  const acknowledge = useCallback((id: number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    window.speechSynthesis?.cancel();
  }, []);

  const acknowledgeAll = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
    window.speechSynthesis?.cancel();
  }, []);

  const addSimAlert = useCallback(() => {
    const template = SIMULATION_ALERTS[simIndexRef.current % SIMULATION_ALERTS.length];
    simIndexRef.current += 1;
    const newAlert: Alert = {
      ...template,
      id: nextIdRef.current++,
      acknowledged: false,
      arrivedAt: Date.now(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setAlerts((prev) => [newAlert, ...prev]);
    if (newAlert.priority === "critical") {
      setModalAlert(newAlert);
    }
  }, []);

  const startSimulation = useCallback(() => {
    setSimRunning(true);
    simIndexRef.current = 0;
    addSimAlert();
    let count = 1;
    const fire = () => {
      if (count >= SIMULATION_ALERTS.length) {
        setSimRunning(false);
        return;
      }
      simTimerRef.current = setTimeout(() => {
        addSimAlert();
        count++;
        fire();
      }, 4000);
    };
    fire();
  }, [addSimAlert]);

  const stopSimulation = useCallback(() => {
    if (simTimerRef.current) clearTimeout(simTimerRef.current);
    setSimRunning(false);
  }, []);

  useEffect(() => () => { if (simTimerRef.current) clearTimeout(simTimerRef.current); }, []);

  const active       = alerts.filter((a) => !a.acknowledged);
  const acknowledged = alerts.filter((a) => a.acknowledged);

  const criticalAlerts = active.filter((a) => a.priority === "critical");
  const mediumAlerts   = active.filter((a) => a.priority === "medium");
  const lowAlerts      = active.filter((a) => a.priority === "low");

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
              Alerts &amp; Reminders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Active alerts grouped by severity. Acknowledge to clear.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Audio toggle */}
            <button
              type="button"
              onClick={() => setAudioEnabled((v) => !v)}
              title={audioEnabled ? "Mute audio alerts" : "Unmute audio alerts"}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                audioEnabled
                  ? "bg-[#233E7D] border-[#233E7D] text-white"
                  : "bg-white border-gray-200 text-gray-500"
              }`}
            >
              {audioEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              {audioEnabled ? "Audio On" : "Audio Off"}
            </button>

            {/* Simulation */}
            {!simRunning ? (
              <button
                type="button"
                onClick={startSimulation}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#5C7F39] border border-[#5C7F39] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#4f6b32]"
              >
                <Play className="h-3.5 w-3.5" />
                Run Simulation
              </button>
            ) : (
              <button
                type="button"
                onClick={stopSimulation}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-500 border border-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600"
              >
                <Square className="h-3.5 w-3.5" />
                Stop
              </button>
            )}

            {/* Acknowledge all */}
            {active.length > 0 && (
              <button
                type="button"
                onClick={acknowledgeAll}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Acknowledge All
              </button>
            )}
          </div>
        </div>

        {/* Summary Badges */}
        <div className="grid grid-cols-3 gap-3">
          {(["critical", "medium", "low"] as Priority[]).map((p) => {
            const cfg = priorityConfig[p];
            const count = active.filter((a) => a.priority === p).length;
            return (
              <div key={p} className={`rounded-xl border p-4 ${cfg.sectionBg} ${cfg.sectionBorder}`}>
                <div className="flex items-center justify-between">
                  {p === "critical" ? <ShieldAlert className={`h-5 w-5 ${cfg.iconColor}`} /> :
                   p === "medium"   ? <AlertTriangle className={`h-5 w-5 ${cfg.iconColor}`} /> :
                                      <Info className={`h-5 w-5 ${cfg.iconColor}`} />}
                  <span className={`text-2xl font-bold ${cfg.iconColor}`}>{count}</span>
                </div>
                <p className={`mt-2 text-xs font-semibold ${cfg.sectionTitle}`}>{cfg.label}</p>
              </div>
            );
          })}
        </div>

        {/* No active alerts */}
        {active.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <CheckCircle className="h-12 w-12 text-[#5C7F39] mx-auto mb-3" />
            <p className="text-lg font-semibold text-[#5C7F39]">All clear</p>
            <p className="text-sm text-gray-500 mt-1">No active alerts. Run a simulation to preview the system.</p>
          </div>
        )}

        {/* Critical */}
        {criticalAlerts.length > 0 && (
          <AlertGroup
            priority="critical"
            alerts={criticalAlerts}
            onAcknowledge={acknowledge}
          />
        )}

        {/* Medium */}
        {mediumAlerts.length > 0 && (
          <AlertGroup
            priority="medium"
            alerts={mediumAlerts}
            onAcknowledge={acknowledge}
          />
        )}

        {/* Low */}
        {lowAlerts.length > 0 && (
          <AlertGroup
            priority="low"
            alerts={lowAlerts}
            onAcknowledge={acknowledge}
          />
        )}

        {/* Acknowledged */}
        {acknowledged.length > 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-[#5C7F39]" />
              <h2 className="font-serif text-base font-semibold text-gray-700">Acknowledged</h2>
              <span className="ml-auto text-xs text-gray-400">{acknowledged.length} item{acknowledged.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="space-y-2">
              {acknowledged.map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
                  <CheckCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500 line-through">{alert.title}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Critical alert popup modal */}
      {modalAlert && (
        <CriticalAlertModal
          alert={modalAlert}
          onFine={() => { acknowledge(modalAlert.id); setModalAlert(null); }}
          onHelp={() => { acknowledge(modalAlert.id); setModalAlert(null); }}
          onEscalated={() => { acknowledge(modalAlert.id); setModalAlert(null); }}
        />
      )}
    </div>
  );
}

// ── Alert Group Section ───────────────────────────────────────────────────────

function AlertGroup({
  priority,
  alerts,
  onAcknowledge,
}: {
  priority: Priority;
  alerts: Alert[];
  onAcknowledge: (id: number) => void;
}) {
  const cfg = priorityConfig[priority];
  const SectionIcon =
    priority === "critical" ? ShieldAlert :
    priority === "medium"   ? AlertTriangle : Info;

  return (
    <div className={`rounded-xl border ${cfg.sectionBorder} overflow-hidden`}>
      {/* Section header */}
      <div className={`flex items-center gap-2 px-4 py-3 ${cfg.sectionBg} border-b ${cfg.sectionBorder}`}>
        <SectionIcon className={`h-4 w-4 ${cfg.iconColor}`} />
        <h2 className={`text-sm font-bold uppercase tracking-wider ${cfg.sectionTitle}`}>
          {cfg.label}
        </h2>
        <span className={`ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold ${cfg.countBg}`}>
          {alerts.length}
        </span>
      </div>

      {/* Alerts */}
      <div className="bg-white divide-y divide-gray-50">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`flex items-start gap-3 p-4 transition-colors hover:bg-gray-50/60 ${cfg.card}`}
          >
            <AlertIcon type={alert.type} priority={priority} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-gray-900">{alert.title}</p>
                {priority === "critical" && (
                  <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold animate-pulse bg-red-100 text-red-700 border-red-300">
                    <ShieldAlert className="h-3 w-3" /> Critical
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">{alert.message}</p>
              <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
            </div>
            <button
              type="button"
              onClick={() => onAcknowledge(alert.id)}
              className="flex-shrink-0 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition"
            >
              Acknowledge
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

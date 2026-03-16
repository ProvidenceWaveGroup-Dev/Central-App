"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Pill,
  Shield,
  Thermometer,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const ITEMS_PER_PAGE = 15;
const DEFAULT_TO = new Date();
const DEFAULT_FROM = new Date(DEFAULT_TO);
DEFAULT_FROM.setDate(DEFAULT_FROM.getDate() - 14);

type CategoryId = "all" | "overview" | "vitals" | "medications" | "appointments" | "alerts" | "ai";
type Row = { categoryId: CategoryId; category: string; metric: string; value: string; timestamp: string; source: string; details: string };

const CATEGORIES: Array<{ id: CategoryId; label: string; icon: typeof BarChart3 }> = [
  { id: "all", label: "All Metrics", icon: BarChart3 },
  { id: "overview", label: "Overview", icon: User },
  { id: "vitals", label: "Vitals", icon: Thermometer },
  { id: "medications", label: "Medications", icon: Pill },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "alerts", label: "Alerts and Safety", icon: Shield },
  { id: "ai", label: "AI Inferences", icon: Brain },
];

const toArray = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const p = payload as { items?: unknown; data?: unknown; value?: unknown };
    if (Array.isArray(p.items)) return p.items as T[];
    if (Array.isArray(p.data)) return p.data as T[];
    if (Array.isArray(p.value)) return p.value as T[];
  }
  return [];
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
const fmt = (value: string) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "N/A" : parsed.toLocaleString();
};
const esc = (value: string) => `"${value.replace(/"/g, "\"\"")}"`;
const clip = (value: string, max: number) => (value.length > max ? `${value.slice(0, Math.max(0, max - 3))}...` : value);

export default function ReportsPage() {
  const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [categoryFilter, setCategoryFilter] = useState<CategoryId>("all");
  const [selectedCardCategory, setSelectedCardCategory] = useState<CategoryId>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(DEFAULT_FROM);
  const [dateTo, setDateTo] = useState<Date | undefined>(DEFAULT_TO);
  const [showCalendar, setShowCalendar] = useState<"from" | "to" | null>(null);
  const [detailsPage, setDetailsPage] = useState(0);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [residentName, setResidentName] = useState("Resident");
  const [caregiverName, setCaregiverName] = useState("Care Team");
  const [assigned, setAssigned] = useState<Record<string, unknown> | null>(null);
  const [vitals, setVitals] = useState<Record<string, unknown>[]>([]);
  const [appointments, setAppointments] = useState<Record<string, unknown>[]>([]);
  const [alerts, setAlerts] = useState<Record<string, unknown>[]>([]);
  const [inferences, setInferences] = useState<Record<string, unknown>[]>([]);
  const [medications, setMedications] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setIsLoading(true);
      setError("");
      try {
        if (typeof window === "undefined") return;
        const userId = localStorage.getItem("betti_user_id");
        const token = localStorage.getItem("betti_token");
        if (!userId) throw new Error("Session missing. Please login again.");
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
        const safe = async (url: string) => {
          try {
            const res = await fetch(url, { headers });
            if (!res.ok) return null;
            return await res.json();
          } catch {
            return null;
          }
        };

        const [assignedPayload, userPayload] = await Promise.all([
          safe(`${apiUrl}/api/users/${userId}/assigned-patients?active_only=true&home_only=false`),
          safe(`${apiUrl}/api/users/${userId}`),
        ]);
        const list = toArray<Record<string, unknown>>(assignedPayload);
        const primary = list.find((r) => Boolean(r.patient_id) && Boolean(r.is_primary)) || list[0] || null;
        const patientId = Number(primary?.patient_id || 0);
        const profile = userPayload && typeof userPayload === "object" ? (userPayload as Record<string, unknown>) : {};
        setResidentName(String(primary?.patient_name || `${profile.first_name || ""} ${profile.last_name || ""}`).trim() || "Resident");
        setCaregiverName(String(primary?.primary_caregiver || "").trim() || "Care Team");

        const pid = patientId > 0 ? `&patient_id=${patientId}` : "";
        const [vitalsPayload, apptPayload, alertsPayload, infPayload, medsPayload] = await Promise.all([
          safe(`${apiUrl}/api/vitals?${pid ? pid.slice(1) : ""}`),
          safe(`${apiUrl}/api/appointments?limit=500${pid}`),
          safe(`${apiUrl}/api/alerts?limit=200&sort=recorded_time&order=desc${pid}`),
          safe(`${apiUrl}/api/ai/inferences?limit=500`),
          safe(`${apiUrl}/api/users/${userId}/self-reported-medications`),
        ]);

        if (cancelled) return;
        setAssigned(primary);
        setVitals(toArray<Record<string, unknown>>(vitalsPayload));
        setAppointments(toArray<Record<string, unknown>>(apptPayload));
        setAlerts(toArray<Record<string, unknown>>(alertsPayload));
        setInferences(toArray<Record<string, unknown>>(infPayload).filter((r) => (patientId > 0 ? Number(r.patient_id || 0) === patientId : true)));
        setMedications(toArray<Record<string, unknown>>((medsPayload as { items?: unknown } | null)?.items));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Unable to load report data.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const inRange = useCallback((ts?: string | null) => {
    if (!dateFrom && !dateTo) return true;
    if (!ts) return false;
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return false;
    if (dateFrom && d < startOfDay(dateFrom)) return false;
    if (dateTo && d > endOfDay(dateTo)) return false;
    return true;
  }, [dateFrom, dateTo]);

  const period = useMemo(() => `${dateFrom?.toLocaleDateString() || "N/A"} to ${dateTo?.toLocaleDateString() || "N/A"}`, [dateFrom, dateTo]);

  const allRows = useMemo(() => {
    const rows: Row[] = [];
    const add = (categoryId: CategoryId, category: string, metric: string, value: string, timestamp = "", source = "", details = "") => {
      rows.push({ categoryId, category, metric, value, timestamp, source, details });
    };

    const appts = appointments.filter((r) => inRange(String(r.start_time || "")));
    const alertsIn = alerts.filter((r) => inRange(String(r.recorded_time || r.event_time || "")));
    const vitalsIn = vitals.filter((r) => inRange(String(r.recorded_time || r.event_time || "")));
    const inf = inferences.filter((r) => inRange(String(r.created_at || "")));
    const meds = medications.filter((r) => !r.start_date || inRange(String(r.start_date)));

    add("overview", "Overview", "Resident", residentName, "", "assigned-patient-api", "Live resident profile context.");
    add("overview", "Overview", "Caregiver", caregiverName, "", "assigned-patient-api", "Primary caregiver for assigned resident.");
    add("overview", "Overview", "Facility", String(assigned?.facility_name || "N/A"), "", "assigned-patient-api", "Assigned home/facility.");
    add("overview", "Overview", "Date Range", period, "", "report-filter", "Applied export filter.");
    add("overview", "Overview", "Latest Risk Score", String(assigned?.latest_risk_score ?? "N/A"), "", "assigned-patient-api", "Latest resident risk score.");
    add("overview", "Overview", "Chronic Conditions", String(assigned?.chronic_conditions || "Not provided"), "", "assigned-patient-api", "Latest chronic condition summary.");
    add("overview", "Overview", "Allergies", String(assigned?.allergies || "Not provided"), "", "assigned-patient-api", "Latest allergy summary.");

    if (vitalsIn[0]) {
      const v = vitalsIn[0];
      const t = String(v.recorded_time || v.event_time || "");
      add("vitals", "Vitals", "Heart Rate", `${String(v.heart_rate ?? "N/A")} bpm`, t, "vitals-api", "Latest heart rate.");
      add("vitals", "Vitals", "Blood Pressure", `${String(v.blood_pressure_systolic ?? "N/A")}/${String(v.blood_pressure_diastolic ?? "N/A")} mmHg`, t, "vitals-api", "Latest blood pressure.");
      add("vitals", "Vitals", "Skin Temperature", String(v.skin_temp ?? "N/A"), t, "vitals-api", "Latest skin temperature.");
      add("vitals", "Vitals", "Hydration Level", String(v.hydration_level ?? "N/A"), t, "vitals-api", "Latest hydration level.");
    } else {
      add("vitals", "Vitals", "Vitals Snapshot", "No live vitals in selected range", "", "vitals-api", "No vitals rows returned.");
    }

    add("medications", "Medications", "Medication Entries", String(meds.length), "", "self-reported-medications-api", "Total medication entries in range.");
    meds.forEach((m) => add("medications", "Medications", String(m.name || "Medication"), [m.dose, m.schedule].filter(Boolean).join(" | ") || "No dose/schedule", String(m.start_date || ""), "self-reported-medications-api", [m.notes, m.reminder_text].filter(Boolean).join(" | ") || "No extra notes."));

    const completed = appts.filter((a) => String(a.status || "").toLowerCase() === "completed").length;
    add("appointments", "Appointments", "Appointments In Range", String(appts.length), "", "appointments-api", "All appointments in selected range.");
    add("appointments", "Appointments", "Completed Appointments", String(completed), "", "appointments-api", "Completed status count.");
    appts.forEach((a) => add("appointments", "Appointments", `${String(a.appointment_type || "Appointment")} with ${String(a.provider_name || "Provider")}`, String(a.status || "scheduled"), String(a.start_time || ""), "appointments-api", [a.notes, a.facility_name].filter(Boolean).join(" | ") || "No additional notes."));

    const critical = alertsIn.filter((a) => String(a.severity || "").toLowerCase().includes("critical")).length;
    add("alerts", "Alerts and Safety", "Total Alerts", String(alertsIn.length), "", "alerts-api", "All alerts in selected range.");
    add("alerts", "Alerts and Safety", "Critical Alerts", String(critical), "", "alerts-api", "Critical severity count.");
    alertsIn.forEach((a) => add("alerts", "Alerts and Safety", String(a.alert_type || "Alert"), `${String(a.severity || "unknown")} | ${String(a.status || "unknown")}`, String(a.recorded_time || a.event_time || ""), `alerts-api#${String(a.alert_id || "n/a")}`, [a.description, a.feedback_status].filter(Boolean).join(" | ") || "No extra context."));

    const highRisk = inf.filter((r) => ["high", "critical"].includes(String(r.risk_level || "").toLowerCase())).length;
    add("ai", "AI Inferences", "Inference Records", String(inf.length), "", "ai-inferences-api", "All AI inference rows in selected range.");
    add("ai", "AI Inferences", "High/Critical Inferences", String(highRisk), "", "ai-inferences-api", "High and critical risk count.");
    inf.forEach((r) => add("ai", "AI Inferences", String(r.event_type || "Inference"), `${String(r.risk_level || "unknown")} | confidence ${typeof r.confidence === "number" ? `${Math.round(Number(r.confidence) * 100)}%` : "N/A"}`, String(r.created_at || ""), String(r.model_version || "local_fallback"), String(r.output || "No model output.")));

    return rows;
  }, [alerts, appointments, assigned, caregiverName, inRange, inferences, medications, period, residentName, vitals]);

  const rowsForExport = useMemo(() => (categoryFilter === "all" ? allRows : allRows.filter((r) => r.categoryId === categoryFilter)), [allRows, categoryFilter]);
  const rowsForDisplay = useMemo(() => (selectedCardCategory === "all" ? allRows : allRows.filter((r) => r.categoryId === selectedCardCategory)), [allRows, selectedCardCategory]);
  const totalPages = Math.max(1, Math.ceil(rowsForDisplay.length / ITEMS_PER_PAGE));
  const paginated = rowsForDisplay.slice(detailsPage * ITEMS_PER_PAGE, (detailsPage + 1) * ITEMS_PER_PAGE);

  const cardSummary = useCallback((id: CategoryId) => {
    const rows = id === "all" ? allRows : allRows.filter((r) => r.categoryId === id);
    if (!rows.length) return "No live records in selected range.";
    return `${rows.length} rows | ${rows.slice(0, 2).map((r) => `${r.metric}: ${r.value}`).join(" | ")}`;
  }, [allRows]);

  const downloadCsv = () => {
    const headers = ["Category", "Metric", "Value", "Timestamp", "Source", "Details", "Period"];
    const body = rowsForExport.map((r) => [esc(r.category), esc(r.metric), esc(r.value), esc(r.timestamp ? fmt(r.timestamp) : ""), esc(r.source), esc(r.details), esc(period)].join(","));
    const csv = [headers.join(","), ...body].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `betti-report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    setIsExportingPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF("p", "mm", "a4");
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 12;
      const tableW = pageW - margin * 2;
      const widths = [24, 28, 24, 32, 24, tableW - (24 + 28 + 24 + 32 + 24)];
      let y = 14;

      const header = () => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(35, 62, 125);
        doc.text("Betti - Live Report", margin, y);
        y += 6;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(64, 64, 64);
        doc.text(`Resident: ${residentName}`, margin, y); y += 4;
        doc.text(`Caregiver: ${caregiverName}`, margin, y); y += 4;
        doc.text(`Period: ${period}`, margin, y); y += 4;
        doc.text(`Generated: ${new Date().toLocaleString()}`, margin, y); y += 6;
        doc.setFillColor(35, 62, 125);
        doc.rect(margin, y, tableW, 7, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        const labels = ["Category", "Metric", "Value", "Timestamp", "Source", "Details"];
        let x = margin + 1.5;
        labels.forEach((label, i) => { doc.text(label, x, y + 4.8); x += widths[i]; });
        y += 7;
      };

      header();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(31, 41, 55);
      rowsForExport.forEach((r, i) => {
        if (y > pageH - 12) { doc.addPage(); y = 14; header(); doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(31, 41, 55); }
        if (i % 2 === 1) { doc.setFillColor(248, 250, 252); doc.rect(margin, y, tableW, 5.6, "F"); }
        const cells = [clip(r.category, 16), clip(r.metric, 22), clip(r.value, 22), clip(r.timestamp ? fmt(r.timestamp) : "", 24), clip(r.source, 18), clip(r.details, 40)];
        let x = margin + 1.5;
        cells.forEach((c, idx) => { doc.text(c, x, y + 3.8); x += widths[idx]; });
        y += 5.6;
      });
      doc.setFontSize(8);
      doc.setTextColor(90, 90, 90);
      doc.text("Generated by Betti Senior Dashboard (live API data).", margin, pageH - 6);
      doc.save(`betti-health-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (e) {
      console.error("PDF export failed:", e);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Reports and Analysis</h1>
          <p className="text-sm text-gray-500 mt-1">Live API data with detailed CSV/PDF exports. No hardcoded report payload.</p>
        </div>
        {error && <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-2 text-sm flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{error}</div>}
        {isLoading && <div className="rounded-lg border border-blue-200 bg-blue-50 text-blue-700 px-4 py-2 text-sm">Loading live report data...</div>}

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2"><Filter className="h-5 w-5 text-[#233E7D]" /><span className="font-semibold text-gray-900">Filters</span></div>
              <select value={categoryFilter} onChange={(e) => { const next = e.target.value as CategoryId; setCategoryFilter(next); setSelectedCardCategory(next); setDetailsPage(0); }} className="rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white">
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <button onClick={() => setShowCalendar(showCalendar === "from" ? null : "from")} className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">From: {dateFrom?.toLocaleDateString() ?? "Select"}</button>
                  {showCalendar === "from" && <div className="absolute top-full left-0 mt-1 z-20 bg-white border rounded-lg shadow-lg p-2"><CalendarComponent mode="single" selected={dateFrom} onSelect={(d) => { setDateFrom(d); setShowCalendar(null); setDetailsPage(0); }} /></div>}
                </div>
                <div className="relative">
                  <button onClick={() => setShowCalendar(showCalendar === "to" ? null : "to")} className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">To: {dateTo?.toLocaleDateString() ?? "Select"}</button>
                  {showCalendar === "to" && <div className="absolute top-full left-0 mt-1 z-20 bg-white border rounded-lg shadow-lg p-2"><CalendarComponent mode="single" selected={dateTo} onSelect={(d) => { setDateTo(d); setShowCalendar(null); setDetailsPage(0); }} /></div>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={downloadCsv} variant="outline" className="gap-2"><Download className="h-4 w-4" />Download CSV</Button>
              <Button onClick={downloadPdf} disabled={isExportingPdf} className="gap-2 bg-[#233E7D] hover:bg-[#1c3266]"><Download className="h-4 w-4" />{isExportingPdf ? "Generating PDF..." : "Download PDF"}</Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const selected = selectedCardCategory === c.id;
            return (
              <button key={c.id} type="button" onClick={() => { setSelectedCardCategory(c.id); setCategoryFilter(c.id); setDetailsPage(0); }} className={`rounded-xl border p-4 text-left hover:shadow-md transition-all ${selected ? "border-[#233E7D] bg-[#233E7D]/5 ring-2 ring-[#233E7D]/30" : "border-gray-200 bg-white"}`}>
                <div className="flex items-center gap-2 mb-2"><Icon className={`h-5 w-5 ${selected ? "text-[#233E7D]" : "text-gray-600"}`} /><span className="font-semibold text-gray-900">{c.label}</span></div>
                <p className="text-xs text-gray-500 line-clamp-3">{cardSummary(c.id)}</p>
              </button>
            );
          })}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4"><BarChart3 className="h-5 w-5 text-[#233E7D]" /><h2 className="font-serif text-lg font-semibold text-gray-900">Detailed Rows</h2></div>
          <div className="overflow-auto max-h-[420px] flex-1 min-h-0">
            <table className="w-full text-sm min-w-[920px]">
              <thead className="sticky top-0 bg-white z-10"><tr className="border-b border-gray-200"><th className="text-left py-3 px-3 w-12">#</th><th className="text-left py-3 px-3">Category</th><th className="text-left py-3 px-3">Metric</th><th className="text-left py-3 px-3">Value</th><th className="text-left py-3 px-3">Timestamp</th><th className="text-left py-3 px-3">Source</th><th className="text-left py-3 px-3">Details</th></tr></thead>
              <tbody>
                {paginated.length === 0 ? <tr><td colSpan={7} className="py-8 px-3 text-center text-gray-500">No rows available for the selected filters.</td></tr> : paginated.map((r, i) => (
                  <tr key={`${r.categoryId}-${detailsPage}-${i}`} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 text-gray-500 font-medium">{detailsPage * ITEMS_PER_PAGE + i + 1}</td>
                    <td className="py-3 px-3">{r.category}</td><td className="py-3 px-3">{r.metric}</td><td className="py-3 px-3 font-medium text-[#233E7D]">{r.value}</td>
                    <td className="py-3 px-3 text-gray-600">{r.timestamp ? fmt(r.timestamp) : "N/A"}</td><td className="py-3 px-3 text-gray-600">{r.source}</td><td className="py-3 px-3 text-gray-600">{r.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">Showing {detailsPage * ITEMS_PER_PAGE + 1}-{Math.min((detailsPage + 1) * ITEMS_PER_PAGE, rowsForDisplay.length)} of {rowsForDisplay.length}</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" onClick={() => setDetailsPage((p) => Math.max(0, p - 1))} disabled={detailsPage === 0}><ChevronLeft className="h-4 w-4" /></Button>
                <span className="text-sm text-gray-600 px-2">{detailsPage + 1} / {totalPages}</span>
                <Button variant="outline" size="sm" onClick={() => setDetailsPage((p) => Math.min(totalPages - 1, p + 1))} disabled={detailsPage >= totalPages - 1}><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useCallback } from "react";
import {
  BarChart3,
  Download,
  Filter,
  Heart,
  Utensils,
  Activity,
  Pill,
  Droplets,
  MapPin,
  Calendar,
  Thermometer,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const ITEMS_PER_PAGE = 15;
const CAREGIVER_NAME = "Sarah Miller";

// Aggregated metrics from all dashboard/log pages
const REPORTS_MOCK = {
  dateRange: { start: "2024-01-01", end: "2024-01-16" },
  wellbeing: { score: 85, trend: "up", moodStability: "Stable", fallsThisMonth: 0 },
  meals: { avgCalories: 395, nutritionScore: 85, missedThisWeek: 1, mealsPerDay: 2.8 },
  pt: { weeklyCompliance: 57, sessionsCompleted: 4, avgPerWeek: 4.2 },
  medications: { adherenceRate: 88, missedToday: 1, streakDays: 12 },
  hydration: { avgOz: 52, goalOz: 64, compliance: 81 },
  restroom: { avgVisits: 4.2, avgDuration: "3.1 min" },
  appointments: { total: 6, completed: 3, adherence: 83 },
  environment: { co2: "Normal", voc: "Elevated", temp: "72°F", humidity: "45%" },
  incidents: { falls: 0, alerts: 3 },
};

const METRIC_CATEGORIES = [
  { id: "all", label: "All Metrics", icon: BarChart3 },
  { id: "wellbeing", label: "Well-being", icon: Heart },
  { id: "meals", label: "Meals & Nutrition", icon: Utensils },
  { id: "pt", label: "PT & Exercise", icon: Activity },
  { id: "medications", label: "Medications", icon: Pill },
  { id: "hydration", label: "Hydration", icon: Droplets },
  { id: "restroom", label: "Restroom", icon: MapPin },
  { id: "appointments", label: "Appointments", icon: Calendar },
  { id: "environment", label: "Environment", icon: Thermometer },
  { id: "incidents", label: "Incidents & Safety", icon: Shield },
];

export default function ReportsPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedCardCategory, setSelectedCardCategory] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(new Date(2024, 0, 1));
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date(2024, 0, 16));
  const [showCalendar, setShowCalendar] = useState<"from" | "to" | null>(null);
  const [detailsPage, setDetailsPage] = useState(0);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const displayCategory = selectedCardCategory;
  const metricsToShow = useMemo(() => {
    if (categoryFilter === "all") return METRIC_CATEGORIES.slice(1);
    return METRIC_CATEGORIES.filter((c) => c.id === categoryFilter);
  }, [categoryFilter]);

  const buildReportData = useCallback((category: string) => {
    const data: Record<string, unknown>[] = [];
    const r = REPORTS_MOCK;
    const period = `${dateFrom?.toLocaleDateString() ?? "—"} to ${dateTo?.toLocaleDateString() ?? "—"}`;

    if (category === "all" || category === "wellbeing") {
      data.push({ Category: "Well-being", Metric: "Score", Value: r.wellbeing.score, Period: period });
      data.push({ Category: "Well-being", Metric: "Mood Stability", Value: r.wellbeing.moodStability, Period: period });
      data.push({ Category: "Well-being", Metric: "Falls This Month", Value: r.wellbeing.fallsThisMonth, Period: period });
    }
    if (category === "all" || category === "meals") {
      data.push({ Category: "Meals", Metric: "Avg Daily Calories", Value: r.meals.avgCalories, Period: period });
      data.push({ Category: "Meals", Metric: "Nutrition Score", Value: `${r.meals.nutritionScore}%`, Period: period });
      data.push({ Category: "Meals", Metric: "Missed This Week", Value: r.meals.missedThisWeek, Period: period });
      data.push({ Category: "Meals", Metric: "Meals Per Day", Value: r.meals.mealsPerDay, Period: period });
    }
    if (category === "all" || category === "pt") {
      data.push({ Category: "PT & Exercise", Metric: "Weekly Compliance", Value: `${r.pt.weeklyCompliance}%`, Period: period });
      data.push({ Category: "PT & Exercise", Metric: "Sessions Completed", Value: r.pt.sessionsCompleted, Period: period });
      data.push({ Category: "PT & Exercise", Metric: "Avg Sessions/Week", Value: r.pt.avgPerWeek, Period: period });
    }
    if (category === "all" || category === "medications") {
      data.push({ Category: "Medications", Metric: "Adherence Rate", Value: `${r.medications.adherenceRate}%`, Period: period });
      data.push({ Category: "Medications", Metric: "Streak Days", Value: r.medications.streakDays, Period: period });
    }
    if (category === "all" || category === "hydration") {
      data.push({ Category: "Hydration", Metric: "Avg Oz", Value: r.hydration.avgOz, Period: period });
      data.push({ Category: "Hydration", Metric: "Goal Oz", Value: r.hydration.goalOz, Period: period });
      data.push({ Category: "Hydration", Metric: "Compliance", Value: `${r.hydration.compliance}%`, Period: period });
    }
    if (category === "all" || category === "restroom") {
      data.push({ Category: "Restroom", Metric: "Avg Daily Visits", Value: r.restroom.avgVisits, Period: period });
      data.push({ Category: "Restroom", Metric: "Avg Duration", Value: r.restroom.avgDuration, Period: period });
    }
    if (category === "all" || category === "appointments") {
      data.push({ Category: "Appointments", Metric: "Total", Value: r.appointments.total, Period: period });
      data.push({ Category: "Appointments", Metric: "Completed", Value: r.appointments.completed, Period: period });
      data.push({ Category: "Appointments", Metric: "Adherence", Value: `${r.appointments.adherence}%`, Period: period });
    }
    if (category === "all" || category === "environment") {
      data.push({ Category: "Environment", Metric: "CO₂", Value: r.environment.co2, Period: period });
      data.push({ Category: "Environment", Metric: "VOC", Value: r.environment.voc, Period: period });
      data.push({ Category: "Environment", Metric: "Temperature", Value: r.environment.temp, Period: period });
      data.push({ Category: "Environment", Metric: "Humidity", Value: r.environment.humidity, Period: period });
    }
    if (category === "all" || category === "incidents") {
      data.push({ Category: "Incidents", Metric: "Falls", Value: r.incidents.falls, Period: period });
      data.push({ Category: "Incidents", Metric: "Alerts", Value: r.incidents.alerts, Period: period });
    }
    return data;
  }, [dateFrom, dateTo]);

  const reportDataForDisplay = useMemo(
    () => buildReportData(displayCategory),
    [buildReportData, displayCategory]
  );

  const totalDetailsPages = Math.max(1, Math.ceil(reportDataForDisplay.length / ITEMS_PER_PAGE));
  const paginatedDetails = reportDataForDisplay.slice(
    detailsPage * ITEMS_PER_PAGE,
    (detailsPage + 1) * ITEMS_PER_PAGE
  );

  const handleDownloadCSV = () => {
    const data = buildReportData(categoryFilter);
    const headers = ["Category", "Metric", "Value", "Period"];
    const csv = [headers.join(","), ...data.map((row) => headers.map((h) => `"${row[h] ?? ""}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `betti-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSample = async () => {
    setIsExportingPdf(true);
    try {
      const { jsPDF } = await import("jspdf");
      const data = buildReportData(categoryFilter);
      const period = `${dateFrom?.toLocaleDateString() ?? "—"} to ${dateTo?.toLocaleDateString() ?? "—"}`;
      const generatedAt = new Date().toLocaleString();

      const doc = new jsPDF("p", "mm", "a4");
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 20;
      let y = margin;

      doc.setFillColor(35, 62, 125); // #233E7D
      doc.setDrawColor(35, 62, 125);
      doc.setLineWidth(1);

      doc.setFontSize(22);
      doc.setTextColor(35, 62, 125);
      doc.setFont("helvetica", "bold");
      doc.text("Betti", margin, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.setFont("helvetica", "normal");
      doc.text("Be Empowered Through Technology and Innovation", margin, y);
      y += 8;
      doc.setFontSize(14);
      doc.setTextColor(92, 127, 57); // #5C7F39
      doc.setFont("helvetica", "bold");
      doc.text("Health & Wellness Report", margin, y);
      y += 10;
      doc.setFontSize(11);
      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "normal");
      doc.text(`Report Period: ${period}`, margin, y);
      y += 6;
      doc.text("Resident: Margaret Johnson", margin, y);
      y += 5;
      doc.text(`Caregiver: ${CAREGIVER_NAME}`, margin, y);
      y += 5;
      doc.setTextColor(35, 62, 125);
      doc.setFont("helvetica", "bold");
      doc.text(`Report generated: ${generatedAt}`, margin, y);
      y += 12;
      doc.setDrawColor(35, 62, 125);
      doc.line(margin, y, pageW - margin, y);
      y += 10;

      const colW = [(pageW - 2 * margin) * 0.08, (pageW - 2 * margin) * 0.28, (pageW - 2 * margin) * 0.34, (pageW - 2 * margin) * 0.3];
      const startX = margin;

      doc.setFillColor(35, 62, 125);
      doc.rect(startX, y, colW[0] + colW[1] + colW[2] + colW[3], 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("#", startX + 2, y + 5.5);
      doc.text("Category", startX + colW[0] + 2, y + 5.5);
      doc.text("Metric", startX + colW[0] + colW[1] + 2, y + 5.5);
      doc.text("Value", startX + colW[0] + colW[1] + colW[2] + 2, y + 5.5);
      y += 8;

      doc.setTextColor(31, 41, 55);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      for (let i = 0; i < data.length; i++) {
        if (y > pageH - 35) {
          doc.addPage();
          y = margin;
        }
        if (i % 2 === 1) {
          doc.setFillColor(249, 250, 251);
          doc.rect(startX, y - 4, colW[0] + colW[1] + colW[2] + colW[3], 7, "F");
        }
        doc.text(String(i + 1), startX + 2, y + 1);
        doc.text(String(data[i].Category ?? ""), startX + colW[0] + 2, y + 1);
        doc.text(String(data[i].Metric ?? ""), startX + colW[0] + colW[1] + 2, y + 1);
        doc.setTextColor(35, 62, 125);
        doc.text(String(data[i].Value ?? ""), startX + colW[0] + colW[1] + colW[2] + 2, y + 1);
        doc.setTextColor(31, 41, 55);
        y += 7;
      }

      y += 10;
      if (y > pageH - 30) {
        doc.addPage();
        y = margin;
      }
      doc.setDrawColor(92, 127, 57);
      doc.line(margin, y, pageW - margin, y);
      y += 8;
      doc.setFontSize(9);
      doc.setTextColor(35, 62, 125);
      doc.setFont("helvetica", "bold");
      doc.text("Generated by Betti Senior Dashboard", margin, y);
      y += 5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(`Report generated on ${generatedAt}`, margin, y);
      y += 5;
      doc.text("© Betti. Confidential health information.", margin, y);

      doc.save(`betti-health-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Reports & Analysis
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor all tracked metrics across your dashboard and logs
          </p>
        </div>

        {/* Filters & Download */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-[#233E7D]" />
                <span className="font-semibold text-gray-900">Filters</span>
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setSelectedCardCategory(e.target.value);
                  setDetailsPage(0);
                }}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent bg-white"
              >
                {METRIC_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <div className="flex gap-2 items-center">
                <div className="relative">
                  <button
                    onClick={() => setShowCalendar(showCalendar === "from" ? null : "from")}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    From: {dateFrom?.toLocaleDateString() ?? "Select"}
                  </button>
                  {showCalendar === "from" && (
                    <div className="absolute top-full left-0 mt-1 z-20 bg-white border rounded-lg shadow-lg p-2">
                      <CalendarComponent mode="single" selected={dateFrom} onSelect={(d) => { setDateFrom(d); setShowCalendar(null); }} />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowCalendar(showCalendar === "to" ? null : "to")}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    To: {dateTo?.toLocaleDateString() ?? "Select"}
                  </button>
                  {showCalendar === "to" && (
                    <div className="absolute top-full left-0 mt-1 z-20 bg-white border rounded-lg shadow-lg p-2">
                      <CalendarComponent mode="single" selected={dateTo} onSelect={(d) => { setDateTo(d); setShowCalendar(null); }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleDownloadCSV} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
              <Button onClick={handleDownloadSample} disabled={isExportingPdf} className="gap-2 bg-[#233E7D] hover:bg-[#1c3266]">
                <Download className="h-4 w-4" />
                {isExportingPdf ? "Generating PDF…" : "Download Report"}
              </Button>
            </div>
          </div>
        </div>

        {/* Metrics Overview Cards - active buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {METRIC_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const r = REPORTS_MOCK as Record<string, Record<string, unknown>>;
            const vals = r[cat.id];
            const summary = vals
              ? typeof vals === "object"
                ? Object.entries(vals)
                  .slice(0, 2)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" · ")
                : String(vals)
              : "";
            const isSelected = selectedCardCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCardCategory(cat.id);
                  setCategoryFilter(cat.id);
                  setDetailsPage(0);
                }}
                className={`rounded-xl border p-4 text-left hover:shadow-md transition-all ${
                  isSelected
                    ? "border-[#233E7D] bg-[#233E7D]/5 ring-2 ring-[#233E7D]/30"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`h-5 w-5 ${isSelected ? "text-[#233E7D]" : "text-gray-600"}`} />
                  <span className="font-semibold text-gray-900">{cat.label}</span>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{summary || "View details below"}</p>
              </button>
            );
          })}
        </div>

        {/* Detailed Metrics Table - scrollable, paginated, numbered */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4 flex-shrink-0">
            <BarChart3 className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">
              Metric Details
              {selectedCardCategory !== "all" && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  — {METRIC_CATEGORIES.find((c) => c.id === selectedCardCategory)?.label}
                </span>
              )}
            </h2>
          </div>
          <div className="overflow-auto max-h-[400px] flex-1 min-h-0">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 w-12">#</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Metric</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Value</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDetails.map((row, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500 font-medium">
                      {detailsPage * ITEMS_PER_PAGE + i + 1}
                    </td>
                    <td className="py-3 px-4">{String(row.Category)}</td>
                    <td className="py-3 px-4">{String(row.Metric)}</td>
                    <td className="py-3 px-4 font-medium text-[#233E7D]">{String(row.Value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalDetailsPages > 1 && (
            <div className="flex-shrink-0 flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Showing {detailsPage * ITEMS_PER_PAGE + 1}–{Math.min((detailsPage + 1) * ITEMS_PER_PAGE, reportDataForDisplay.length)} of {reportDataForDisplay.length}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDetailsPage((p) => Math.max(0, p - 1))}
                  disabled={detailsPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600 px-2">{detailsPage + 1} / {totalDetailsPages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDetailsPage((p) => Math.min(totalDetailsPages - 1, p + 1))}
                  disabled={detailsPage >= totalDetailsPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="rounded-xl bg-[#233E7D] p-6 text-center">
          <h3 className="font-serif text-lg font-semibold text-white mb-2">Comprehensive Health Insights</h3>
          <p className="text-white/90 text-sm leading-relaxed max-w-2xl mx-auto">
            Reports aggregate data from your Daily Well-being, Meals, PT & Exercise, Medications, Hydration, Restroom Activity, Appointments, and Environment monitoring. Filter by category and date range, then download as CSV or branded PDF report.
          </p>
        </div>
      </div>
    </div>
  );
}

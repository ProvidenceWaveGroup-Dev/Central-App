"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarIcon, Clock, Plus, User, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "missed" | "rescheduled";

type AppointmentRow = {
  appointment_id: number;
  patient_id: number;
  provider_name: string | null;
  appointment_type: string | null;
  start_time: string | null;
  end_time: string | null;
  status: AppointmentStatus | null;
  notes: string | null;
  patient_first_name?: string | null;
  patient_last_name?: string | null;
};

type AssignedPatient = {
  patient_id: number;
  patient_name: string;
  is_primary?: boolean;
};

type AssignedPatientRow = {
  patient_id?: number | string;
  patient_name?: string;
  is_primary?: boolean;
};

const statusBadgeStyles: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800 border border-blue-300",
  completed: "bg-green-100 text-green-800 border border-green-300",
  cancelled: "bg-gray-100 text-gray-800 border border-gray-300",
  missed: "bg-red-100 text-red-800 border border-red-300",
  rescheduled: "bg-yellow-100 text-yellow-800 border border-yellow-300",
};

const toIso = (value: string): string | null => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString();
};

const parseApiError = async (response: Response, fallback: string): Promise<string> => {
  try {
    const payload = await response.json();
    if (typeof payload?.detail === "string" && payload.detail.trim()) {
      return payload.detail;
    }
  } catch {
    // ignore parse fallback
  }
  return fallback;
};

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const decoded = atob(padded);
    const parsed = JSON.parse(decoded);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
};

const resolveUserId = (): string | null => {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const queryToken = params.get("betti_token") || params.get("token");
  if (queryToken) {
    localStorage.setItem("betti_token", queryToken);
  }
  const queryUserId = Number(params.get("betti_user_id") || params.get("user_id"));
  if (Number.isFinite(queryUserId) && queryUserId > 0) {
    localStorage.setItem("betti_user_id", String(queryUserId));
    return String(queryUserId);
  }
  const stored = localStorage.getItem("betti_user_id");
  const storedNum = Number(stored);
  if (Number.isFinite(storedNum) && storedNum > 0) {
    return String(storedNum);
  }
  const token = localStorage.getItem("betti_token");
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  const sub = payload?.sub;
  const userId = Number(sub);
  if (!Number.isFinite(userId) || userId <= 0) {
    return null;
  }
  localStorage.setItem("betti_user_id", String(userId));
  return String(userId);
};

const formatDateTime = (value: string | null): string => {
  if (!value) return "N/A";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "N/A";
  return parsed.toLocaleString();
};

export default function CalendarPage() {
  // TODO: re-enable when backend is available
  // const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [appointments, setAppointments] = useState<AppointmentRow[]>([]);
  const [currentPatient, setCurrentPatient] = useState<AssignedPatient | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [formWarning, setFormWarning] = useState("");
  const [assignmentWarning, setAssignmentWarning] = useState("");

  const [providerName, setProviderName] = useState("");
  const [appointmentType, setAppointmentType] = useState("home_checkup");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [notes, setNotes] = useState("");

  // TODO: re-enable when backend is available
  /*
  const authHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("betti_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const authHeaderOnly = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("betti_token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };
  */

  const loadData = async () => {
    // TODO: re-enable when backend is available
    /*
    setIsLoading(true);
    setError("");
    setAssignmentWarning("");
    try {
      const userId = resolveUserId();
      if (!userId) {
        const email = typeof window !== "undefined" ? localStorage.getItem("betti_user_email") : null;
        setCurrentPatient({
          patient_id: 0,
          patient_name: email || "Current Account",
        });
        setAppointments([]);
        setAssignmentWarning("Session missing. Please login again.");
        return;
      }
      const assignmentRows: AssignedPatient[] = [];
      const assignedRes = await fetch(`${apiUrl}/api/users/${userId}/assigned-patients?active_only=true`, {
        headers: authHeaderOnly(),
      });
      if (assignedRes.ok) {
        const assignedPayload = await assignedRes.json();
        const assignedRows = Array.isArray(assignedPayload)
          ? (assignedPayload as AssignedPatientRow[])
          : [];
        assignedRows.forEach((row) => {
          const pid = Number(row?.patient_id);
          if (!Number.isFinite(pid) || pid <= 0) return;
          assignmentRows.push({
            patient_id: pid,
            patient_name: row?.patient_name || `Patient ${pid}`,
            is_primary: Boolean(row?.is_primary),
          });
        });
      }

      const uniquePatients = Array.from(new Map(assignmentRows.map((row) => [row.patient_id, row])).values());
      const primaryPatient = uniquePatients.find((patient) => patient.is_primary) || uniquePatients[0] || null;
      setCurrentPatient(primaryPatient);
      if (!primaryPatient) {
        let fallbackName = `User ${userId}`;
        try {
          const userRes = await fetch(`${apiUrl}/api/users/${userId}`, {
            headers: authHeaderOnly(),
          });
          if (userRes.ok) {
            const profile = await userRes.json();
            const first = String(profile?.first_name || "").trim();
            const last = String(profile?.last_name || "").trim();
            fallbackName =
              `${first} ${last}`.trim() || String(profile?.email || "").trim() || fallbackName;
          }
        } catch {
          // ignore fallback lookup errors
        }
        setCurrentPatient({
          patient_id: 0,
          patient_name: fallbackName,
        });
        setAppointments([]);
        setAssignmentWarning("No patient assignment found for this account.");
        return;
      }

      const appointmentsRes = await fetch(`${apiUrl}/api/appointments?limit=500`);
      if (!appointmentsRes.ok) {
        throw new Error("Failed to load calendar appointments");
      }
      const appointmentsPayload = (await appointmentsRes.json()) as AppointmentRow[];
      const filtered = (appointmentsPayload || []).filter(
        (row) => Number(row.patient_id) === primaryPatient.patient_id,
      );
      setAppointments(filtered);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load appointments");
      setAppointments([]);
      setCurrentPatient(null);
    } finally {
      setIsLoading(false);
    }
    */
  };

  useEffect(() => {
    void loadData();
  }, []);

  const selectedDateAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const dateKey = appointment.start_time ? appointment.start_time.slice(0, 10) : "";
      return dateKey === selectedDate;
    });
  }, [appointments, selectedDate]);

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      const aTime = new Date(a.start_time || 0).getTime();
      const bTime = new Date(b.start_time || 0).getTime();
      return aTime - bTime;
    });
  }, [appointments]);

  const createAppointment = async () => {
    setFormWarning("");
    if (!currentPatient || currentPatient.patient_id <= 0) {
      setFormWarning("No patient is linked to this login. Contact admin.");
      return;
    }
    if (!providerName.trim() || !startTime) {
      setFormWarning("Provider and start time are required.");
      return;
    }
    const startIso = toIso(startTime);
    const endIso = toIso(endTime);
    if (!startIso) {
      setFormWarning("Please enter a valid start date/time.");
      return;
    }
    if (endTime && !endIso) {
      setFormWarning("Please enter a valid end date/time.");
      return;
    }
    if (startIso && endIso && new Date(endIso).getTime() < new Date(startIso).getTime()) {
      setFormWarning("End time must be after start time.");
      return;
    }
    setIsSaving(true);
    setActionMessage("");
    // TODO: re-enable when backend is available
    /*
    try {
      const response = await fetch(`${apiUrl}/api/appointments`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          patient_id: Number(currentPatient.patient_id),
          provider_name: providerName.trim(),
          appointment_type: appointmentType.trim(),
          start_time: startIso,
          end_time: endIso,
          status: "scheduled",
          notes: notes.trim() || null,
        }),
      });
      if (!response.ok) {
        const detail = await parseApiError(response, "Failed to create appointment");
        throw new Error(detail);
      }
      setProviderName("");
      setAppointmentType("home_checkup");
      setStartTime("");
      setEndTime("");
      setNotes("");
      setActionMessage("Appointment added.");
      setFormWarning("");
      await loadData();
    } catch (createError) {
      setActionMessage(createError instanceof Error ? createError.message : "Failed to create appointment");
    } finally {
      setIsSaving(false);
    }
    */
    setIsSaving(false);
  };

  const markCompleted = async (appointmentId: number) => {
    setIsSaving(true);
    setActionMessage("");
    // TODO: re-enable when backend is available
    /*
    try {
      const response = await fetch(`${apiUrl}/api/appointments/${appointmentId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status: "completed" }),
      });
      if (!response.ok) {
        const detail = await parseApiError(response, "Failed to update appointment");
        throw new Error(detail);
      }
      setActionMessage(`Appointment #${appointmentId} marked completed.`);
      await loadData();
    } catch (updateError) {
      setActionMessage(updateError instanceof Error ? updateError.message : "Failed to update appointment");
    } finally {
      setIsSaving(false);
    }
    */
    setIsSaving(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </Link>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Caregiver Calendar</h1>
            <p className="text-sm text-gray-500 mt-1">Live visit and wellness check scheduling for assigned residents.</p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-4 py-2 text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}
        {actionMessage && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 text-gray-700 px-4 py-2 text-sm">
            {actionMessage}
          </div>
        )}
        {formWarning && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-800 px-4 py-2 text-sm">
            {formWarning}
          </div>
        )}
        {assignmentWarning && (
          <div className="rounded-lg border border-amber-300 bg-amber-50 text-amber-800 px-4 py-2 text-sm">
            {assignmentWarning}
          </div>
        )}

        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Plus className="h-5 w-5 text-[#5C7F39]" />
            Add Appointment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Resident</label>
              <input
                value={currentPatient?.patient_name || "Current Account"}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
              <input
                value={providerName}
                onChange={(event) => setProviderName(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Dr. Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <input
                value={appointmentType}
                onChange={(event) => setAppointmentType(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="home_visit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Care notes"
              />
            </div>
          </div>
          <button
            onClick={() => void createAppointment()}
            disabled={isSaving || !currentPatient || currentPatient.patient_id <= 0}
            className="inline-flex items-center gap-2 rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a6a2e] transition-colors disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            Save Appointment
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <CalendarIcon className="h-5 w-5 text-[#5C7F39]" />
                Calendar View
              </h2>
            </div>
            <label htmlFor="date-selector" className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              id="date-selector"
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Total Appointments:</span> {appointments.length}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Selected Date:</span>{" "}
                {format(new Date(selectedDate), "MMMM d, yyyy")}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Clock className="h-5 w-5 text-[#5C7F39]" />
                {format(new Date(selectedDate), "MMMM d, yyyy")}
              </h2>
            </div>
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : selectedDateAppointments.length > 0 ? (
              <div className="space-y-3">
                {selectedDateAppointments.map((appointment) => {
                  const status = String(appointment.status || "scheduled").toLowerCase();
                  const patientName = `${appointment.patient_first_name || ""} ${appointment.patient_last_name || ""}`.trim();
                  return (
                    <div key={appointment.appointment_id} className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <User className="h-5 w-5 text-[#233E7D] flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {(appointment.appointment_type || "Appointment").replaceAll("_", " ")}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBadgeStyles[status] || statusBadgeStyles.scheduled}`}>
                            {status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {patientName ? `${patientName} • ` : ""}{appointment.provider_name || "Provider"}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap text-xs text-gray-600">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span>{formatDateTime(appointment.start_time)}</span>
                        </div>
                        {appointment.notes && <p className="text-xs text-gray-600 mt-1">{appointment.notes}</p>}
                        {status !== "completed" && (
                          <button
                            onClick={() => void markCompleted(appointment.appointment_id)}
                            disabled={isSaving}
                            className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#233E7D] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#1c3266] transition-colors disabled:opacity-60"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No appointments scheduled for this date</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Upcoming Appointments</h2>
          {sortedAppointments.length === 0 ? (
            <div className="text-sm text-gray-500">No appointments available.</div>
          ) : (
            <div className="space-y-3">
              {sortedAppointments.map((appointment) => {
                const status = String(appointment.status || "scheduled").toLowerCase();
                const patientName = `${appointment.patient_first_name || ""} ${appointment.patient_last_name || ""}`.trim();
                return (
                  <div key={appointment.appointment_id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <User className="h-5 w-5 text-[#233E7D] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {(appointment.appointment_type || "Appointment").replaceAll("_", " ")}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {patientName ? `${patientName} • ` : ""}{appointment.provider_name || "Provider"}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-gray-600">
                        <CalendarIcon className="h-3 w-3 text-gray-400" />
                        <span>{formatDateTime(appointment.start_time)}</span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBadgeStyles[status] || statusBadgeStyles.scheduled}`}>
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

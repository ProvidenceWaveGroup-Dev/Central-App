"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarClock, Pencil, Plus, Search, Trash2 } from "lucide-react";

type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "missed" | "rescheduled";

type ApiPatient = {
  patient_id: number;
  first_name: string;
  last_name: string;
  facility_id: number | null;
};

type ApiAppointment = {
  appointment_id: number;
  patient_id: number;
  provider_name: string | null;
  appointment_type: string | null;
  start_time: string | null;
  end_time: string | null;
  status: AppointmentStatus | null;
  notes: string | null;
  patient_first_name: string | null;
  patient_last_name: string | null;
  facility_name: string | null;
};

type AppointmentForm = {
  patient_id: string;
  provider_name: string;
  appointment_type: string;
  start_time: string;
  end_time: string;
  status: AppointmentStatus;
  notes: string;
};

const ITEMS_PER_PAGE = 10;
const APPOINTMENTS_LIMIT = 100;
const APPOINTMENTS_CACHE_KEY = "betti_admin_appointments_section_v1";
const APPOINTMENTS_CACHE_TTL_MS = 120000;

const defaultForm: AppointmentForm = {
  patient_id: "",
  provider_name: "",
  appointment_type: "checkup",
  start_time: "",
  end_time: "",
  status: "scheduled",
  notes: "",
};

const toInputDateTime = (value: string | null): string => {
  if (!value) {
    return "";
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return "";
  }
  const year = dt.getFullYear();
  const month = `${dt.getMonth() + 1}`.padStart(2, "0");
  const day = `${dt.getDate()}`.padStart(2, "0");
  const hour = `${dt.getHours()}`.padStart(2, "0");
  const minute = `${dt.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const toIso = (value: string): string | null => {
  if (!value) {
    return null;
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return null;
  }
  return dt.toISOString();
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

const formatDateTime = (value: string | null): string => {
  if (!value) {
    return "N/A";
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return "N/A";
  }
  return dt.toLocaleString();
};

const appointmentTypes = [
  "checkup",
  "geriatrics_consult",
  "cardiology_followup",
  "physical_therapy",
  "emergency_visit",
  "lab_review",
];

const statusStyles: Record<string, string> = {
  scheduled: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-gray-100 text-gray-700 border-gray-300",
  missed: "bg-red-50 text-red-700 border-red-200",
  rescheduled: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

export function AppointmentsSection() {
  const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [patients, setPatients] = useState<ApiPatient[]>([]);
  const [appointments, setAppointments] = useState<ApiAppointment[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AppointmentStatus>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<ApiAppointment | null>(null);
  const [form, setForm] = useState<AppointmentForm>(defaultForm);

  const authHeaders = (jsonContentType = true): Record<string, string> => {
    const headers: Record<string, string> = {};
    const token = typeof window !== "undefined" ? localStorage.getItem("betti_token") : null;
    if (jsonContentType) {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
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

  const loadData = useCallback(async () => {
    const readCache = (): { appointments: ApiAppointment[]; patients: ApiPatient[] } | null => {
      if (typeof window === "undefined") {
        return null;
      }
      try {
        const raw = sessionStorage.getItem(APPOINTMENTS_CACHE_KEY);
        if (!raw) {
          return null;
        }
        const parsed = JSON.parse(raw) as {
          ts?: number;
          appointments?: unknown;
          patients?: unknown;
        };
        const ts = Number(parsed.ts || 0);
        if (!Number.isFinite(ts) || Date.now() - ts > APPOINTMENTS_CACHE_TTL_MS) {
          return null;
        }
        return {
          appointments: Array.isArray(parsed.appointments) ? (parsed.appointments as ApiAppointment[]) : [],
          patients: Array.isArray(parsed.patients) ? (parsed.patients as ApiPatient[]) : [],
        };
      } catch {
        return null;
      }
    };

    const writeCache = (payload: { appointments: ApiAppointment[]; patients: ApiPatient[] }) => {
      if (typeof window === "undefined") {
        return;
      }
      try {
        sessionStorage.setItem(
          APPOINTMENTS_CACHE_KEY,
          JSON.stringify({
            ts: Date.now(),
            appointments: payload.appointments,
            patients: payload.patients,
          }),
        );
      } catch {
        // ignore cache write failures
      }
    };

    const cached = readCache();
    let hasCachedData = false;
    if (cached) {
      setAppointments(cached.appointments);
      setPatients(cached.patients);
      setIsLoading(false);
      setIsRefreshing(true);
      hasCachedData = true;
    } else {
      setIsLoading(true);
      setIsRefreshing(false);
    }

    setError("");
    try {
      const headers = authHeaders(false);
      if (!headers.Authorization) {
        throw new Error(
          hasCachedData
            ? "Login session missing. Showing recently loaded appointments."
            : "Login session not found. Please sign in again.",
        );
      }
      const [appointmentsRes, patientsRes] = await Promise.all([
        fetch(`${apiUrl}/api/appointments?home_only=true&limit=${APPOINTMENTS_LIMIT}`, { headers }),
        fetch(`${apiUrl}/api/patients?home_only=true`, { headers }),
      ]);
      if (!appointmentsRes.ok || !patientsRes.ok) {
        if (appointmentsRes.status === 401 || patientsRes.status === 401) {
          throw new Error("Login session not found. Please sign in again.");
        }
        const detail = !appointmentsRes.ok
          ? await parseApiError(appointmentsRes, "Failed to load appointments")
          : await parseApiError(patientsRes, "Failed to load patient list");
        throw new Error(detail);
      }
      const [appointmentsPayload, patientsPayload] = await Promise.all([
        appointmentsRes.json().catch(() => []),
        patientsRes.json().catch(() => []),
      ]);
      const nextAppointments = toArray<ApiAppointment>(appointmentsPayload);
      const nextPatients = toArray<ApiPatient>(patientsPayload);
      setAppointments(nextAppointments);
      setPatients(nextPatients);
      writeCache({
        appointments: nextAppointments,
        patients: nextPatients,
      });
    } catch (err) {
      const fallback = hasCachedData
        ? "Live refresh timed out. Showing recently loaded appointments."
        : "Unable to load appointments";
      const message = err instanceof Error ? err.message : fallback;
      setError(message);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const resetForm = () => {
    setForm(defaultForm);
    setEditing(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const openEditDialog = (row: ApiAppointment) => {
    setEditing(row);
    setForm({
      patient_id: String(row.patient_id || ""),
      provider_name: row.provider_name || "",
      appointment_type: row.appointment_type || "checkup",
      start_time: toInputDateTime(row.start_time),
      end_time: toInputDateTime(row.end_time),
      status: (row.status || "scheduled") as AppointmentStatus,
      notes: row.notes || "",
    });
    setIsEditOpen(true);
  };

  const submitCreate = async () => {
    const startIso = toIso(form.start_time);
    const endIso = toIso(form.end_time);
    const payload = {
      patient_id: Number(form.patient_id),
      provider_name: form.provider_name.trim(),
      appointment_type: form.appointment_type.trim(),
      start_time: startIso,
      end_time: endIso,
      status: form.status,
      notes: form.notes.trim() || null,
    };
    if (!payload.patient_id || !payload.provider_name || !payload.start_time) {
      setActionMessage("Patient, provider and start time are required.");
      return;
    }
    if (form.end_time && !endIso) {
      setActionMessage("Please enter a valid end date/time.");
      return;
    }
    if (startIso && endIso && new Date(endIso).getTime() < new Date(startIso).getTime()) {
      setActionMessage("End time must be after start time.");
      return;
    }

    setIsSaving(true);
    setActionMessage("");
    try {
      const response = await fetch(`${apiUrl}/api/appointments`, {
        method: "POST",
        headers: authHeaders(true),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const detail = await parseApiError(response, "Failed to create appointment");
        throw new Error(detail);
      }
      setActionMessage("Appointment created successfully.");
      setIsCreateOpen(false);
      resetForm();
      await loadData();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Failed to create appointment");
    } finally {
      setIsSaving(false);
    }
  };

  const submitUpdate = async () => {
    if (!editing) {
      return;
    }
    const startIso = toIso(form.start_time);
    const endIso = toIso(form.end_time);
    const payload = {
      provider_name: form.provider_name.trim(),
      appointment_type: form.appointment_type.trim(),
      start_time: startIso,
      end_time: endIso,
      status: form.status,
      notes: form.notes.trim() || null,
    };
    if (!payload.provider_name || !payload.start_time) {
      setActionMessage("Provider and start time are required.");
      return;
    }
    if (form.end_time && !endIso) {
      setActionMessage("Please enter a valid end date/time.");
      return;
    }
    if (startIso && endIso && new Date(endIso).getTime() < new Date(startIso).getTime()) {
      setActionMessage("End time must be after start time.");
      return;
    }
    setIsSaving(true);
    setActionMessage("");
    try {
      const response = await fetch(`${apiUrl}/api/appointments/${editing.appointment_id}`, {
        method: "PUT",
        headers: authHeaders(true),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const detail = await parseApiError(response, "Failed to update appointment");
        throw new Error(detail);
      }
      setActionMessage("Appointment updated successfully.");
      setIsEditOpen(false);
      resetForm();
      await loadData();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Failed to update appointment");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteAppointment = async (appointmentId: number) => {
    if (!window.confirm("Delete this appointment?")) {
      return;
    }
    setIsSaving(true);
    setActionMessage("");
    try {
      const response = await fetch(`${apiUrl}/api/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: authHeaders(false),
      });
      if (!response.ok) {
        const detail = await parseApiError(response, "Failed to delete appointment");
        throw new Error(detail);
      }
      setActionMessage("Appointment deleted.");
      await loadData();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Failed to delete appointment");
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return appointments.filter((item) => {
      if (statusFilter !== "all" && (item.status || "").toLowerCase() !== statusFilter) {
        return false;
      }
      if (!q) {
        return true;
      }
      const patientName = `${item.patient_first_name || ""} ${item.patient_last_name || ""}`.trim().toLowerCase();
      return (
        patientName.includes(q) ||
        String(item.provider_name || "").toLowerCase().includes(q) ||
        String(item.appointment_type || "").toLowerCase().includes(q) ||
        String(item.facility_name || "").toLowerCase().includes(q)
      );
    });
  }, [appointments, query, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const current = Math.min(currentPage, totalPages);
  const startIndex = (current - 1) * ITEMS_PER_PAGE;
  const paginated = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const scheduledCount = appointments.filter((item) => (item.status || "scheduled") === "scheduled").length;
  const completedCount = appointments.filter((item) => item.status === "completed").length;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold">Appointments & Checkups</h1>
          <p className="text-muted-foreground mt-1">
            Schedule and manage doctor visits directly from Admin.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Appointment</DialogTitle>
              <DialogDescription>Add a doctor check-up or clinical visit.</DialogDescription>
            </DialogHeader>
            <AppointmentFormFields
              form={form}
              setForm={setForm}
              patients={patients}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={submitCreate} disabled={isSaving}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {actionMessage && (
        <Alert>
          <AlertDescription>{actionMessage}</AlertDescription>
        </Alert>
      )}
      {isRefreshing && !isLoading && (
        <Alert>
          <AlertDescription>Refreshing live appointment data...</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Appointment Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search patient/provider/type"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value as "all" | AppointmentStatus);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="missed">Missed</SelectItem>
                <SelectItem value="rescheduled">Rescheduled</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground flex items-center">
              Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
            </div>
          </div>

          {isLoading ? (
            <div className="text-sm text-muted-foreground">Loading appointments...</div>
          ) : paginated.length === 0 ? (
            <div className="text-sm text-muted-foreground">No appointments found.</div>
          ) : (
            <div className="space-y-3">
              {paginated.map((item) => {
                const patientName = `${item.patient_first_name || ""} ${item.patient_last_name || ""}`.trim();
                const status = (item.status || "scheduled").toLowerCase();
                return (
                  <div
                    key={item.appointment_id}
                    className="border rounded-lg p-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {item.appointment_type || "Appointment"} with {item.provider_name || "Provider"}
                        </h3>
                        <Badge className={statusStyles[status] || statusStyles.scheduled}>
                          {status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Patient: {patientName || `#${item.patient_id}`} | Facility: {item.facility_name || "N/A"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Start: {formatDateTime(item.start_time)} | End: {formatDateTime(item.end_time)}
                      </p>
                      {item.notes && <p className="text-sm">{item.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(item)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => void deleteAppointment(item.appointment_id)}
                        disabled={isSaving}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={current <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {current} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={current >= totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Appointment</DialogTitle>
            <DialogDescription>Update check-up details and timing.</DialogDescription>
          </DialogHeader>
          <AppointmentFormFields
            form={form}
            setForm={setForm}
            patients={patients}
            disablePatientSelect
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={submitUpdate} disabled={isSaving}>
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AppointmentFormFields({
  form,
  setForm,
  patients,
  disablePatientSelect = false,
}: {
  form: AppointmentForm;
  setForm: Dispatch<SetStateAction<AppointmentForm>>;
  patients: ApiPatient[];
  disablePatientSelect?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label>Patient</Label>
        <Select
          value={form.patient_id}
          onValueChange={(value) => setForm((prev) => ({ ...prev, patient_id: value }))}
          disabled={disablePatientSelect}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select patient" />
          </SelectTrigger>
          <SelectContent>
            {patients.map((patient) => (
              <SelectItem key={patient.patient_id} value={String(patient.patient_id)}>
                {patient.first_name} {patient.last_name} (#{patient.patient_id})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Provider / Doctor</Label>
        <Input
          value={form.provider_name}
          onChange={(event) => setForm((prev) => ({ ...prev, provider_name: event.target.value }))}
          placeholder="Dr. Smith"
        />
      </div>

      <div className="space-y-2">
        <Label>Appointment Type</Label>
        <Select
          value={form.appointment_type}
          onValueChange={(value) => setForm((prev) => ({ ...prev, appointment_type: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {appointmentTypes.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={form.status}
          onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as AppointmentStatus }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="scheduled">scheduled</SelectItem>
            <SelectItem value="completed">completed</SelectItem>
            <SelectItem value="cancelled">cancelled</SelectItem>
            <SelectItem value="missed">missed</SelectItem>
            <SelectItem value="rescheduled">rescheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Start Time</Label>
        <Input
          type="datetime-local"
          value={form.start_time}
          onChange={(event) => setForm((prev) => ({ ...prev, start_time: event.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label>End Time</Label>
        <Input
          type="datetime-local"
          value={form.end_time}
          onChange={(event) => setForm((prev) => ({ ...prev, end_time: event.target.value }))}
        />
      </div>

      <div className="md:col-span-2 space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={form.notes}
          onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
          placeholder="Visit notes, prep steps, follow-up details"
          rows={4}
        />
      </div>
    </div>
  );
}

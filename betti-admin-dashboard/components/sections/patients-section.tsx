"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Calendar,
  Heart,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  UserRoundPen,
  Users,
} from "lucide-react";
import { VOCAB } from "@/lib/vocabulary";

type Gender = "male" | "female" | "other";

type Facility = {
  facility_id: number;
  name: string;
};

type ApiPatient = {
  patient_id: number;
  facility_id: number | null;
  first_name: string;
  last_name: string;
  dob: string | null;
  gender: Gender | null;
  created_at: string;
};

type ApiAlert = {
  patient_id: number | null;
  status: string | null;
};

type ApiFacility = {
  facility_id: number;
  name: string;
};

type ApiCaregiver = {
  user_id: number;
  first_name: string;
  last_name: string;
  status?: string | null;
  is_active?: boolean;
};

type ApiPatientProfile = {
  patient_id: number;
  chronic_conditions: string | null;
  allergies: string | null;
  dnr_status: boolean;
  falls_90d: number;
  active_falls: number;
  visit_count_90d: number;
  last_hospital_visit: string | null;
  next_hospital_visit: string | null;
  latest_risk_score: number | null;
  primary_caregiver: string | null;
  latest_caregiver_note: string | null;
};

type PatientRow = ApiPatient & {
  active_alerts: number;
  chronic_conditions: string | null;
  allergies: string | null;
  dnr_status: boolean;
  falls_90d: number;
  active_falls: number;
  visit_count_90d: number;
  last_hospital_visit: string | null;
  next_hospital_visit: string | null;
  latest_risk_score: number | null;
  primary_caregiver: string | null;
  latest_caregiver_note: string | null;
};

type FilterType = "all" | "active" | "with-alerts";

const ITEMS_PER_PAGE = 8;
const PATIENT_ALERTS_LIMIT = 50;
const PATIENT_PROFILES_LIMIT = 120;
const CORE_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_ADMIN_PATIENTS_CORE_TIMEOUT_MS || "30000");
const OPTIONAL_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_ADMIN_PATIENTS_OPTIONAL_TIMEOUT_MS || "25000");
const PATIENTS_CACHE_KEY = "betti_admin_patients_section_v1";
const PATIENTS_CACHE_TTL_MS = 120000;

const emptyForm = {
  first_name: "",
  last_name: "",
  facility_id: "",
  dob: "",
  gender: "other" as Gender,
  caregiver_user_id: "",
};

const calculateAge = (dob: string | null): string => {
  if (!dob) {
    return "--";
  }
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) {
    return "--";
  }
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return `${age}`;
};

const truncateText = (value: string | null, maxLength = 60): string => {
  if (!value) {
    return "";
  }
  if (value.length <= maxLength) {
    return value;
  }
  return `${value.slice(0, maxLength - 1)}...`;
};

const formatDateTime = (value: string | null): string => {
  if (!value) {
    return "N/A";
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }
  return parsed.toLocaleString();
};

export function PatientsSection() {
  // TODO: re-enable when backend is available
  // const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [caregivers, setCaregivers] = useState<ApiCaregiver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<PatientRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // TODO: re-enable when backend is available
  /*
  const getAuthHeaders = (withJsonContentType = true): Record<string, string> => {
    const headers: Record<string, string> = {};
    const token = typeof window !== "undefined" ? localStorage.getItem("betti_token") : null;
    if (withJsonContentType) {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };
  */

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

  // TODO: re-enable when backend is available
  /*
  const fetchWithTimeout = async (
    url: string,
    init: RequestInit,
    timeoutMs = CORE_TIMEOUT_MS,
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
    return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      window.clearTimeout(timeoutId);
    }
  };
  */

  const facilityMap = useMemo(
    () => new Map(facilities.map((facility) => [facility.facility_id, facility.name])),
    [facilities],
  );

  const readCachedData = (): {
    patients: PatientRow[];
    facilities: Facility[];
    caregivers: ApiCaregiver[];
  } | null => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const raw = sessionStorage.getItem(PATIENTS_CACHE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw) as {
        ts?: number;
        patients?: unknown;
        facilities?: unknown;
        caregivers?: unknown;
      };
      const ts = Number(parsed.ts || 0);
      if (!Number.isFinite(ts) || Date.now() - ts > PATIENTS_CACHE_TTL_MS) {
        return null;
      }
      return {
        patients: Array.isArray(parsed.patients) ? (parsed.patients as PatientRow[]) : [],
        facilities: Array.isArray(parsed.facilities) ? (parsed.facilities as Facility[]) : [],
        caregivers: Array.isArray(parsed.caregivers) ? (parsed.caregivers as ApiCaregiver[]) : [],
      };
    } catch {
      return null;
    }
  };

  const writeCachedData = (payload: {
    patients: PatientRow[];
    facilities: Facility[];
    caregivers: ApiCaregiver[];
  }) => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      sessionStorage.setItem(
        PATIENTS_CACHE_KEY,
        JSON.stringify({
          ts: Date.now(),
          patients: payload.patients,
          facilities: payload.facilities,
          caregivers: payload.caregivers,
        }),
      );
    } catch {
      // ignore cache write failures
    }
  };

  const loadPatients = useCallback(async () => {
    // TODO: re-enable when backend is available
    /*
    const cached = readCachedData();
    let hasCachedData = false;
    if (cached) {
      setPatients(cached.patients);
      setFacilities(cached.facilities);
      setCaregivers(cached.caregivers);
      setIsLoading(false);
      setIsRefreshing(true);
      hasCachedData = true;
    } else {
      setIsLoading(true);
      setIsRefreshing(false);
    }
    setLoadError("");
    try {
      const authHeaders = getAuthHeaders(false);
      if (!authHeaders.Authorization) {
        setLoadError(
          hasCachedData
            ? "Session not found. Showing recently loaded patient data."
            : "Login session not found. Please sign in again.",
        );
        if (!hasCachedData) {
          setPatients([]);
          setFacilities([]);
          setCaregivers([]);
        }
        setIsRefreshing(false);
        setIsLoading(false);
        return;
      }
      const [patientsPrimaryRes, alertsPrimaryRes, facilitiesPrimaryRes] =
        await Promise.all([
          fetchWithTimeout(`${apiUrl}/api/patients?home_only=true`, { headers: authHeaders }, CORE_TIMEOUT_MS),
          fetchWithTimeout(
            `${apiUrl}/api/alerts?limit=${PATIENT_ALERTS_LIMIT}&home_only=true`,
            { headers: authHeaders },
            CORE_TIMEOUT_MS,
          ),
          fetchWithTimeout(`${apiUrl}/api/facilities?home_only=true`, { headers: authHeaders }, CORE_TIMEOUT_MS),
        ]);

      const patientsRes = patientsPrimaryRes.ok
        ? patientsPrimaryRes
        : await fetchWithTimeout(`${apiUrl}/api/patients`, { headers: authHeaders }, CORE_TIMEOUT_MS);
      const alertsRes = alertsPrimaryRes.ok
        ? alertsPrimaryRes
        : await fetchWithTimeout(
            `${apiUrl}/api/alerts?limit=${PATIENT_ALERTS_LIMIT}`,
            { headers: authHeaders },
            CORE_TIMEOUT_MS,
          );
      const facilitiesRes = facilitiesPrimaryRes.ok
        ? facilitiesPrimaryRes
        : await fetchWithTimeout(`${apiUrl}/api/facilities`, { headers: authHeaders }, CORE_TIMEOUT_MS);

      // Optional feeds: slow responses here should not fail the whole patient section.
      let profilesRes: Response | null = null;
      let caregiversRes: Response | null = null;
      try {
        const profilesPrimary = await fetchWithTimeout(
          `${apiUrl}/api/patient-profiles?limit=${PATIENT_PROFILES_LIMIT}&home_only=true`,
          { headers: authHeaders },
          OPTIONAL_TIMEOUT_MS,
        );
        profilesRes = profilesPrimary.ok
          ? profilesPrimary
          : await fetchWithTimeout(
              `${apiUrl}/api/patient-profiles?limit=${PATIENT_PROFILES_LIMIT}`,
              { headers: authHeaders },
              OPTIONAL_TIMEOUT_MS,
            );
      } catch {
        profilesRes = null;
      }
      try {
        const caregiversPrimary = await fetchWithTimeout(
          `${apiUrl}/api/caregivers?home_only=true`,
          { headers: authHeaders },
          OPTIONAL_TIMEOUT_MS,
        );
        caregiversRes = caregiversPrimary.ok
          ? caregiversPrimary
          : await fetchWithTimeout(`${apiUrl}/api/caregivers`, { headers: authHeaders }, OPTIONAL_TIMEOUT_MS);
      } catch {
        caregiversRes = null;
      }

      // Patients + alerts are required for this screen. Facilities are optional and
      // can degrade gracefully on unstable networks.
      if (!patientsRes.ok || !alertsRes.ok) {
        throw new Error("Failed to load patient data");
      }

      const [patientsPayload, alertsPayload, facilitiesPayload] = await Promise.all([
        patientsRes.json().catch(() => []),
        alertsRes.json().catch(() => []),
        facilitiesRes.json().catch(() => []),
      ]);
      const patientsData = toArray<ApiPatient>(patientsPayload);
      const alertsData = toArray<ApiAlert>(alertsPayload);
      const facilitiesData = facilitiesRes.ok ? toArray<ApiFacility>(facilitiesPayload) : [];
      const caregiversData: ApiCaregiver[] = caregiversRes?.ok
        ? toArray<ApiCaregiver>(await caregiversRes.json().catch(() => []))
        : [];
      const profilesData: ApiPatientProfile[] = profilesRes?.ok
        ? toArray<ApiPatientProfile>(await profilesRes.json().catch(() => []))
        : [];
      const profileMap = new Map<number, ApiPatientProfile>();
      (profilesData || []).forEach((profile) => {
        const patientId = Number(profile.patient_id);
        if (!Number.isFinite(patientId)) {
          return;
        }
        profileMap.set(patientId, profile);
      });

      const activeAlertCounts = new Map<number, number>();
      (alertsData || []).forEach((alert) => {
        if (alert.status !== "active") {
          return;
        }
        const patientId = Number(alert.patient_id);
        if (!Number.isFinite(patientId)) {
          return;
        }
        activeAlertCounts.set(patientId, (activeAlertCounts.get(patientId) || 0) + 1);
      });

      const mappedPatients: PatientRow[] = (patientsData || []).map((item) => ({
        ...item,
        active_alerts: activeAlertCounts.get(item.patient_id) || 0,
        chronic_conditions: profileMap.get(item.patient_id)?.chronic_conditions || null,
        allergies: profileMap.get(item.patient_id)?.allergies || null,
        dnr_status: Boolean(profileMap.get(item.patient_id)?.dnr_status),
        falls_90d: Number(profileMap.get(item.patient_id)?.falls_90d || 0),
        active_falls: Number(profileMap.get(item.patient_id)?.active_falls || 0),
        visit_count_90d: Number(profileMap.get(item.patient_id)?.visit_count_90d || 0),
        last_hospital_visit: profileMap.get(item.patient_id)?.last_hospital_visit || null,
        next_hospital_visit: profileMap.get(item.patient_id)?.next_hospital_visit || null,
        latest_risk_score:
          profileMap.get(item.patient_id)?.latest_risk_score !== null &&
          profileMap.get(item.patient_id)?.latest_risk_score !== undefined
            ? Number(profileMap.get(item.patient_id)?.latest_risk_score)
            : null,
        primary_caregiver: profileMap.get(item.patient_id)?.primary_caregiver || null,
        latest_caregiver_note: profileMap.get(item.patient_id)?.latest_caregiver_note || null,
      }));

      const mappedFacilities: Facility[] = (facilitiesData || []).map((item) => ({
        facility_id: Number(item.facility_id),
        name: item.name || `Facility ${item.facility_id}`,
      }));
      const mappedCaregivers: ApiCaregiver[] = (caregiversData || []).filter((item) => {
        const userId = Number(item.user_id);
        if (!Number.isFinite(userId) || userId <= 0) {
          return false;
        }
        const status = String(item.status || "").toLowerCase();
        if (item.is_active === false) {
          return false;
        }
        if (status && status !== "active") {
          return false;
        }
        return true;
      });

      setPatients(mappedPatients);
      setFacilities(mappedFacilities);
      setCaregivers(mappedCaregivers);
      writeCachedData({
        patients: mappedPatients,
        facilities: mappedFacilities,
        caregivers: mappedCaregivers,
      });
    } catch {
      if (hasCachedData) {
        setLoadError("Live refresh timed out. Showing recently loaded patient data.");
      } else {
        setLoadError("Unable to load patient data from API.");
        setPatients([]);
        setFacilities([]);
        setCaregivers([]);
      }
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
    */
  }, []);

  useEffect(() => {
    loadPatients();
  }, [loadPatients]);

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.trim().toLowerCase();
    const facilityName = patient.facility_id ? (facilityMap.get(patient.facility_id) || "") : "unassigned";
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const matchesSearch =
      !query ||
      fullName.includes(query) ||
      String(patient.patient_id).includes(query) ||
      facilityName.toLowerCase().includes(query) ||
      (patient.chronic_conditions || "").toLowerCase().includes(query) ||
      (patient.primary_caregiver || "").toLowerCase().includes(query);

    if (!matchesSearch) {
      return false;
    }

    if (activeFilter === "with-alerts") {
      return patient.active_alerts > 0;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPatients.length / ITEMS_PER_PAGE));
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalAlerts = patients.reduce((sum, row) => sum + row.active_alerts, 0);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingPatient(null);
  };

  const openEditDialog = (patient: PatientRow) => {
    const primaryCaregiverName = (patient.primary_caregiver || "").trim().toLowerCase();
    const matchedCaregiver = caregivers.find((caregiver) => {
      const caregiverName = `${caregiver.first_name || ""} ${caregiver.last_name || ""}`.trim().toLowerCase();
      return caregiverName && caregiverName === primaryCaregiverName;
    });
    setEditingPatient(patient);
    setForm({
      first_name: patient.first_name,
      last_name: patient.last_name,
      facility_id: patient.facility_id ? String(patient.facility_id) : "",
      dob: patient.dob ? new Date(patient.dob).toISOString().slice(0, 10) : "",
      gender: patient.gender || "other",
      caregiver_user_id: matchedCaregiver ? String(matchedCaregiver.user_id) : "",
    });
    setIsEditOpen(true);
  };

  const parseApiError = async (response: Response) => {
    const fallback = "Request failed";
    try {
      const payload = await response.json();
      return payload?.detail || fallback;
    } catch {
      return fallback;
    }
  };

  // TODO: re-enable when backend is available
  /*
  const upsertPrimaryCaregiver = async (
    patientId: number,
    caregiverUserId: string,
  ): Promise<{ ok: boolean; detail?: string }> => {
    const normalizedCaregiverId = caregiverUserId.trim();
    const payload = {
      patient_id: patientId,
      caregiver_user_id: normalizedCaregiverId ? Number(normalizedCaregiverId) : null,
      is_primary: true,
    };
    try {
      const response = await fetch(`${apiUrl}/api/patient-caregiver-assignment`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        return { ok: false, detail: await parseApiError(response) };
      }
      return { ok: true };
    } catch {
      return { ok: false, detail: "Unable to update caregiver assignment." };
    }
  };
  */

  const handleCreatePatient = async () => {
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setLoadError("First and last name are required.");
      return;
    }
    const selectedFacilityId = form.facility_id
      ? Number(form.facility_id)
      : (facilities[0]?.facility_id ?? NaN);
    if (!Number.isFinite(selectedFacilityId) || selectedFacilityId <= 0) {
      setLoadError("Select a facility before adding a resident.");
      return;
    }
    setIsMutating(true);
    setLoadError("");
    setActionMessage("");
    // TODO: re-enable when backend is available
    /*
    try {
      const response = await fetch(`${apiUrl}/api/patients`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          facility_id: selectedFacilityId,
          dob: form.dob || null,
          gender: form.gender || null,
        }),
      });
      if (!response.ok) {
        setLoadError(await parseApiError(response));
        return;
      }
      const createdPayload = await response.json().catch(() => ({}));
      const createdPatientId = Number(createdPayload?.patient_id || 0);
      if (form.caregiver_user_id.trim() && createdPatientId > 0) {
        const assignmentResult = await upsertPrimaryCaregiver(createdPatientId, form.caregiver_user_id);
        if (!assignmentResult.ok) {
          setLoadError(`Patient created but caregiver assignment failed: ${assignmentResult.detail || "Request failed"}`);
        }
      }
      setIsCreateOpen(false);
      resetForm();
      setActionMessage("Patient created successfully.");
      await loadPatients();
    } catch {
      setLoadError("Unable to create patient.");
    } finally {
      setIsMutating(false);
    }
    */
    setIsMutating(false);
  };

  const handleUpdatePatient = async () => {
    if (!editingPatient) {
      return;
    }
    if (!form.first_name.trim() || !form.last_name.trim()) {
      setLoadError("First and last name are required.");
      return;
    }
    setIsMutating(true);
    setLoadError("");
    setActionMessage("");
    // TODO: re-enable when backend is available
    /*
    try {
      const response = await fetch(`${apiUrl}/api/patients/${editingPatient.patient_id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          first_name: form.first_name.trim(),
          last_name: form.last_name.trim(),
          facility_id: form.facility_id ? Number(form.facility_id) : null,
          dob: form.dob || null,
          gender: form.gender || null,
        }),
      });
      if (!response.ok) {
        setLoadError(await parseApiError(response));
        return;
      }

      const assignmentResult = await upsertPrimaryCaregiver(
        editingPatient.patient_id,
        form.caregiver_user_id,
      );
      if (!assignmentResult.ok) {
        setLoadError(`Patient updated but caregiver assignment failed: ${assignmentResult.detail || "Request failed"}`);
        return;
      }

      setIsEditOpen(false);
      resetForm();
      setActionMessage("Patient and caregiver assignment updated successfully.");
      await loadPatients();
    } catch {
      setLoadError("Unable to update patient.");
    } finally {
      setIsMutating(false);
    }
    */
    setIsMutating(false);
  };

  const handleDeletePatient = async (patient: PatientRow) => {
    const confirmed = window.confirm(
      `Delete resident ${patient.first_name} ${patient.last_name}? This action cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }
    setIsMutating(true);
    setLoadError("");
    setActionMessage("");
    // TODO: re-enable when backend is available
    /*
    try {
      const response = await fetch(`${apiUrl}/api/patients/${patient.patient_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(false),
      });
      if (!response.ok) {
        setLoadError(await parseApiError(response));
        return;
      }
      setActionMessage("Patient deleted successfully.");
      await loadPatients();
    } catch {
      setLoadError("Unable to delete patient.");
    } finally {
      setIsMutating(false);
    }
    */
    setIsMutating(false);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">
      {actionMessage && (
        <Alert className="mb-4 border-emerald-200 bg-emerald-50/60 text-emerald-700">
          <AlertDescription>{actionMessage}</AlertDescription>
        </Alert>
      )}

      {loadError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Alert className="mb-4">
          <AlertDescription>Loading patients...</AlertDescription>
        </Alert>
      )}

      {isRefreshing && !isLoading && (
        <Alert className="mb-4">
          <AlertDescription>Refreshing live patient data...</AlertDescription>
        </Alert>
      )}

      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{VOCAB.RESIDENTS}</h1>
            <p className="text-muted-foreground">Manage resident records from live database data</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add {VOCAB.RESIDENT}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Add {VOCAB.RESIDENT}</DialogTitle>
                <DialogDescription>Create a new resident record in the database.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-first-name">First Name</Label>
                    <Input
                      id="patient-first-name"
                      value={form.first_name}
                      onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-last-name">Last Name</Label>
                    <Input
                      id="patient-last-name"
                      value={form.last_name}
                      onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-dob">Date of Birth</Label>
                    <Input
                      id="patient-dob"
                      type="date"
                      value={form.dob}
                      onChange={(event) => setForm((prev) => ({ ...prev, dob: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-gender">Gender</Label>
                    <Select
                      value={form.gender}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, gender: value as Gender }))}
                    >
                      <SelectTrigger id="patient-gender">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-facility">Facility</Label>
                  <Select
                    value={form.facility_id || (facilities[0] ? String(facilities[0].facility_id) : "")}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, facility_id: value }))}
                  >
                    <SelectTrigger id="patient-facility">
                      <SelectValue placeholder="Select facility" />
                    </SelectTrigger>
                    <SelectContent>
                      {facilities.map((facility) => (
                        <SelectItem key={facility.facility_id} value={String(facility.facility_id)}>
                          {facility.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-caregiver">Primary Caregiver</Label>
                  <Select
                    value={form.caregiver_user_id || "none"}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, caregiver_user_id: value === "none" ? "" : value }))}
                  >
                    <SelectTrigger id="patient-caregiver">
                      <SelectValue placeholder="Select caregiver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Unassigned</SelectItem>
                      {caregivers.map((caregiver) => (
                        <SelectItem key={caregiver.user_id} value={String(caregiver.user_id)}>
                          {`${caregiver.first_name} ${caregiver.last_name}`.trim() || `Caregiver ${caregiver.user_id}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isMutating}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePatient} disabled={isMutating}>
                  {isMutating ? "Adding..." : `Add ${VOCAB.RESIDENT}`}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search by name, ID, or facility..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card
            className={`cursor-pointer transition-all ${activeFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => {
              setActiveFilter("all");
              setCurrentPage(1);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{patients.length}</div>
                  <div className="text-xs text-muted-foreground">Total {VOCAB.RESIDENTS}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${activeFilter === "active" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => {
              setActiveFilter("active");
              setCurrentPage(1);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                  <Heart className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{patients.length}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${activeFilter === "with-alerts" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => {
              setActiveFilter("with-alerts");
              setCurrentPage(1);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-amber-100 p-2 dark:bg-amber-900/30">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalAlerts}</div>
                  <div className="text-xs text-muted-foreground">Active Alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>{VOCAB.RESIDENT} List ({filteredPatients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">{VOCAB.RESIDENT}</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Facility</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Support Profile</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Falls / Risk</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Care Plan</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Alerts</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Created</th>
                    <th className="p-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPatients.map((patient) => (
                    <tr key={patient.patient_id} className="border-b hover:bg-muted/40">
                      <td className="p-3">
                        <div className="font-medium">
                          {patient.first_name} {patient.last_name}
                        </div>
                        <div className="text-xs text-muted-foreground">ID: {patient.patient_id}</div>
                        <div className="text-xs text-muted-foreground">
                          {calculateAge(patient.dob)} yrs | {patient.gender || "N/A"}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        {patient.facility_id ? facilityMap.get(patient.facility_id) || `Facility ${patient.facility_id}` : "Unassigned"}
                      </td>
                      <td className="p-3 text-sm">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">
                            {truncateText(patient.chronic_conditions, 58) || "No noted conditions"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Allergies: {truncateText(patient.allergies, 42) || "None listed"}
                          </span>
                          {patient.dnr_status && (
                            <Badge variant="outline" className="w-fit border-amber-300 text-amber-700">
                              DNR
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        <div className="flex flex-col gap-1">
                          <Badge variant={patient.active_falls > 0 ? "destructive" : "outline"} className="w-fit">
                            {patient.falls_90d} falls / 90d
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Risk: {patient.latest_risk_score !== null ? `${Math.round(patient.latest_risk_score * 100)}%` : "N/A"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Visits (90d): {patient.visit_count_90d}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{patient.primary_caregiver || "Unassigned caregiver"}</span>
                          <span className="text-xs text-muted-foreground">
                            Last visit: {formatDateTime(patient.last_hospital_visit)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Next visit: {formatDateTime(patient.next_hospital_visit)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Note: {truncateText(patient.latest_caregiver_note, 44) || "No recent notes"}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        {patient.active_alerts > 0 ? (
                          <Badge variant="destructive">
                            {patient.active_alerts} active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">None</Badge>
                        )}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(patient.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(patient)}>
                              <UserRoundPen className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={() => handleDeletePatient(patient)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {paginatedPatients.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-sm text-muted-foreground">
                        No patients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-shrink-0 border-t bg-background pt-4">
        <PaginationControlled
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredPatients.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Edit {VOCAB.RESIDENT}</DialogTitle>
            <DialogDescription>Update resident details and save to database.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-patient-first-name">First Name</Label>
                <Input
                  id="edit-patient-first-name"
                  value={form.first_name}
                  onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-patient-last-name">Last Name</Label>
                <Input
                  id="edit-patient-last-name"
                  value={form.last_name}
                  onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-patient-dob">Date of Birth</Label>
                <Input
                  id="edit-patient-dob"
                  type="date"
                  value={form.dob}
                  onChange={(event) => setForm((prev) => ({ ...prev, dob: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-patient-gender">Gender</Label>
                <Select
                  value={form.gender}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, gender: value as Gender }))}
                >
                  <SelectTrigger id="edit-patient-gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-patient-facility">Facility</Label>
              <Select
                value={form.facility_id || "none"}
                onValueChange={(value) => setForm((prev) => ({ ...prev, facility_id: value === "none" ? "" : value }))}
              >
                <SelectTrigger id="edit-patient-facility">
                  <SelectValue placeholder="Select facility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {facilities.map((facility) => (
                    <SelectItem key={facility.facility_id} value={String(facility.facility_id)}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-patient-caregiver">Primary Caregiver</Label>
              <Select
                value={form.caregiver_user_id || "none"}
                onValueChange={(value) => setForm((prev) => ({ ...prev, caregiver_user_id: value === "none" ? "" : value }))}
              >
                <SelectTrigger id="edit-patient-caregiver">
                  <SelectValue placeholder="Select caregiver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {caregivers.map((caregiver) => (
                    <SelectItem key={caregiver.user_id} value={String(caregiver.user_id)}>
                      {`${caregiver.first_name} ${caregiver.last_name}`.trim() || `Caregiver ${caregiver.user_id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditOpen(false);
                resetForm();
              }}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdatePatient} disabled={isMutating}>
              {isMutating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

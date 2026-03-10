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
  Building2,
  MapPin,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  UserRoundPen,
  Users,
} from "lucide-react";

type FacilityType = "assisted_living" | "hospital" | "senior_living" | "home_care";
type FacilityStatus = "active" | "inactive" | "pending";

type ApiFacility = {
  facility_id: number;
  name: string;
  address: string | null;
  facility_type: FacilityType;
  status: FacilityStatus;
  is_active: boolean | number;
  archived_at: string | null;
};

type FacilityRow = ApiFacility & {
  patient_count: number;
};

type ApiPatient = {
  patient_id: number;
  facility_id: number | null;
};

const ITEMS_PER_PAGE = 6;

const facilityTypeLabels: Record<FacilityType, string> = {
  assisted_living: "Assisted Living",
  hospital: "Hospital",
  senior_living: "Senior Living",
  home_care: "Home Care",
};

const emptyForm = {
  name: "",
  address: "",
  facility_type: "senior_living" as FacilityType,
  status: "active" as FacilityStatus,
  is_active: true,
};

export function FacilitiesSection() {
  const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [facilities, setFacilities] = useState<FacilityRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<FacilityRow | null>(null);
  const [form, setForm] = useState(emptyForm);

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

  const loadFacilities = useCallback(async () => {
    setLoadError("");
    try {
      const headers = getAuthHeaders(false);
      if (!headers.Authorization) {
        setLoadError("Login session not found. Please sign in again.");
        setFacilities([]);
        setIsLoading(false);
        return;
      }
      const [facilitiesRes, patientsRes] = await Promise.all([
        fetch(`${apiUrl}/api/facilities?home_only=true`, { headers }),
        fetch(`${apiUrl}/api/patients?home_only=true`, { headers }),
      ]);

      if (!facilitiesRes.ok) {
        throw new Error("Failed to load facilities");
      }

      const facilitiesData = toArray<ApiFacility>(await facilitiesRes.json().catch(() => []));
      const patientsData = patientsRes.ok
        ? toArray<ApiPatient>(await patientsRes.json().catch(() => []))
        : [];

      const counts = new Map<number, number>();
      (patientsData as ApiPatient[]).forEach((patient) => {
        if (patient.facility_id == null) {
          return;
        }
        counts.set(patient.facility_id, (counts.get(patient.facility_id) || 0) + 1);
      });

      const mapped: FacilityRow[] = (facilitiesData || []).map((item) => ({
        ...item,
        patient_count: counts.get(item.facility_id) || 0,
      }));

      setFacilities(mapped);
      if (!patientsRes.ok) {
        setLoadError("Facilities loaded with partial context (patient counts unavailable).");
      }
    } catch {
      setLoadError("Unable to load facilities from API.");
      setFacilities([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadFacilities();
  }, [loadFacilities]);

  const filteredFacilities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return facilities.filter((facility) => {
      if (!query) {
        return true;
      }
      return (
        facility.name.toLowerCase().includes(query) ||
        (facility.address || "").toLowerCase().includes(query) ||
        facilityTypeLabels[facility.facility_type].toLowerCase().includes(query)
      );
    });
  }, [facilities, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE));
  const paginatedFacilities = filteredFacilities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalPatients = facilities.reduce((sum, facility) => sum + facility.patient_count, 0);
  const activeFacilities = facilities.filter((facility) => Boolean(facility.is_active)).length;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingFacility(null);
  };

  const parseApiError = async (response: Response) => {
    try {
      const payload = await response.json();
      return payload?.detail || "Request failed";
    } catch {
      return "Request failed";
    }
  };

  const handleCreateFacility = async () => {
    if (!form.name.trim()) {
      setLoadError("Facility name is required.");
      return;
    }
    setIsMutating(true);
    setLoadError("");
    setActionMessage("");
    try {
      const response = await fetch(`${apiUrl}/api/facilities`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: form.name.trim(),
          address: form.address.trim() || null,
          facility_type: form.facility_type,
          status: form.status,
          is_active: form.is_active,
        }),
      });
      if (!response.ok) {
        setLoadError(await parseApiError(response));
        return;
      }
      setIsCreateOpen(false);
      resetForm();
      setActionMessage("Facility created successfully.");
      await loadFacilities();
    } catch {
      setLoadError("Unable to create facility.");
    } finally {
      setIsMutating(false);
    }
  };

  const openEditDialog = (facility: FacilityRow) => {
    setEditingFacility(facility);
    setForm({
      name: facility.name,
      address: facility.address || "",
      facility_type: facility.facility_type,
      status: facility.status,
      is_active: Boolean(facility.is_active),
    });
    setIsEditOpen(true);
  };

  const handleUpdateFacility = async () => {
    if (!editingFacility) {
      return;
    }
    if (!form.name.trim()) {
      setLoadError("Facility name is required.");
      return;
    }
    setIsMutating(true);
    setLoadError("");
    setActionMessage("");
    try {
      const response = await fetch(`${apiUrl}/api/facilities/${editingFacility.facility_id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: form.name.trim(),
          address: form.address.trim() || null,
          facility_type: form.facility_type,
          status: form.status,
          is_active: form.is_active,
        }),
      });
      if (!response.ok) {
        setLoadError(await parseApiError(response));
        return;
      }
      setIsEditOpen(false);
      resetForm();
      setActionMessage("Facility updated successfully.");
      await loadFacilities();
    } catch {
      setLoadError("Unable to update facility.");
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteFacility = async (facility: FacilityRow) => {
    const confirmed = window.confirm(
      `Delete facility "${facility.name}"? This action cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }
    setIsMutating(true);
    setLoadError("");
    setActionMessage("");
    try {
      const response = await fetch(`${apiUrl}/api/facilities/${facility.facility_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(false),
      });
      if (!response.ok) {
        setLoadError(await parseApiError(response));
        return;
      }
      setActionMessage("Facility deleted successfully.");
      await loadFacilities();
    } catch {
      setLoadError("Unable to delete facility.");
    } finally {
      setIsMutating(false);
    }
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
          <AlertDescription>Loading facilities...</AlertDescription>
        </Alert>
      )}

      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Facilities</h1>
            <p className="text-muted-foreground">Manage facilities from live database records</p>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Facility
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
              <DialogHeader>
                <DialogTitle>Add Facility</DialogTitle>
                <DialogDescription>Create a new facility record.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="facility-name">Name</Label>
                  <Input
                    id="facility-name"
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Providence Wave Group"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facility-address">Address</Label>
                  <Input
                    id="facility-address"
                    value={form.address}
                    onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
                    placeholder="1200 Health Ave, Seattle, WA"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facility-type">Type</Label>
                    <Select
                      value={form.facility_type}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, facility_type: value as FacilityType }))}
                    >
                      <SelectTrigger id="facility-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(facilityTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facility-status">Status</Label>
                    <Select
                      value={form.status}
                      onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as FacilityStatus }))}
                    >
                      <SelectTrigger id="facility-status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facility-active">Operational</Label>
                  <Select
                    value={form.is_active ? "yes" : "no"}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, is_active: value === "yes" }))}
                  >
                    <SelectTrigger id="facility-active">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isMutating}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFacility} disabled={isMutating}>
                  {isMutating ? "Creating..." : "Create Facility"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search facilities..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{facilities.length}</div>
                  <div className="text-xs text-muted-foreground">Facilities</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/30">
                  <Users className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalPatients}</div>
                  <div className="text-xs text-muted-foreground">Patients</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-100 p-2 dark:bg-violet-900/30">
                  <MapPin className="h-5 w-5 text-violet-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeFacilities}</div>
                  <div className="text-xs text-muted-foreground">Operational</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Facility List ({filteredFacilities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paginatedFacilities.map((facility) => (
                <div key={facility.facility_id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{facility.name}</h3>
                        <Badge variant={facility.status === "active" ? "default" : "secondary"}>
                          {facility.status}
                        </Badge>
                        <Badge variant={facility.is_active ? "outline" : "secondary"}>
                          {facility.is_active ? "Operational" : "Offline"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{facility.address || "No address provided"}</p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span>Type: {facilityTypeLabels[facility.facility_type]}</span>
                        <span>Patients: {facility.patient_count}</span>
                        <span>ID: {facility.facility_id}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(facility)}>
                          <UserRoundPen className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-destructive"
                          onClick={() => handleDeleteFacility(facility)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {paginatedFacilities.length === 0 && (
                <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
                  No facilities found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex-shrink-0 border-t bg-background pt-4">
        <PaginationControlled
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredFacilities.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Edit Facility</DialogTitle>
            <DialogDescription>Update facility details in the database.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-facility-name">Name</Label>
              <Input
                id="edit-facility-name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-facility-address">Address</Label>
              <Input
                id="edit-facility-address"
                value={form.address}
                onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-facility-type">Type</Label>
                <Select
                  value={form.facility_type}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, facility_type: value as FacilityType }))}
                >
                  <SelectTrigger id="edit-facility-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(facilityTypeLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-facility-status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as FacilityStatus }))}
                >
                  <SelectTrigger id="edit-facility-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-facility-active">Operational</Label>
              <Select
                value={form.is_active ? "yes" : "no"}
                onValueChange={(value) => setForm((prev) => ({ ...prev, is_active: value === "yes" }))}
              >
                <SelectTrigger id="edit-facility-active">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
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
            <Button onClick={handleUpdateFacility} disabled={isMutating}>
              {isMutating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

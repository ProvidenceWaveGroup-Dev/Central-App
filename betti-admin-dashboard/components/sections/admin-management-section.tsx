"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { PaginationControlled } from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Calendar,
  CheckCircle,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Shield,
  Trash2,
  UserCog,
  UserRoundPen,
  XCircle,
} from "lucide-react";

type FacilityOption = {
  facility_id: number;
  name: string;
};

type Admin = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: "active" | "suspended";
  created_at: string;
  role_name: string | null;
  facility_id: number | null;
  facility_name: string | null;
  facility_role: "admin" | "staff" | "security" | "ems" | "fire_service" | "caregiver" | "senior" | null;
  last_login_at: string | null;
  is_active: boolean | number | null;
};

type ApiAdmin = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: string;
  created_at: string;
  role_name: string | null;
  facility_id: number | null;
  facility_name: string | null;
  facility_role: Admin["facility_role"];
  last_login_at: string | null;
  is_active: boolean | number | null;
};

type ApiFacility = {
  facility_id: number;
  name: string;
};

const facilityRoles = [
  { value: "admin", label: "Administrator", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  { value: "staff", label: "Staff", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "security", label: "Security", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  { value: "ems", label: "EMS", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { value: "fire_service", label: "Fire Service", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  { value: "caregiver", label: "Caregiver", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  { value: "senior", label: "Senior", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
] as const;

const getRoleConfig = (role: string | null | undefined) =>
  facilityRoles.find((item) => item.value === role) || facilityRoles[0];

const ADMINS_PER_PAGE = 6;
type StatusFilterType = "all" | "active" | "suspended";

const emptyCreateForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  facility_id: "",
  facility_role: "admin",
  password: "",
  confirm_password: "",
};

const emptyEditForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  facility_id: "",
  facility_role: "admin",
};

export function AdminManagementSection() {
  const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [facilityOptions, setFacilityOptions] = useState<FacilityOption[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<StatusFilterType>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [newAdmin, setNewAdmin] = useState(emptyCreateForm);
  const [editForm, setEditForm] = useState(emptyEditForm);

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

  const parseApiError = async (response: Response) => {
    try {
      const payload = await response.json();
      return payload?.detail || "Request failed";
    } catch {
      return "Request failed";
    }
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

  const fetchWithTimeout = async (
    url: string,
    init: RequestInit,
    timeoutMs = 12000,
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const headers = getAuthHeaders(false);
      if (!headers.Authorization) {
        setLoadError("Login session not found. Please sign in again.");
        setAdmins([]);
        setFacilityOptions([]);
        setIsLoading(false);
        return;
      }
      const [usersRes, facilitiesRes] = await Promise.all([
        fetchWithTimeout(`${apiUrl}/api/users?role=admin`, { headers }),
        fetchWithTimeout(`${apiUrl}/api/facilities`, { headers }),
      ]);

      const effectiveUsersRes = usersRes.ok
        ? usersRes
        : await fetchWithTimeout(`${apiUrl}/api/users`, { headers });
      const effectiveFacilitiesRes = facilitiesRes.ok
        ? facilitiesRes
        : await fetchWithTimeout(`${apiUrl}/api/facilities?home_only=true`, { headers });

      if (!effectiveUsersRes.ok) {
        throw new Error("Failed to load admin data");
      }

      const [usersPayload, facilitiesPayload] = await Promise.all([
        effectiveUsersRes.json().catch(() => []),
        effectiveFacilitiesRes.ok
          ? effectiveFacilitiesRes.json().catch(() => [])
          : Promise.resolve([]),
      ]);
      const users = toArray<ApiAdmin>(usersPayload);
      const facilities = toArray<ApiFacility>(facilitiesPayload);
      const mappedAdmins: Admin[] = (users || [])
        .filter((item) => String(item.role_name || "admin").toLowerCase() === "admin")
        .map((item) => ({
        user_id: Number(item.user_id),
        first_name: item.first_name || "",
        last_name: item.last_name || "",
        email: item.email || "",
        phone: item.phone || null,
        status: item.status === "suspended" ? "suspended" : "active",
        created_at: item.created_at || new Date().toISOString(),
        role_name: item.role_name || "admin",
        facility_id: item.facility_id ?? null,
        facility_name: item.facility_name || null,
        facility_role: item.facility_role || "admin",
        last_login_at: item.last_login_at || null,
        is_active: item.is_active ?? 1,
      }));

      const mappedFacilities: FacilityOption[] = (facilities || []).map((facility) => ({
        facility_id: Number(facility.facility_id),
        name: facility.name || `Facility ${facility.facility_id}`,
      }));

      setAdmins(mappedAdmins);
      setFacilityOptions(mappedFacilities);
      if (!effectiveFacilitiesRes.ok) {
        setLoadError("Admin accounts loaded with partial context (facility list unavailable).");
      }
    } catch {
      setLoadError("Unable to load admin data.");
      setAdmins([]);
      setFacilityOptions([]);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredAdmins = useMemo(
    () =>
      admins.filter((admin) => {
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          admin.first_name.toLowerCase().includes(query) ||
          admin.last_name.toLowerCase().includes(query) ||
          admin.email.toLowerCase().includes(query) ||
          (admin.facility_name || "").toLowerCase().includes(query);

        if (!matchesSearch) {
          return false;
        }

        if (activeFilter === "all") {
          return true;
        }
        return admin.status === activeFilter;
      }),
    [admins, searchQuery, activeFilter],
  );

  const totalPages = Math.max(1, Math.ceil(filteredAdmins.length / ADMINS_PER_PAGE));
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * ADMINS_PER_PAGE,
    currentPage * ADMINS_PER_PAGE,
  );

  const activeAdmins = admins.filter((admin) => admin.status === "active").length;
  const suspendedAdmins = admins.filter((admin) => admin.status === "suspended").length;

  const formatDate = (dateStr: string): string =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatLastLogin = (dateStr: string | null): string => {
    if (!dateStr) {
      return "Never";
    }
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    if (diffHours < 1) {
      return "Just now";
    }
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
    if (diffDays === 1) {
      return "Yesterday";
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    return formatDate(dateStr);
  };

  const resetCreateForm = () => {
    setNewAdmin(emptyCreateForm);
  };

  const resetEditForm = () => {
    setEditingAdmin(null);
    setEditForm(emptyEditForm);
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.first_name.trim() || !newAdmin.last_name.trim()) {
      setLoadError("First and last name are required.");
      return;
    }
    if (!newAdmin.email.trim()) {
      setLoadError("Email is required.");
      return;
    }
    if (!newAdmin.password || newAdmin.password.length < 8) {
      setLoadError("Password must be at least 8 characters.");
      return;
    }
    if (newAdmin.password !== newAdmin.confirm_password) {
      setLoadError("Password and confirm password do not match.");
      return;
    }

    setIsMutating(true);
    setLoadError("");
    setActionMessage("");
    try {
      const response = await fetch(`${apiUrl}/api/users`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          first_name: newAdmin.first_name.trim(),
          last_name: newAdmin.last_name.trim(),
          email: newAdmin.email.trim(),
          phone: newAdmin.phone.trim() || null,
          password: newAdmin.password,
          role: "admin",
          facility_id: newAdmin.facility_id ? Number(newAdmin.facility_id) : null,
          facility_role: newAdmin.facility_role,
        }),
      });

      if (!response.ok) {
        setLoadError(await parseApiError(response));
        return;
      }

      setIsAddDialogOpen(false);
      resetCreateForm();
      setActionMessage("Administrator created successfully.");
      await loadData();
    } catch {
      setLoadError("Unable to create administrator.");
    } finally {
      setIsMutating(false);
    }
  };

  const openEditDialog = (admin: Admin) => {
    setEditingAdmin(admin);
    setEditForm({
      first_name: admin.first_name,
      last_name: admin.last_name,
      email: admin.email,
      phone: admin.phone || "",
      facility_id: admin.facility_id ? String(admin.facility_id) : "",
      facility_role: admin.facility_role || "admin",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAdmin = async () => {
    if (!editingAdmin) {
      return;
    }
    if (!editForm.first_name.trim() || !editForm.last_name.trim()) {
      setLoadError("First and last name are required.");
      return;
    }
    if (!editForm.email.trim()) {
      setLoadError("Email is required.");
      return;
    }

    setIsMutating(true);
    setLoadError("");
    setActionMessage("");
    try {
      const response = await fetch(`${apiUrl}/api/users/${editingAdmin.user_id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          first_name: editForm.first_name.trim(),
          last_name: editForm.last_name.trim(),
          email: editForm.email.trim(),
          phone: editForm.phone.trim() || null,
          role: "admin",
          facility_id: editForm.facility_id ? Number(editForm.facility_id) : null,
          facility_role: editForm.facility_role,
        }),
      });

      if (!response.ok) {
        setLoadError(await parseApiError(response));
        return;
      }

      setIsEditDialogOpen(false);
      resetEditForm();
      setActionMessage("Administrator updated successfully.");
      await loadData();
    } catch {
      setLoadError("Unable to update administrator.");
    } finally {
      setIsMutating(false);
    }
  };

  const handleStatusToggle = async (admin: Admin) => {
    const targetStatus = admin.status === "active" ? "suspended" : "active";
    setIsMutating(true);
    setLoadError("");
    setActionMessage("");
    try {
      const response = await fetch(`${apiUrl}/api/users/${admin.user_id}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: targetStatus }),
      });
      if (!response.ok) {
        setLoadError(await parseApiError(response));
        return;
      }
      setActionMessage(
        `Administrator ${admin.first_name} ${admin.last_name} ${
          targetStatus === "active" ? "activated" : "suspended"
        }.`,
      );
      await loadData();
    } catch {
      setLoadError("Unable to update administrator status.");
    } finally {
      setIsMutating(false);
    }
  };

  const handleDeleteAdmin = async (admin: Admin) => {
    const confirmed = window.confirm(
      `Delete administrator ${admin.first_name} ${admin.last_name}? This action cannot be undone.`,
    );
    if (!confirmed) {
      return;
    }
    setIsMutating(true);
    setLoadError("");
    setActionMessage("");
    try {
      const response = await fetch(`${apiUrl}/api/users/${admin.user_id}`, {
        method: "DELETE",
        headers: getAuthHeaders(false),
      });
      if (!response.ok) {
        setLoadError(await parseApiError(response));
        return;
      }
      setActionMessage("Administrator deleted successfully.");
      await loadData();
    } catch {
      setLoadError("Unable to delete administrator.");
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
          <AlertDescription>Loading admin data...</AlertDescription>
        </Alert>
      )}

      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Management</h1>
            <p className="text-muted-foreground">Manage administrator accounts with live API actions</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[560px]">
              <DialogHeader>
                <DialogTitle>Add New Administrator</DialogTitle>
                <DialogDescription>Create and provision an admin account in the database.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-first-name">First Name</Label>
                    <Input
                      id="new-admin-first-name"
                      value={newAdmin.first_name}
                      onChange={(event) => setNewAdmin((prev) => ({ ...prev, first_name: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-last-name">Last Name</Label>
                    <Input
                      id="new-admin-last-name"
                      value={newAdmin.last_name}
                      onChange={(event) => setNewAdmin((prev) => ({ ...prev, last_name: event.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-admin-email">Email</Label>
                  <Input
                    id="new-admin-email"
                    type="email"
                    value={newAdmin.email}
                    onChange={(event) => setNewAdmin((prev) => ({ ...prev, email: event.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-admin-phone">Phone</Label>
                  <Input
                    id="new-admin-phone"
                    type="tel"
                    value={newAdmin.phone}
                    onChange={(event) => setNewAdmin((prev) => ({ ...prev, phone: event.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-facility">Facility</Label>
                    <Select
                      value={newAdmin.facility_id || "none"}
                      onValueChange={(value) =>
                        setNewAdmin((prev) => ({ ...prev, facility_id: value === "none" ? "" : value }))
                      }
                    >
                      <SelectTrigger id="new-admin-facility">
                        <SelectValue placeholder="Select facility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {facilityOptions.map((facility) => (
                          <SelectItem key={facility.facility_id} value={String(facility.facility_id)}>
                            {facility.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-facility-role">Facility Role</Label>
                    <Select
                      value={newAdmin.facility_role}
                      onValueChange={(value) =>
                        setNewAdmin((prev) => ({ ...prev, facility_role: value as typeof emptyCreateForm.facility_role }))
                      }
                    >
                      <SelectTrigger id="new-admin-facility-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {facilityRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-password">Password</Label>
                    <Input
                      id="new-admin-password"
                      type="password"
                      value={newAdmin.password}
                      onChange={(event) => setNewAdmin((prev) => ({ ...prev, password: event.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-admin-confirm-password">Confirm Password</Label>
                    <Input
                      id="new-admin-confirm-password"
                      type="password"
                      value={newAdmin.confirm_password}
                      onChange={(event) =>
                        setNewAdmin((prev) => ({ ...prev, confirm_password: event.target.value }))
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isMutating}>
                  Cancel
                </Button>
                <Button onClick={handleAddAdmin} disabled={isMutating}>
                  {isMutating ? "Creating..." : "Create Admin"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Search admins..."
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
                  <UserCog className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{admins.length}</div>
                  <div className="text-xs text-muted-foreground">Total Admins</div>
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
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeAdmins}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${activeFilter === "suspended" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => {
              setActiveFilter("suspended");
              setCurrentPage(1);
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/30">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{suspendedAdmins}</div>
                  <div className="text-xs text-muted-foreground">Suspended</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Administrator Accounts ({filteredAdmins.length})
            </CardTitle>
            <CardDescription>Create, update, suspend, and delete admin accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paginatedAdmins.map((admin) => (
                <div
                  key={admin.user_id}
                  className={`rounded-lg border p-4 ${
                    admin.status === "suspended"
                      ? "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-900/10"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${
                          admin.status === "active" ? "bg-primary" : "bg-muted-foreground"
                        }`}
                      >
                        {admin.first_name.charAt(0)}
                        {admin.last_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {admin.first_name} {admin.last_name}
                          </h3>
                          <Badge variant={admin.status === "active" ? "default" : "destructive"}>
                            {admin.status}
                          </Badge>
                          <Badge className={getRoleConfig(admin.facility_role).color}>
                            {getRoleConfig(admin.facility_role).label}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {admin.email}
                          </span>
                          {admin.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {admin.phone}
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {admin.facility_name || "Unassigned"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {formatDate(admin.created_at)}
                          </span>
                          <span>Last login: {formatLastLogin(admin.last_login_at)}</span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => openEditDialog(admin)}>
                          <UserRoundPen className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2" onClick={() => handleStatusToggle(admin)}>
                          {admin.status === "active" ? (
                            <>
                              <XCircle className="h-4 w-4 text-orange-600" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 text-emerald-600" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 text-destructive"
                          onClick={() => handleDeleteAdmin(admin)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

              {paginatedAdmins.length === 0 && (
                <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
                  No admin users found.
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
          totalItems={filteredAdmins.length}
          itemsPerPage={ADMINS_PER_PAGE}
        />
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Edit Administrator</DialogTitle>
            <DialogDescription>Update account details and save to database.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-admin-first-name">First Name</Label>
                <Input
                  id="edit-admin-first-name"
                  value={editForm.first_name}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, first_name: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-admin-last-name">Last Name</Label>
                <Input
                  id="edit-admin-last-name"
                  value={editForm.last_name}
                  onChange={(event) => setEditForm((prev) => ({ ...prev, last_name: event.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-admin-email">Email</Label>
              <Input
                id="edit-admin-email"
                type="email"
                value={editForm.email}
                onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-admin-phone">Phone</Label>
              <Input
                id="edit-admin-phone"
                type="tel"
                value={editForm.phone}
                onChange={(event) => setEditForm((prev) => ({ ...prev, phone: event.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-admin-facility">Facility</Label>
                <Select
                  value={editForm.facility_id || "none"}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({ ...prev, facility_id: value === "none" ? "" : value }))
                  }
                >
                  <SelectTrigger id="edit-admin-facility">
                    <SelectValue placeholder="Select facility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unassigned</SelectItem>
                    {facilityOptions.map((facility) => (
                      <SelectItem key={facility.facility_id} value={String(facility.facility_id)}>
                        {facility.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-admin-facility-role">Facility Role</Label>
                <Select
                  value={editForm.facility_role}
                  onValueChange={(value) =>
                    setEditForm((prev) => ({ ...prev, facility_role: value as typeof emptyEditForm.facility_role }))
                  }
                >
                  <SelectTrigger id="edit-admin-facility-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {facilityRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                resetEditForm();
              }}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateAdmin} disabled={isMutating}>
              {isMutating ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

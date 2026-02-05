"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginationControlled } from "@/components/ui/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  UserCog,
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  Shield,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Key,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Schema-aligned interfaces based on database tables
// users table + user_credentials + facility_memberships
interface Admin {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: "active" | "suspended";
  created_at: string;
  is_active: boolean;
  // From user_credentials
  login_type: "email" | "username" | "social";
  last_login_at: string | null;
  // From facility_memberships
  facility_id: number;
  facility_name: string;
  facility_role: "admin" | "staff" | "security" | "ems" | "fire_service";
}

// Mock data based on database schema
const admins: Admin[] = [
  {
    user_id: 1,
    first_name: "Sarah",
    last_name: "Williams",
    email: "sarah.williams@betti.com",
    phone: "+1-561-555-0101",
    status: "active",
    created_at: "2024-06-15T09:00:00Z",
    is_active: true,
    login_type: "email",
    last_login_at: "2026-02-01T08:30:00Z",
    facility_id: 12,
    facility_name: "Sunrise Assisted Living – Delray",
    facility_role: "admin",
  },
  {
    user_id: 2,
    first_name: "Michael",
    last_name: "Chen",
    email: "michael.chen@betti.com",
    phone: "+1-561-555-0102",
    status: "active",
    created_at: "2024-07-20T10:30:00Z",
    is_active: true,
    login_type: "email",
    last_login_at: "2026-02-01T07:45:00Z",
    facility_id: 12,
    facility_name: "Sunrise Assisted Living – Delray",
    facility_role: "admin",
  },
  {
    user_id: 3,
    first_name: "Emily",
    last_name: "Rodriguez",
    email: "emily.rodriguez@betti.com",
    phone: "+1-561-555-0103",
    status: "active",
    created_at: "2024-08-10T14:15:00Z",
    is_active: true,
    login_type: "email",
    last_login_at: "2026-01-31T16:20:00Z",
    facility_id: 15,
    facility_name: "Golden Oaks Senior Living",
    facility_role: "admin",
  },
  {
    user_id: 4,
    first_name: "David",
    last_name: "Thompson",
    email: "david.thompson@betti.com",
    phone: "+1-561-555-0104",
    status: "suspended",
    created_at: "2024-09-05T11:00:00Z",
    is_active: false,
    login_type: "email",
    last_login_at: "2026-01-15T09:30:00Z",
    facility_id: 12,
    facility_name: "Sunrise Assisted Living – Delray",
    facility_role: "admin",
  },
  {
    user_id: 5,
    first_name: "Jennifer",
    last_name: "Martinez",
    email: "jennifer.martinez@betti.com",
    phone: "+1-561-555-0105",
    status: "active",
    created_at: "2024-10-12T08:45:00Z",
    is_active: true,
    login_type: "email",
    last_login_at: "2026-02-01T06:15:00Z",
    facility_id: 15,
    facility_name: "Golden Oaks Senior Living",
    facility_role: "admin",
  },
  {
    user_id: 6,
    first_name: "Robert",
    last_name: "Anderson",
    email: "robert.anderson@betti.com",
    phone: "+1-561-555-0106",
    status: "active",
    created_at: "2024-11-18T13:30:00Z",
    is_active: true,
    login_type: "email",
    last_login_at: "2026-01-30T14:45:00Z",
    facility_id: 12,
    facility_name: "Sunrise Assisted Living – Delray",
    facility_role: "admin",
  },
  {
    user_id: 7,
    first_name: "Amanda",
    last_name: "Taylor",
    email: "amanda.taylor@betti.com",
    phone: null,
    status: "active",
    created_at: "2024-12-01T10:00:00Z",
    is_active: true,
    login_type: "email",
    last_login_at: "2026-02-01T05:30:00Z",
    facility_id: 18,
    facility_name: "Palm Gardens Memory Care",
    facility_role: "admin",
  },
  {
    user_id: 8,
    first_name: "Christopher",
    last_name: "Lee",
    email: "christopher.lee@betti.com",
    phone: "+1-561-555-0108",
    status: "active",
    created_at: "2025-01-08T09:15:00Z",
    is_active: true,
    login_type: "email",
    last_login_at: "2026-01-29T11:20:00Z",
    facility_id: 15,
    facility_name: "Golden Oaks Senior Living",
    facility_role: "admin",
  },
];

// Mock facilities for the dropdown
const facilities = [
  { facility_id: 12, name: "Sunrise Assisted Living – Delray" },
  { facility_id: 15, name: "Golden Oaks Senior Living" },
  { facility_id: 18, name: "Palm Gardens Memory Care" },
  { facility_id: 21, name: "Oceanview Senior Residence" },
];

// Roles based on facility_memberships.facility_role enum
const roles = [
  { value: "admin", label: "Administrator", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  { value: "staff", label: "Staff", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  { value: "security", label: "Security", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  { value: "ems", label: "EMS", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  { value: "fire_service", label: "Fire Service", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
];

const getRoleConfig = (role: string) => {
  return roles.find(r => r.value === role) || roles[0];
};

const ADMINS_PER_PAGE = 5;

type StatusFilterType = "all" | "active" | "suspended";

export function AdminManagementSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<StatusFilterType>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successAdminName, setSuccessAdminName] = useState("");

  // Form state for new admin
  const [newAdmin, setNewAdmin] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    facility_id: "",
    role: "",
    password: "",
    confirm_password: "",
  });

  // Filter admins
  const filteredAdmins = admins.filter((admin) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      admin.first_name.toLowerCase().includes(query) ||
      admin.last_name.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query) ||
      admin.facility_name.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    if (activeFilter === "all") return true;
    return admin.status === activeFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAdmins.length / ADMINS_PER_PAGE);
  const paginatedAdmins = filteredAdmins.slice(
    (currentPage - 1) * ADMINS_PER_PAGE,
    currentPage * ADMINS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: StatusFilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleAddAdmin = () => {
    // In production, this would make an API call to create the admin
    // Inserting into users, user_credentials, and facility_memberships tables
    console.log("Creating admin:", newAdmin);

    // Store the name for success message
    const adminName = `${newAdmin.first_name} ${newAdmin.last_name}`;
    setSuccessAdminName(adminName);

    // Close dialog and show success message
    setIsAddDialogOpen(false);
    setShowSuccessMessage(true);

    // Auto-hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);

    // Reset form
    setNewAdmin({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      facility_id: "",
      role: "",
      password: "",
      confirm_password: "",
    });
  };

  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLastLogin = (dateStr: string | null): string => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateStr);
  };

  const activeAdmins = admins.filter((a) => a.status === "active");
  const suspendedAdmins = admins.filter((a) => a.status === "suspended");

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Success Message */}
      {showSuccessMessage && (
        <Alert className="mb-4 border-green-300 bg-white/70 backdrop-blur-md dark:bg-white/10 dark:border-green-500">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600 dark:text-green-400">
            Administrator <span className="font-semibold">{successAdminName}</span> has been successfully created.
            Login credentials have been sent to their email address.
          </AlertDescription>
        </Alert>
      )}

      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Management</h1>
            <p className="text-muted-foreground">
              Manage administrator accounts and access permissions
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Admin
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Administrator</DialogTitle>
                <DialogDescription>
                  Create a new admin account. They will receive login credentials via email.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name *</Label>
                    <Input
                      id="first_name"
                      placeholder="John"
                      value={newAdmin.first_name}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, first_name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name *</Label>
                    <Input
                      id="last_name"
                      placeholder="Doe"
                      value={newAdmin.last_name}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, last_name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@betti.com"
                    value={newAdmin.email}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1-561-555-0000"
                    value={newAdmin.phone}
                    onChange={(e) =>
                      setNewAdmin({ ...newAdmin, phone: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facility">Assigned Facility *</Label>
                    <Select
                      value={newAdmin.facility_id}
                      onValueChange={(value) =>
                        setNewAdmin({ ...newAdmin, facility_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a facility" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilities.map((facility) => (
                          <SelectItem
                            key={facility.facility_id}
                            value={facility.facility_id.toString()}
                          >
                            {facility.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={newAdmin.role}
                      onValueChange={(value) =>
                        setNewAdmin({ ...newAdmin, role: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
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
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={newAdmin.password}
                      onChange={(e) =>
                        setNewAdmin({ ...newAdmin, password: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm_password">Confirm Password *</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      placeholder="••••••••"
                      value={newAdmin.confirm_password}
                      onChange={(e) =>
                        setNewAdmin({
                          ...newAdmin,
                          confirm_password: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAdmin}>Create Admin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search admins by name, email, or facility..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === "all"
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleFilterChange("all")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
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
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === "active"
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleFilterChange("active")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeAdmins.length}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeFilter === "suspended"
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleFilterChange("suspended")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{suspendedAdmins.length}</div>
                  <div className="text-xs text-muted-foreground">Suspended</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Administrator Accounts ({filteredAdmins.length})
            </CardTitle>
            <CardDescription>
              View and manage all administrator accounts in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paginatedAdmins.map((admin) => (
                <div
                  key={admin.user_id}
                  className={`p-4 border rounded-lg ${
                    admin.status === "suspended"
                      ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                          admin.status === "active"
                            ? "bg-primary"
                            : "bg-muted-foreground"
                        }`}
                      >
                        {admin.first_name[0]}
                        {admin.last_name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">
                            {admin.first_name} {admin.last_name}
                          </h3>
                          <Badge
                            variant={
                              admin.status === "active" ? "default" : "destructive"
                            }
                          >
                            {admin.status}
                          </Badge>
                          <Badge className={getRoleConfig(admin.facility_role).color}>
                            {getRoleConfig(admin.facility_role).label}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {admin.email}
                          </span>
                          {admin.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {admin.phone}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {admin.facility_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Joined {formatDate(admin.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Key className="h-3 w-3" />
                            Last login: {formatLastLogin(admin.last_login_at)}
                          </span>
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
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Key className="h-4 w-4" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {admin.status === "active" ? (
                          <DropdownMenuItem className="gap-2 text-orange-600">
                            <XCircle className="h-4 w-4" />
                            Suspend Account
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="gap-2 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            Activate Account
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="gap-2 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Delete Admin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fixed Pagination at Bottom */}
      <div className="flex-shrink-0 pt-4 border-t bg-background">
        <PaginationControlled
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredAdmins.length}
          itemsPerPage={ADMINS_PER_PAGE}
        />
      </div>
    </div>
  );
}

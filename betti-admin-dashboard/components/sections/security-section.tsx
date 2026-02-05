"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  Key,
  UserCog,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";

// Schema-aligned: audit_logs table
interface AuditLog {
  log_id: number;
  user_id: number;
  user_email: string; // Joined from users table
  action: string;
  target_type: "alert" | "patient" | "user" | "facility" | "device" | "settings" | "auth";
  target_id: number | null;
  ip_address: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

const auditLogs: AuditLog[] = [
  {
    log_id: 10521,
    user_id: 340,
    user_email: "angela.reyes@sunrise.com",
    action: "ACKNOWLEDGE_ALERT",
    target_type: "alert",
    target_id: 9021,
    ip_address: "73.182.44.10",
    timestamp: "2026-02-01T06:50:00Z",
    status: "success"
  },
  {
    log_id: 10520,
    user_id: 1,
    user_email: "admin@betti.com",
    action: "LOGIN_SUCCESS",
    target_type: "auth",
    target_id: null,
    ip_address: "192.168.1.100",
    timestamp: "2026-02-01T06:45:00Z",
    status: "success"
  },
  {
    log_id: 10518,
    user_id: 341,
    user_email: "john.davis@sunrise.com",
    action: "VIEW_PATIENT_RECORD",
    target_type: "patient",
    target_id: 502,
    ip_address: "73.182.44.15",
    timestamp: "2026-02-01T06:30:00Z",
    status: "success"
  },
  {
    log_id: 10515,
    user_id: 0,
    user_email: "unknown",
    action: "LOGIN_FAILED",
    target_type: "auth",
    target_id: null,
    ip_address: "45.33.32.156",
    timestamp: "2026-02-01T05:15:00Z",
    status: "warning"
  },
  {
    log_id: 10512,
    user_id: 344,
    user_email: "sarah.williams@golden.com",
    action: "UPDATE_FACILITY_SETTINGS",
    target_type: "facility",
    target_id: 15,
    ip_address: "73.182.44.22",
    timestamp: "2026-02-01T04:30:00Z",
    status: "success"
  },
  {
    log_id: 10508,
    user_id: 342,
    user_email: "emily.brown@sunrise.com",
    action: "RESOLVE_ALERT",
    target_type: "alert",
    target_id: 9008,
    ip_address: "73.182.44.18",
    timestamp: "2026-02-01T05:35:00Z",
    status: "success"
  },
];

// Schema-aligned: roles and permissions
interface Role {
  role_id: number;
  role_name: string;
  description: string;
  user_count: number;
}

const roles: Role[] = [
  { role_id: 1, role_name: "admin", description: "Full system access", user_count: 3 },
  { role_id: 2, role_name: "caregiver", description: "Patient care access", user_count: 24 },
  { role_id: 3, role_name: "supervisor", description: "Team management access", user_count: 8 },
  { role_id: 4, role_name: "family", description: "Limited patient view access", user_count: 45 },
  { role_id: 5, role_name: "responder", description: "Emergency response access", user_count: 12 },
];

const securitySettings = [
  { id: 1, name: "Two-Factor Authentication", description: "Require 2FA for all admin accounts", enabled: true },
  { id: 2, name: "Session Timeout", description: "Auto-logout after 30 minutes of inactivity", enabled: true },
  { id: 3, name: "IP Whitelist", description: "Restrict access to approved IP addresses", enabled: false },
  { id: 4, name: "Audit Logging", description: "Log all user actions and access attempts", enabled: true },
];

const formatTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  // Use ISO format for consistency between server and client
  return date.toISOString().split("T")[0];
};

const actionLabels: Record<string, string> = {
  ACKNOWLEDGE_ALERT: "Acknowledged alert",
  LOGIN_SUCCESS: "Login successful",
  LOGIN_FAILED: "Failed login attempt",
  VIEW_PATIENT_RECORD: "Viewed patient record",
  UPDATE_FACILITY_SETTINGS: "Updated facility settings",
  RESOLVE_ALERT: "Resolved alert",
};

export function SecuritySection() {
  const totalUsers = roles.reduce((sum, r) => sum + r.user_count, 0);
  const failedLogins = auditLogs.filter(l => l.action === "LOGIN_FAILED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Security & Access</h1>
        <p className="text-muted-foreground">Manage security settings, roles, and audit activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <UserCog className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalUsers}</div>
                <div className="text-xs text-muted-foreground">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{roles.length}</div>
                <div className="text-xs text-muted-foreground">Active Roles</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{failedLogins}</div>
                <div className="text-xs text-muted-foreground">Failed Logins</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Key className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{auditLogs.length}</div>
                <div className="text-xs text-muted-foreground">Recent Logs</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {securitySettings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{setting.name}</div>
                  <div className="text-sm text-muted-foreground">{setting.description}</div>
                </div>
                <Switch checked={setting.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Roles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-primary" />
              User Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {roles.map((role) => (
              <div key={role.role_id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium capitalize">{role.role_name}</div>
                  <div className="text-xs text-muted-foreground">{role.description}</div>
                </div>
                <Badge variant="secondary">{role.user_count} users</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Audit Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.log_id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {log.status === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  ) : log.status === "warning" ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                  <div>
                    <div className="text-sm font-medium">
                      {actionLabels[log.action] || log.action}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {log.user_email} • {log.ip_address}
                      {log.target_id && ` • ${log.target_type} #${log.target_id}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTimeAgo(log.timestamp)}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Audit Logs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

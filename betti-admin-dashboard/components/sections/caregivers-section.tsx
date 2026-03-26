"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserCog,
  Search,
  Plus,
  Clock,
  Users,
  Star,
  Phone,
} from "lucide-react";

// Schema-aligned: users, user_credentials, roles, facility_memberships, caregiver_patient_assignments
interface Caregiver {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  is_active: boolean;
  created_at: string;
  // From user_credentials
  last_login_at: string;
  last_logout_at: string;
  // From roles via user_roles
  role_name: string;
  // From facility_memberships
  facility_id: number;
  facility_role:
    | "staff"
    | "admin"
    | "supervisor"
    | "caregiver"
    | "senior"
    | "security"
    | "ems"
    | "fire_service";
  // Computed from caregiver_patient_assignments
  assigned_patients: number;
  primary_patients: number;
  // Operational (would come from real-time system)
  duty_status: "on-duty" | "off-duty" | "break";
  current_shift: string;
  avg_response_time: string;
}

type ApiCaregiver = {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  is_active: boolean;
  created_at: string;
  last_login_at: string;
  last_logout_at: string;
  role_name: string;
  facility_id: number;
  facility_role: string;
  assigned_patients: number;
  primary_patients: number;
  duty_status: string;
  current_shift: string;
  avg_response_time: string;
};

// HARDWARE_READINESS: frontend fallback for demo continuity when live caregiver API fails.
const fallbackCaregivers: Caregiver[] = [
  // ── EMS Staff ──
  {
    user_id: 401,
    first_name: "Carlos",
    last_name: "Rivera",
    email: "carlos.rivera@ems.betti.com",
    phone: "+15615561001",
    status: "active",
    is_active: true,
    created_at: "2025-08-01T08:00:00Z",
    last_login_at: "2026-01-30T07:00:00Z",
    role_name: "paramedic",
    facility_id: 12,
    facility_role: "ems",
    assigned_patients: 4,
    primary_patients: 4,
    duty_status: "on-duty",
    current_shift: "7AM - 3PM",
    avg_response_time: "2.1m",
    last_logout_at: "2026-01-29T15:06:22Z"
  },
  {
    user_id: 402,
    first_name: "Diane",
    last_name: "Foster",
    email: "diane.foster@ems.betti.com",
    phone: "+15615561002",
    status: "active",
    is_active: true,
    created_at: "2025-09-10T09:00:00Z",
    last_login_at: "2026-01-30T06:50:00Z",
    role_name: "emt",
    facility_id: 12,
    facility_role: "ems",
    assigned_patients: 3,
    primary_patients: 3,
    duty_status: "on-duty",
    current_shift: "7AM - 3PM",
    avg_response_time: "2.8m",
    last_logout_at: "2026-01-29T15:02:45Z"
  },
  {
    user_id: 403,
    first_name: "Marcus",
    last_name: "Hill",
    email: "marcus.hill@ems.betti.com",
    phone: "+15615561003",
    status: "active",
    is_active: true,
    created_at: "2025-07-15T08:00:00Z",
    last_login_at: "2026-01-29T23:00:00Z",
    role_name: "paramedic",
    facility_id: 15,
    facility_role: "ems",
    assigned_patients: 5,
    primary_patients: 5,
    duty_status: "off-duty",
    current_shift: "11PM - 7AM",
    avg_response_time: "1.9m",
    last_logout_at: "2026-01-30T07:09:15Z"
  },
  {
    user_id: 404,
    first_name: "Tanya",
    last_name: "Brooks",
    email: "tanya.brooks@ems.betti.com",
    phone: "+15615561004",
    status: "active",
    is_active: true,
    created_at: "2025-10-05T09:00:00Z",
    last_login_at: "2026-01-30T08:10:00Z",
    role_name: "emt",
    facility_id: 23,
    facility_role: "ems",
    assigned_patients: 3,
    primary_patients: 2,
    duty_status: "break",
    current_shift: "3PM - 11PM",
    avg_response_time: "3.2m",
    last_logout_at: "2026-01-29T23:05:38Z"
  },
  // ── Security Staff ──
  {
    user_id: 411,
    first_name: "Victor",
    last_name: "Nguyen",
    email: "victor.nguyen@security.betti.com",
    phone: "+15615562001",
    status: "active",
    is_active: true,
    created_at: "2025-06-10T08:00:00Z",
    last_login_at: "2026-01-30T07:30:00Z",
    role_name: "security_officer",
    facility_id: 12,
    facility_role: "security",
    assigned_patients: 0,
    primary_patients: 0,
    duty_status: "on-duty",
    current_shift: "7AM - 3PM",
    avg_response_time: "1.5m",
    last_logout_at: "2026-01-29T15:04:11Z"
  },
  {
    user_id: 412,
    first_name: "Priya",
    last_name: "Shah",
    email: "priya.shah@security.betti.com",
    phone: "+15615562002",
    status: "active",
    is_active: true,
    created_at: "2025-07-20T09:00:00Z",
    last_login_at: "2026-01-30T06:45:00Z",
    role_name: "security_supervisor",
    facility_id: 12,
    facility_role: "security",
    assigned_patients: 0,
    primary_patients: 0,
    duty_status: "on-duty",
    current_shift: "7AM - 3PM",
    avg_response_time: "1.2m",
    last_logout_at: "2026-01-29T15:01:55Z"
  },
  {
    user_id: 413,
    first_name: "Darnell",
    last_name: "King",
    email: "darnell.king@security.betti.com",
    phone: "+15615562003",
    status: "active",
    is_active: true,
    created_at: "2025-08-25T08:00:00Z",
    last_login_at: "2026-01-29T23:30:00Z",
    role_name: "security_officer",
    facility_id: 15,
    facility_role: "security",
    assigned_patients: 0,
    primary_patients: 0,
    duty_status: "off-duty",
    current_shift: "11PM - 7AM",
    avg_response_time: "2.0m",
    last_logout_at: "2026-01-30T07:14:22Z"
  },
  {
    user_id: 414,
    first_name: "Mei",
    last_name: "Chen",
    email: "mei.chen@security.betti.com",
    phone: "+15615562004",
    status: "active",
    is_active: true,
    created_at: "2025-09-30T09:00:00Z",
    last_login_at: "2026-01-30T07:55:00Z",
    role_name: "security_officer",
    facility_id: 23,
    facility_role: "security",
    assigned_patients: 0,
    primary_patients: 0,
    duty_status: "on-duty",
    current_shift: "3PM - 11PM",
    avg_response_time: "1.8m",
    last_logout_at: "2026-01-29T23:08:40Z"
  },
  // ── Fire Service Staff ──
  {
    user_id: 421,
    first_name: "Brian",
    last_name: "Coleman",
    email: "brian.coleman@fire.betti.com",
    phone: "+15615563001",
    status: "active",
    is_active: true,
    created_at: "2025-05-01T08:00:00Z",
    last_login_at: "2026-01-30T07:20:00Z",
    role_name: "firefighter",
    facility_id: 12,
    facility_role: "fire_service",
    assigned_patients: 0,
    primary_patients: 0,
    duty_status: "on-duty",
    current_shift: "7AM - 7PM",
    avg_response_time: "3.0m",
    last_logout_at: "2026-01-29T19:12:33Z"
  },
  {
    user_id: 422,
    first_name: "Lena",
    last_name: "Vasquez",
    email: "lena.vasquez@fire.betti.com",
    phone: "+15615563002",
    status: "active",
    is_active: true,
    created_at: "2025-06-15T09:00:00Z",
    last_login_at: "2026-01-30T06:40:00Z",
    role_name: "fire_captain",
    facility_id: 12,
    facility_role: "fire_service",
    assigned_patients: 0,
    primary_patients: 0,
    duty_status: "on-duty",
    current_shift: "7AM - 7PM",
    avg_response_time: "2.5m",
    last_logout_at: "2026-01-29T19:05:17Z"
  },
  {
    user_id: 423,
    first_name: "Jerome",
    last_name: "Patterson",
    email: "jerome.patterson@fire.betti.com",
    phone: "+15615563003",
    status: "active",
    is_active: true,
    created_at: "2025-07-10T08:00:00Z",
    last_login_at: "2026-01-29T19:00:00Z",
    role_name: "firefighter",
    facility_id: 15,
    facility_role: "fire_service",
    assigned_patients: 0,
    primary_patients: 0,
    duty_status: "off-duty",
    current_shift: "7PM - 7AM",
    avg_response_time: "3.5m",
    last_logout_at: "2026-01-30T07:18:44Z"
  },
  {
    user_id: 424,
    first_name: "Aisha",
    last_name: "Grant",
    email: "aisha.grant@fire.betti.com",
    phone: "+15615563004",
    status: "active",
    is_active: true,
    created_at: "2025-08-20T09:00:00Z",
    last_login_at: "2026-01-30T07:50:00Z",
    role_name: "firefighter",
    facility_id: 23,
    facility_role: "fire_service",
    assigned_patients: 0,
    primary_patients: 0,
    duty_status: "on-duty",
    current_shift: "7AM - 7PM",
    avg_response_time: "2.8m",
    last_logout_at: "2026-01-29T19:09:55Z"
  },
  {
    user_id: 340,
    first_name: "Angela",
    last_name: "Reyes",
    email: "angela.reyes@sunrise.com",
    phone: "+15615551234",
    status: "active",
    is_active: true,
    created_at: "2025-11-14T09:22:10Z",
    last_login_at: "2026-01-30T07:41:02Z",
    role_name: "caregiver",
    facility_id: 12,
    facility_role: "staff",
    assigned_patients: 8,
    primary_patients: 5,
    duty_status: "on-duty",
    current_shift: "7AM - 3PM",
    avg_response_time: "3.2m",
    last_logout_at: "2026-01-29T15:08:30Z"
  },
  {
    user_id: 341,
    first_name: "John",
    last_name: "Davis",
    email: "john.davis@sunrise.com",
    phone: "+15615552345",
    status: "active",
    is_active: true,
    created_at: "2025-09-20T11:00:00Z",
    last_login_at: "2026-01-30T06:58:00Z",
    role_name: "caregiver",
    facility_id: 12,
    facility_role: "staff",
    assigned_patients: 6,
    primary_patients: 4,
    duty_status: "on-duty",
    current_shift: "7AM - 3PM",
    avg_response_time: "4.1m",
    last_logout_at: "2026-01-29T15:03:48Z"
  },
  {
    user_id: 342,
    first_name: "Emily",
    last_name: "Brown",
    email: "emily.brown@sunrise.com",
    phone: "+15615553456",
    status: "active",
    is_active: true,
    created_at: "2025-08-15T08:30:00Z",
    last_login_at: "2026-01-29T14:45:00Z",
    role_name: "caregiver",
    facility_id: 12,
    facility_role: "supervisor",
    assigned_patients: 7,
    primary_patients: 3,
    duty_status: "break",
    current_shift: "3PM - 11PM",
    avg_response_time: "2.8m",
    last_logout_at: "2026-01-28T23:07:22Z"
  },
  {
    user_id: 343,
    first_name: "Michael",
    last_name: "Lee",
    email: "michael.lee@sunrise.com",
    phone: "+15615554567",
    status: "active",
    is_active: true,
    created_at: "2025-10-01T10:00:00Z",
    last_login_at: "2026-01-29T23:15:00Z",
    role_name: "caregiver",
    facility_id: 12,
    facility_role: "staff",
    assigned_patients: 5,
    primary_patients: 5,
    duty_status: "off-duty",
    current_shift: "11PM - 7AM",
    avg_response_time: "4.5m",
    last_logout_at: "2026-01-30T07:22:13Z"
  },
  {
    user_id: 344,
    first_name: "Sarah",
    last_name: "Williams",
    email: "sarah.williams@golden.com",
    phone: "+15615555678",
    status: "active",
    is_active: true,
    created_at: "2025-07-10T09:00:00Z",
    last_login_at: "2026-01-30T08:00:00Z",
    role_name: "admin",
    facility_id: 15,
    facility_role: "admin",
    assigned_patients: 12,
    primary_patients: 0,
    duty_status: "on-duty",
    current_shift: "8AM - 4PM",
    avg_response_time: "2.1m",
    last_logout_at: "2026-01-29T16:03:45Z"
  },
  {
    user_id: 345,
    first_name: "David",
    last_name: "Martinez",
    email: "david.martinez@sunrise.com",
    phone: "+15615556789",
    status: "inactive",
    is_active: false,
    created_at: "2025-06-01T08:00:00Z",
    last_login_at: "2025-12-15T16:30:00Z",
    role_name: "caregiver",
    facility_id: 12,
    facility_role: "staff",
    assigned_patients: 0,
    primary_patients: 0,
    duty_status: "off-duty",
    current_shift: "N/A",
    avg_response_time: "N/A",
    last_logout_at: "2025-12-15T23:47:15Z"
  },
  {
    user_id: 346,
    first_name: "Jennifer",
    last_name: "Garcia",
    email: "jennifer.garcia@golden.com",
    phone: "+15615557890",
    status: "active",
    is_active: true,
    created_at: "2025-05-15T08:00:00Z",
    last_login_at: "2026-01-30T07:30:00Z",
    role_name: "caregiver",
    facility_id: 15,
    facility_role: "staff",
    assigned_patients: 9,
    primary_patients: 6,
    duty_status: "on-duty",
    current_shift: "7AM - 3PM",
    avg_response_time: "3.5m",
    last_logout_at: "2026-01-29T15:05:12Z"
  },
  {
    user_id: 347,
    first_name: "Robert",
    last_name: "Anderson",
    email: "robert.anderson@golden.com",
    phone: "+15615558901",
    status: "active",
    is_active: true,
    created_at: "2025-04-20T09:00:00Z",
    last_login_at: "2026-01-30T06:45:00Z",
    role_name: "caregiver",
    facility_id: 15,
    facility_role: "supervisor",
    assigned_patients: 4,
    primary_patients: 2,
    duty_status: "on-duty",
    current_shift: "7AM - 3PM",
    avg_response_time: "2.5m",
    last_logout_at: "2026-01-29T15:00:58Z"
  },
  {
    user_id: 348,
    first_name: "Lisa",
    last_name: "Thompson",
    email: "lisa.thompson@palmbeach.com",
    phone: "+15615559012",
    status: "active",
    is_active: true,
    created_at: "2025-03-10T10:00:00Z",
    last_login_at: "2026-01-29T22:00:00Z",
    role_name: "caregiver",
    facility_id: 23,
    facility_role: "staff",
    assigned_patients: 10,
    primary_patients: 7,
    duty_status: "off-duty",
    current_shift: "11PM - 7AM",
    avg_response_time: "3.8m",
    last_logout_at: "2026-01-30T07:06:33Z"
  },
  {
    user_id: 349,
    first_name: "James",
    last_name: "Wilson",
    email: "james.wilson@palmbeach.com",
    phone: "+15615550123",
    status: "active",
    is_active: true,
    created_at: "2025-02-28T08:30:00Z",
    last_login_at: "2026-01-30T08:15:00Z",
    role_name: "caregiver",
    facility_id: 23,
    facility_role: "staff",
    assigned_patients: 8,
    primary_patients: 5,
    duty_status: "on-duty",
    current_shift: "7AM - 3PM",
    avg_response_time: "4.0m",
    last_logout_at: "2026-01-29T15:10:25Z"
  },
  {
    user_id: 350,
    first_name: "Patricia",
    last_name: "Moore",
    email: "patricia.moore@palmbeach.com",
    phone: "+15615551234",
    status: "active",
    is_active: true,
    created_at: "2025-01-15T09:00:00Z",
    last_login_at: "2026-01-30T07:00:00Z",
    role_name: "admin",
    facility_id: 23,
    facility_role: "admin",
    assigned_patients: 15,
    primary_patients: 0,
    duty_status: "on-duty",
    current_shift: "8AM - 4PM",
    avg_response_time: "1.9m",
    last_logout_at: "2026-01-29T16:04:20Z"
  },
  {
    user_id: 351,
    first_name: "Christopher",
    last_name: "Taylor",
    email: "chris.taylor@coastal.com",
    phone: "+19545552345",
    status: "active",
    is_active: true,
    created_at: "2025-06-20T08:00:00Z",
    last_login_at: "2026-01-30T06:30:00Z",
    role_name: "caregiver",
    facility_id: 31,
    facility_role: "staff",
    assigned_patients: 6,
    primary_patients: 4,
    duty_status: "on-duty",
    current_shift: "7AM - 3PM",
    avg_response_time: "3.3m",
    last_logout_at: "2026-01-29T15:01:15Z"
  },
  {
    user_id: 352,
    first_name: "Nancy",
    last_name: "Jackson",
    email: "nancy.jackson@coastal.com",
    phone: "+19545553456",
    status: "active",
    is_active: true,
    created_at: "2025-07-25T10:00:00Z",
    last_login_at: "2026-01-29T15:00:00Z",
    role_name: "caregiver",
    facility_id: 31,
    facility_role: "staff",
    assigned_patients: 7,
    primary_patients: 5,
    duty_status: "break",
    current_shift: "3PM - 11PM",
    avg_response_time: "3.0m",
    last_logout_at: "2026-01-28T23:03:40Z"
  },
  {
    user_id: 353,
    first_name: "Daniel",
    last_name: "White",
    email: "daniel.white@sunrise.com",
    phone: "+15615554567",
    status: "active",
    is_active: true,
    created_at: "2025-08-10T09:00:00Z",
    last_login_at: "2026-01-30T07:45:00Z",
    role_name: "caregiver",
    facility_id: 12,
    facility_role: "staff",
    assigned_patients: 5,
    primary_patients: 3,
    duty_status: "on-duty",
    current_shift: "7AM - 3PM",
    avg_response_time: "3.7m",
    last_logout_at: "2026-01-29T15:07:19Z"
  },
  {
    user_id: 354,
    first_name: "Karen",
    last_name: "Harris",
    email: "karen.harris@golden.com",
    phone: "+15615555678",
    status: "active",
    is_active: true,
    created_at: "2025-09-05T08:30:00Z",
    last_login_at: "2026-01-29T23:30:00Z",
    role_name: "caregiver",
    facility_id: 15,
    facility_role: "staff",
    assigned_patients: 6,
    primary_patients: 4,
    duty_status: "off-duty",
    current_shift: "11PM - 7AM",
    avg_response_time: "4.2m",
    last_logout_at: "2026-01-30T07:25:52Z"
  },
  {
    user_id: 355,
    first_name: "Steven",
    last_name: "Martin",
    email: "steven.martin@palmbeach.com",
    phone: "+15615556789",
    status: "active",
    is_active: true,
    created_at: "2025-10-12T10:00:00Z",
    last_login_at: "2026-01-30T08:00:00Z",
    role_name: "caregiver",
    facility_id: 23,
    facility_role: "supervisor",
    assigned_patients: 3,
    primary_patients: 1,
    duty_status: "on-duty",
    current_shift: "8AM - 4PM",
    avg_response_time: "2.3m",
    last_logout_at: "2026-01-29T16:05:38Z"
  },
  {
    user_id: 356,
    first_name: "Betty",
    last_name: "Clark",
    email: "betty.clark@coastal.com",
    phone: "+19545557890",
    status: "inactive",
    is_active: false,
    created_at: "2025-04-01T08:00:00Z",
    last_login_at: "2025-11-20T14:00:00Z",
    role_name: "caregiver",
    facility_id: 31,
    facility_role: "staff",
    assigned_patients: 0,
    primary_patients: 0,
    duty_status: "off-duty",
    current_shift: "N/A",
    avg_response_time: "N/A",
    last_logout_at: "2025-11-20T22:07:15Z"
  },
  {
    user_id: 357,
    first_name: "Mark",
    last_name: "Rodriguez",
    email: "mark.rodriguez@sunrise.com",
    phone: "+15615558901",
    status: "active",
    is_active: true,
    created_at: "2025-11-01T09:00:00Z",
    last_login_at: "2026-01-29T14:30:00Z",
    role_name: "caregiver",
    facility_id: 12,
    facility_role: "staff",
    assigned_patients: 4,
    primary_patients: 3,
    duty_status: "break",
    current_shift: "3PM - 11PM",
    avg_response_time: "3.9m",
    last_logout_at: "2026-01-28T23:06:10Z"
  },
  {
    user_id: 358,
    first_name: "Sandra",
    last_name: "Lewis",
    email: "sandra.lewis@golden.com",
    phone: "+15615559012",
    status: "active",
    is_active: true,
    created_at: "2025-12-05T08:00:00Z",
    last_login_at: "2026-01-30T07:15:00Z",
    role_name: "caregiver",
    facility_id: 15,
    facility_role: "staff",
    assigned_patients: 7,
    primary_patients: 5,
    duty_status: "on-duty",
    current_shift: "7AM - 3PM",
    avg_response_time: "3.1m",
    last_logout_at: "2026-01-29T15:04:55Z"
  },
];

const facilityRoleLabels: Record<Caregiver["facility_role"], string> = {
  staff: "Staff",
  admin: "Administrator",
  supervisor: "Supervisor",
  caregiver: "Caregiver",
  senior: "Senior",
  security: "Security",
  ems: "EMS",
  fire_service: "Fire Service",
};

const ITEMS_PER_PAGE = 9;

const formatDateTime = (iso: string): string => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

type FilterType = "all" | "active" | "on-duty" | "with-patients";
type GroupTab = "all" | "care" | "ems" | "security" | "fire_service";

const GROUP_TABS: { id: GroupTab; label: string }[] = [
  { id: "all", label: "All Staff" },
  { id: "care", label: "Care Staff" },
  { id: "ems", label: "EMS" },
  { id: "security", label: "Security" },
  { id: "fire_service", label: "Fire Service" },
];

export function CaregiversSection() {
  // TODO: re-enable when backend is available
  // const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [caregivers, setCaregivers] = useState<Caregiver[]>(fallbackCaregivers);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeGroup, setActiveGroup] = useState<GroupTab>("all");
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "",
    shift: "",
    facility_role: "",
  });

  useEffect(() => {
    // TODO: re-enable when backend is available
    /*
    let isMounted = true;
    const loadCaregivers = async () => {
      try {
        setLoadError("");
        const response = await fetch(`${apiUrl}/api/caregivers?home_only=true`);
        if (!response.ok) {
          throw new Error("Failed to load caregivers");
        }
        const payload: ApiCaregiver[] = await response.json();
        const mapped: Caregiver[] = (payload || []).map((row) => ({
          user_id: Number(row.user_id),
          first_name: row.first_name || "",
          last_name: row.last_name || "",
          email: row.email || "",
          phone: row.phone || "",
          status: row.status === "active" ? "active" : "inactive",
          is_active: Boolean(row.is_active),
          created_at: row.created_at || new Date().toISOString(),
          last_login_at: row.last_login_at || "",
          last_logout_at: row.last_logout_at || "",
          role_name: row.role_name || "caregiver",
          facility_id: Number(row.facility_id || 0),
          facility_role: (row.facility_role || "staff") as Caregiver["facility_role"],
          assigned_patients: Number(row.assigned_patients || 0),
          primary_patients: Number(row.primary_patients || 0),
          duty_status: row.duty_status === "on-duty" || row.duty_status === "break" ? row.duty_status : "off-duty",
          current_shift: row.current_shift || "7AM - 3PM",
          avg_response_time: row.avg_response_time || "N/A",
        }));
        if (isMounted) {
          setCaregivers(mapped);
        }
      } catch {
        if (isMounted) {
          setLoadError("Unable to load live caregiver data.");
          setCaregivers([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadCaregivers();
    return () => {
      isMounted = false;
    };
    */
  }, []);

  const groupFiltered = caregivers.filter((c) => {
    switch (activeGroup) {
      case "care": return ["staff", "admin", "supervisor", "caregiver"].includes(c.facility_role);
      case "ems": return c.facility_role === "ems";
      case "security": return c.facility_role === "security";
      case "fire_service": return c.facility_role === "fire_service";
      default: return true;
    }
  });

  const filteredCaregivers = groupFiltered.filter((caregiver) => {
    const fullName = `${caregiver.first_name} ${caregiver.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
           caregiver.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "active":
        return caregiver.is_active;
      case "on-duty":
        return caregiver.duty_status === "on-duty";
      case "with-patients":
        return caregiver.assigned_patients > 0;
      default:
        return true;
    }
  });

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    setCurrentPage(1);
  };

  const handleGroupChange = (group: GroupTab) => {
    setActiveGroup(group);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredCaregivers.length / ITEMS_PER_PAGE);
  const paginatedCaregivers = filteredCaregivers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeCaregivers = groupFiltered.filter(c => c.is_active);
  const onDutyCaregivers = groupFiltered.filter(c => c.duty_status === "on-duty");
  const totalPatients = groupFiltered.reduce((sum, c) => sum + c.assigned_patients, 0);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Staff</h1>
            <p className="text-muted-foreground">
              Manage staff assignments and performance
            </p>
          </div>
          <Button className="gap-2" onClick={() => setAddStaffOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Staff
          </Button>
        </div>

        {/* Add Staff Dialog */}
        <Dialog open={addStaffOpen} onOpenChange={setAddStaffOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Staff Member</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="staff-first-name">First Name</Label>
                  <Input
                    id="staff-first-name"
                    placeholder="First name"
                    value={newStaff.first_name}
                    onChange={(e) => setNewStaff({ ...newStaff, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="staff-last-name">Last Name</Label>
                  <Input
                    id="staff-last-name"
                    placeholder="Last name"
                    value={newStaff.last_name}
                    onChange={(e) => setNewStaff({ ...newStaff, last_name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="staff-email">Email</Label>
                <Input
                  id="staff-email"
                  type="email"
                  placeholder="email@facility.com"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="staff-phone">Phone</Label>
                <Input
                  id="staff-phone"
                  placeholder="+1 (555) 000-0000"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={newStaff.facility_role} onValueChange={(v) => setNewStaff({ ...newStaff, facility_role: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Care Staff</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="ems">EMS</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="fire_service">Fire Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Shift</Label>
                <Select value={newStaff.shift} onValueChange={(v) => setNewStaff({ ...newStaff, shift: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7AM - 3PM">7AM – 3PM</SelectItem>
                    <SelectItem value="3PM - 11PM">3PM – 11PM</SelectItem>
                    <SelectItem value="11PM - 7AM">11PM – 7AM</SelectItem>
                    <SelectItem value="8AM - 4PM">8AM – 4PM</SelectItem>
                    <SelectItem value="7AM - 7PM">7AM – 7PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddStaffOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setAddStaffOpen(false);
                  setNewStaff({ first_name: "", last_name: "", email: "", phone: "", role: "", shift: "", facility_role: "" });
                }}
              >
                Add Staff
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Group Tabs */}
        <div className="flex flex-wrap gap-2">
          {GROUP_TABS.map((tab) => {
            const count = caregivers.filter((c) => {
              switch (tab.id) {
                case "care": return ["staff", "admin", "supervisor", "caregiver"].includes(c.facility_role);
                case "ems": return c.facility_role === "ems";
                case "security": return c.facility_role === "security";
                case "fire_service": return c.facility_role === "fire_service";
                default: return true;
              }
            }).length;
            return (
              <button
                key={tab.id}
                onClick={() => handleGroupChange(tab.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  activeGroup === tab.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {tab.label} <span className="ml-1 opacity-70">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loadError && (
          <Alert variant="destructive">
            <AlertDescription>{loadError}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <Alert>
            <AlertDescription>Loading caregivers...</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "active" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => handleFilterChange("active")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <UserCog className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeCaregivers.length}</div>
                  <div className="text-xs text-muted-foreground">Active Staff</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "on-duty" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => handleFilterChange("on-duty")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{onDutyCaregivers.length}</div>
                  <div className="text-xs text-muted-foreground">On Duty</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "with-patients" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => handleFilterChange("with-patients")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalPatients}</div>
                  <div className="text-xs text-muted-foreground">Patients Assigned</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => handleFilterChange("all")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Star className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{caregivers.length}</div>
                  <div className="text-xs text-muted-foreground">Total Staff</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scrollable Staff Grid */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          {paginatedCaregivers.map((caregiver) => (
            <Card key={caregiver.user_id} className={`hover:shadow-md transition-shadow ${!caregiver.is_active ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary">
                        {caregiver.first_name[0]}{caregiver.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{caregiver.first_name} {caregiver.last_name}</div>
                      <div className="text-xs text-muted-foreground">{facilityRoleLabels[caregiver.facility_role]}</div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      caregiver.duty_status === "on-duty"
                        ? "default"
                        : caregiver.duty_status === "break"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {caregiver.duty_status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Patients Assigned</span>
                    <span className="font-medium">{caregiver.assigned_patients} ({caregiver.primary_patients} primary)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg Response Time</span>
                    <span className="font-medium">{caregiver.avg_response_time}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Role</span>
                    <Badge variant="outline" className="capitalize text-xs">
                      {caregiver.role_name}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shift</span>
                    <span className="font-medium">{caregiver.current_shift}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Login</span>
                    <span className="font-medium text-xs">{formatDateTime(caregiver.last_login_at)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Logout</span>
                    <span className="font-medium text-xs">{formatDateTime(caregiver.last_logout_at)}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Phone className="h-3 w-3" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Fixed Pagination at Bottom */}
      <div className="flex-shrink-0 pt-4 border-t bg-background">
        <PaginationControlled
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredCaregivers.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}

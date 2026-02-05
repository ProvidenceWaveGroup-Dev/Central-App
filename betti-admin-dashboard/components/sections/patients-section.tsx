"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Heart,
  AlertTriangle,
  Activity,
  MapPin,
} from "lucide-react";

// Schema-aligned: patients, patient_medical_profile, patient_risk_scores, locations, caregiver_patient_assignments
interface Patient {
  patient_id: number;
  facility_id: number;
  first_name: string;
  last_name: string;
  dob: string;
  gender: "male" | "female" | "other";
  primary_language: string;
  status: "active" | "inactive" | "discharged";
  created_at: string;
  // From locations table
  room_name: string;
  floor_level: string;
  // From patient_medical_profile
  blood_type: string;
  allergies: string;
  chronic_conditions: string;
  dnr_status: boolean;
  // From patient_risk_scores
  risk_score: number;
  risk_factors: Record<string, number>;
  // From caregiver_patient_assignments (joined with users)
  primary_caregiver: string;
  // Computed
  active_alerts: number;
  last_sensor_reading: string;
}

const patients: Patient[] = [
  {
    patient_id: 501,
    facility_id: 12,
    first_name: "Margaret",
    last_name: "Johnson",
    dob: "1942-06-18",
    gender: "female",
    primary_language: "English",
    status: "active",
    created_at: "2025-10-03T14:11:22Z",
    room_name: "Room 214",
    floor_level: "2",
    blood_type: "O+",
    allergies: "Penicillin",
    chronic_conditions: "Hypertension, Arthritis",
    dnr_status: false,
    risk_score: 0.82,
    risk_factors: { falls: 3, sleep: -1.2 },
    primary_caregiver: "Angela Reyes",
    active_alerts: 1,
    last_sensor_reading: "10 min ago"
  },
  {
    patient_id: 502,
    facility_id: 12,
    first_name: "Robert",
    last_name: "Smith",
    dob: "1944-03-22",
    gender: "male",
    primary_language: "English",
    status: "active",
    created_at: "2025-09-15T09:30:00Z",
    room_name: "Room 118",
    floor_level: "1",
    blood_type: "A-",
    allergies: "None",
    chronic_conditions: "Diabetes Type 2, COPD",
    dnr_status: true,
    risk_score: 0.65,
    risk_factors: { breathing: 2, glucose: 1.5 },
    primary_caregiver: "John Davis",
    active_alerts: 2,
    last_sensor_reading: "2 hours ago"
  },
  {
    patient_id: 503,
    facility_id: 12,
    first_name: "Helen",
    last_name: "Davis",
    dob: "1948-11-05",
    gender: "female",
    primary_language: "English",
    status: "active",
    created_at: "2025-11-20T11:45:00Z",
    room_name: "Room 305",
    floor_level: "3",
    blood_type: "B+",
    allergies: "Sulfa drugs, Latex",
    chronic_conditions: "Dementia, Osteoporosis",
    dnr_status: false,
    risk_score: 0.91,
    risk_factors: { falls: 4, cognition: -2.1, mobility: -1.8 },
    primary_caregiver: "Emily Brown",
    active_alerts: 1,
    last_sensor_reading: "5 min ago"
  },
  {
    patient_id: 504,
    facility_id: 12,
    first_name: "James",
    last_name: "Wilson",
    dob: "1946-08-30",
    gender: "male",
    primary_language: "English",
    status: "active",
    created_at: "2025-08-10T08:00:00Z",
    room_name: "Room 122",
    floor_level: "1",
    blood_type: "AB+",
    allergies: "None",
    chronic_conditions: "Mild cognitive impairment",
    dnr_status: false,
    risk_score: 0.35,
    risk_factors: { cognition: -0.5 },
    primary_caregiver: "Michael Lee",
    active_alerts: 0,
    last_sensor_reading: "30 min ago"
  },
  {
    patient_id: 505,
    facility_id: 12,
    first_name: "Patricia",
    last_name: "Brown",
    dob: "1949-01-14",
    gender: "female",
    primary_language: "Spanish",
    status: "active",
    created_at: "2025-12-01T10:20:00Z",
    room_name: "Room 210",
    floor_level: "2",
    blood_type: "O-",
    allergies: "Aspirin",
    chronic_conditions: "Heart disease, Anxiety",
    dnr_status: false,
    risk_score: 0.58,
    risk_factors: { cardiac: 1.8, anxiety: 0.9 },
    primary_caregiver: "Angela Reyes",
    active_alerts: 0,
    last_sensor_reading: "1 hour ago"
  },
  {
    patient_id: 506,
    facility_id: 15,
    first_name: "William",
    last_name: "Thompson",
    dob: "1940-04-25",
    gender: "male",
    primary_language: "English",
    status: "inactive",
    created_at: "2025-07-05T14:00:00Z",
    room_name: "Room 108",
    floor_level: "1",
    blood_type: "A+",
    allergies: "Ibuprofen",
    chronic_conditions: "Parkinson's disease",
    dnr_status: true,
    risk_score: 0.78,
    risk_factors: { falls: 2.5, tremor: 1.2 },
    primary_caregiver: "Sarah Williams",
    active_alerts: 0,
    last_sensor_reading: "Inactive"
  },
  {
    patient_id: 507,
    facility_id: 12,
    first_name: "Dorothy",
    last_name: "Miller",
    dob: "1945-09-12",
    gender: "female",
    primary_language: "English",
    status: "active",
    created_at: "2025-06-15T09:00:00Z",
    room_name: "Room 301",
    floor_level: "3",
    blood_type: "A+",
    allergies: "Codeine",
    chronic_conditions: "Chronic kidney disease, Anemia",
    dnr_status: false,
    risk_score: 0.72,
    risk_factors: { renal: 2.1, fatigue: 1.5 },
    primary_caregiver: "Emily Brown",
    active_alerts: 1,
    last_sensor_reading: "15 min ago"
  },
  {
    patient_id: 508,
    facility_id: 12,
    first_name: "Charles",
    last_name: "Moore",
    dob: "1941-02-28",
    gender: "male",
    primary_language: "English",
    status: "active",
    created_at: "2025-05-20T11:30:00Z",
    room_name: "Room 220",
    floor_level: "2",
    blood_type: "B-",
    allergies: "None",
    chronic_conditions: "Atrial fibrillation, Hypothyroidism",
    dnr_status: false,
    risk_score: 0.55,
    risk_factors: { cardiac: 1.2, thyroid: 0.8 },
    primary_caregiver: "John Davis",
    active_alerts: 0,
    last_sensor_reading: "45 min ago"
  },
  {
    patient_id: 509,
    facility_id: 12,
    first_name: "Elizabeth",
    last_name: "Taylor",
    dob: "1947-07-04",
    gender: "female",
    primary_language: "English",
    status: "active",
    created_at: "2025-08-25T14:15:00Z",
    room_name: "Room 110",
    floor_level: "1",
    blood_type: "O+",
    allergies: "Shellfish",
    chronic_conditions: "Rheumatoid arthritis, Depression",
    dnr_status: false,
    risk_score: 0.48,
    risk_factors: { mobility: -1.0, mental: -0.8 },
    primary_caregiver: "Michael Lee",
    active_alerts: 0,
    last_sensor_reading: "20 min ago"
  },
  {
    patient_id: 510,
    facility_id: 12,
    first_name: "Richard",
    last_name: "Anderson",
    dob: "1943-11-30",
    gender: "male",
    primary_language: "English",
    status: "active",
    created_at: "2025-09-10T10:00:00Z",
    room_name: "Room 315",
    floor_level: "3",
    blood_type: "AB-",
    allergies: "Morphine",
    chronic_conditions: "Congestive heart failure, Gout",
    dnr_status: true,
    risk_score: 0.85,
    risk_factors: { cardiac: 3.2, mobility: -1.5 },
    primary_caregiver: "Sarah Williams",
    active_alerts: 2,
    last_sensor_reading: "8 min ago"
  },
  {
    patient_id: 511,
    facility_id: 12,
    first_name: "Susan",
    last_name: "Jackson",
    dob: "1950-04-18",
    gender: "female",
    primary_language: "English",
    status: "active",
    created_at: "2025-10-15T08:45:00Z",
    room_name: "Room 205",
    floor_level: "2",
    blood_type: "A+",
    allergies: "Sulfa drugs",
    chronic_conditions: "Type 1 Diabetes, Neuropathy",
    dnr_status: false,
    risk_score: 0.62,
    risk_factors: { glucose: 1.8, sensation: -1.2 },
    primary_caregiver: "Angela Reyes",
    active_alerts: 0,
    last_sensor_reading: "35 min ago"
  },
  {
    patient_id: 512,
    facility_id: 12,
    first_name: "Joseph",
    last_name: "White",
    dob: "1939-08-22",
    gender: "male",
    primary_language: "English",
    status: "active",
    created_at: "2025-07-20T13:30:00Z",
    room_name: "Room 125",
    floor_level: "1",
    blood_type: "O-",
    allergies: "Penicillin, Latex",
    chronic_conditions: "Alzheimer's disease, Prostate cancer",
    dnr_status: true,
    risk_score: 0.95,
    risk_factors: { cognition: -3.5, falls: 4.2 },
    primary_caregiver: "Emily Brown",
    active_alerts: 1,
    last_sensor_reading: "3 min ago"
  },
  {
    patient_id: 513,
    facility_id: 12,
    first_name: "Nancy",
    last_name: "Harris",
    dob: "1946-12-05",
    gender: "female",
    primary_language: "English",
    status: "active",
    created_at: "2025-11-01T09:15:00Z",
    room_name: "Room 308",
    floor_level: "3",
    blood_type: "B+",
    allergies: "None",
    chronic_conditions: "Macular degeneration, Osteoarthritis",
    dnr_status: false,
    risk_score: 0.45,
    risk_factors: { vision: -1.5, mobility: -0.8 },
    primary_caregiver: "John Davis",
    active_alerts: 0,
    last_sensor_reading: "50 min ago"
  },
  {
    patient_id: 514,
    facility_id: 12,
    first_name: "Thomas",
    last_name: "Martin",
    dob: "1944-05-15",
    gender: "male",
    primary_language: "English",
    status: "active",
    created_at: "2025-04-10T11:00:00Z",
    room_name: "Room 112",
    floor_level: "1",
    blood_type: "A-",
    allergies: "Aspirin",
    chronic_conditions: "Stroke recovery, Aphasia",
    dnr_status: false,
    risk_score: 0.78,
    risk_factors: { speech: -2.0, mobility: -1.8 },
    primary_caregiver: "Michael Lee",
    active_alerts: 1,
    last_sensor_reading: "12 min ago"
  },
  {
    patient_id: 515,
    facility_id: 12,
    first_name: "Betty",
    last_name: "Garcia",
    dob: "1948-03-20",
    gender: "female",
    primary_language: "Spanish",
    status: "active",
    created_at: "2025-09-25T10:30:00Z",
    room_name: "Room 218",
    floor_level: "2",
    blood_type: "O+",
    allergies: "Eggs",
    chronic_conditions: "Fibromyalgia, Insomnia",
    dnr_status: false,
    risk_score: 0.42,
    risk_factors: { pain: 1.5, sleep: -1.0 },
    primary_caregiver: "Sarah Williams",
    active_alerts: 0,
    last_sensor_reading: "25 min ago"
  },
  {
    patient_id: 516,
    facility_id: 15,
    first_name: "George",
    last_name: "Martinez",
    dob: "1942-10-08",
    gender: "male",
    primary_language: "Spanish",
    status: "inactive",
    created_at: "2025-03-15T08:00:00Z",
    room_name: "Room 102",
    floor_level: "1",
    blood_type: "AB+",
    allergies: "Penicillin",
    chronic_conditions: "Lung cancer, COPD",
    dnr_status: true,
    risk_score: 0.88,
    risk_factors: { breathing: 3.5, fatigue: 2.2 },
    primary_caregiver: "Angela Reyes",
    active_alerts: 0,
    last_sensor_reading: "Inactive"
  },
];

// Helper function to calculate age from DOB
const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Helper to get risk level from score
const getRiskLevel = (score: number): { label: string; color: string } => {
  if (score >= 0.8) return { label: "High", color: "text-red-600" };
  if (score >= 0.5) return { label: "Medium", color: "text-yellow-600" };
  return { label: "Low", color: "text-green-600" };
};

const ITEMS_PER_PAGE = 5;

type FilterType = "all" | "active" | "high-risk" | "with-alerts";

export function PatientsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
           patient.room_name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "active":
        return patient.status === "active";
      case "high-risk":
        return patient.risk_score >= 0.8;
      case "with-alerts":
        return patient.active_alerts > 0;
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

  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activePatients = patients.filter(p => p.status === "active");
  const highRiskPatients = patients.filter(p => p.risk_score >= 0.8);
  const totalAlerts = patients.reduce((sum, p) => sum + p.active_alerts, 0);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patients</h1>
            <p className="text-muted-foreground">
              Manage and monitor all patients in the system
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{patients.length}</div>
                <div className="text-xs text-muted-foreground">Total Patients</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "active" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("active")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Heart className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activePatients.length}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "high-risk" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("high-risk")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{highRiskPatients.length}</div>
                <div className="text-xs text-muted-foreground">High Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "with-alerts" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("with-alerts")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Activity className="h-5 w-5 text-yellow-600" />
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

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto min-h-0 pr-2">
        {/* Patients Table */}
        <Card className="mb-4">
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Patient</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Location</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Caregiver</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Risk Score</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Conditions</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Last Reading</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.map((patient) => {
                  const age = calculateAge(patient.dob);
                  const riskLevel = getRiskLevel(patient.risk_score);
                  return (
                  <tr key={patient.patient_id} className="border-b hover:bg-muted/50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {patient.first_name[0]}{patient.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {age} yrs • {patient.gender} • {patient.blood_type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div>{patient.room_name}</div>
                          <div className="text-xs text-muted-foreground">Floor {patient.floor_level}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{patient.primary_caregiver}</td>
                    <td className="p-3">
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={patient.status === "active" ? "default" : "secondary"}
                        >
                          {patient.status}
                        </Badge>
                        {patient.active_alerts > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {patient.active_alerts} alert{patient.active_alerts > 1 ? "s" : ""}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className={`text-sm font-medium ${riskLevel.color}`}>
                          {(patient.risk_score * 100).toFixed(0)}%
                        </div>
                        <span className={`text-xs ${riskLevel.color}`}>({riskLevel.label})</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm max-w-[150px] truncate" title={patient.chronic_conditions}>
                        {patient.chronic_conditions}
                      </div>
                      {patient.allergies !== "None" && (
                        <div className="text-xs text-red-500">⚠ {patient.allergies}</div>
                      )}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">{patient.last_sensor_reading}</td>
                    <td className="p-3">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
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
          totalItems={filteredPatients.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
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
  Cpu,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Plus,
  Settings,
  Activity,
  Home,
  Lock,
  Thermometer,
  Search,
} from "lucide-react";

// Schema-aligned: sensors, device_status, hubs, room_packs
interface Sensor {
  sensor_id: number;
  sensor_type: "motion" | "door" | "bed" | "environmental" | "panic";
  device_id: string;
  status: "active" | "inactive" | "maintenance";
  facility_id: number;
  // From device_status table
  battery_level: number;
  connection_status: "connected" | "disconnected" | "intermittent";
  signal_strength: number; // dBm, typically -30 to -90
  last_sync: string;
  // Joined data
  patient_name: string;
  room_name: string;
  hub_serial: string;
}

interface Hub {
  hub_id: number;
  facility_id: number;
  location_id: number;
  serial_number: string;
  firmware_version: string;
  status: "online" | "offline" | "updating";
  room_name: string;
  connected_sensors: number;
}

const sensors: Sensor[] = [
  {
    sensor_id: 312,
    sensor_type: "motion",
    device_id: "MOT-99321",
    status: "active",
    facility_id: 12,
    battery_level: 78.5,
    connection_status: "connected",
    signal_strength: -62,
    last_sync: "2026-02-01T06:59:00Z",
    patient_name: "Margaret Johnson",
    room_name: "Room 214",
    hub_serial: "HUB-DEL-8821"
  },
  {
    sensor_id: 318,
    sensor_type: "door",
    device_id: "DOR-77812",
    status: "active",
    facility_id: 12,
    battery_level: 91.0,
    connection_status: "connected",
    signal_strength: -58,
    last_sync: "2026-02-01T06:58:00Z",
    patient_name: "Helen Davis",
    room_name: "Room 305",
    hub_serial: "HUB-DEL-8830"
  },
  {
    sensor_id: 320,
    sensor_type: "bed",
    device_id: "BED-55432",
    status: "inactive",
    facility_id: 12,
    battery_level: 12.0,
    connection_status: "disconnected",
    signal_strength: -85,
    last_sync: "2026-02-01T04:30:00Z",
    patient_name: "James Wilson",
    room_name: "Room 122",
    hub_serial: "HUB-DEL-8818"
  },
  {
    sensor_id: 325,
    sensor_type: "environmental",
    device_id: "ENV-33298",
    status: "active",
    facility_id: 12,
    battery_level: 88.5,
    connection_status: "connected",
    signal_strength: -52,
    last_sync: "2026-02-01T06:59:30Z",
    patient_name: "Patricia Brown",
    room_name: "Room 210",
    hub_serial: "HUB-DEL-8825"
  },
  {
    sensor_id: 328,
    sensor_type: "panic",
    device_id: "PAN-88721",
    status: "active",
    facility_id: 12,
    battery_level: 95.0,
    connection_status: "connected",
    signal_strength: -40,
    last_sync: "2026-02-01T06:30:00Z",
    patient_name: "Margaret Johnson",
    room_name: "Room 214",
    hub_serial: "HUB-DEL-8821"
  },
  {
    sensor_id: 330,
    sensor_type: "motion",
    device_id: "MOT-99322",
    status: "active",
    facility_id: 12,
    battery_level: 85.0,
    connection_status: "connected",
    signal_strength: -55,
    last_sync: "2026-02-01T06:45:00Z",
    patient_name: "Dorothy Miller",
    room_name: "Room 301",
    hub_serial: "HUB-DEL-8830"
  },
  {
    sensor_id: 335,
    sensor_type: "door",
    device_id: "DOR-77813",
    status: "active",
    facility_id: 12,
    battery_level: 72.0,
    connection_status: "connected",
    signal_strength: -60,
    last_sync: "2026-02-01T06:50:00Z",
    patient_name: "Elizabeth Taylor",
    room_name: "Room 110",
    hub_serial: "HUB-DEL-8815"
  },
  {
    sensor_id: 338,
    sensor_type: "bed",
    device_id: "BED-55433",
    status: "active",
    facility_id: 12,
    battery_level: 68.0,
    connection_status: "connected",
    signal_strength: -50,
    last_sync: "2026-02-01T06:52:00Z",
    patient_name: "Charles Moore",
    room_name: "Room 220",
    hub_serial: "HUB-DEL-8821"
  },
  {
    sensor_id: 340,
    sensor_type: "environmental",
    device_id: "ENV-33299",
    status: "maintenance",
    facility_id: 12,
    battery_level: 55.0,
    connection_status: "intermittent",
    signal_strength: -72,
    last_sync: "2026-02-01T05:30:00Z",
    patient_name: "Susan Jackson",
    room_name: "Room 315",
    hub_serial: "HUB-DEL-8830"
  },
  {
    sensor_id: 342,
    sensor_type: "panic",
    device_id: "PAN-88722",
    status: "active",
    facility_id: 12,
    battery_level: 88.0,
    connection_status: "connected",
    signal_strength: -42,
    last_sync: "2026-02-01T06:35:00Z",
    patient_name: "Joseph White",
    room_name: "Room 125",
    hub_serial: "HUB-DEL-8818"
  },
  // Additional sensors
  {
    sensor_id: 345,
    sensor_type: "motion",
    device_id: "MOT-99323",
    status: "active",
    facility_id: 12,
    battery_level: 92.0,
    connection_status: "connected",
    signal_strength: -48,
    last_sync: "2026-02-01T06:58:00Z",
    patient_name: "Nancy Harris",
    room_name: "Room 402",
    hub_serial: "HUB-DEL-8850"
  },
  {
    sensor_id: 350,
    sensor_type: "door",
    device_id: "DOR-77814",
    status: "active",
    facility_id: 12,
    battery_level: 81.0,
    connection_status: "connected",
    signal_strength: -55,
    last_sync: "2026-02-01T06:55:00Z",
    patient_name: "Barbara Lewis",
    room_name: "Room 312",
    hub_serial: "HUB-DEL-8832"
  },
  {
    sensor_id: 352,
    sensor_type: "bed",
    device_id: "BED-55434",
    status: "active",
    facility_id: 12,
    battery_level: 76.0,
    connection_status: "connected",
    signal_strength: -47,
    last_sync: "2026-02-01T06:57:00Z",
    patient_name: "Richard Robinson",
    room_name: "Room 225",
    hub_serial: "HUB-DEL-8855"
  },
  {
    sensor_id: 355,
    sensor_type: "environmental",
    device_id: "ENV-33300",
    status: "active",
    facility_id: 12,
    battery_level: 64.0,
    connection_status: "connected",
    signal_strength: -58,
    last_sync: "2026-02-01T06:52:00Z",
    patient_name: "Linda Walker",
    room_name: "Room 420",
    hub_serial: "HUB-DEL-8860"
  },
  {
    sensor_id: 358,
    sensor_type: "panic",
    device_id: "PAN-88723",
    status: "active",
    facility_id: 12,
    battery_level: 97.0,
    connection_status: "connected",
    signal_strength: -38,
    last_sync: "2026-02-01T06:30:00Z",
    patient_name: "Edward Young",
    room_name: "Room 130",
    hub_serial: "HUB-DEL-8818"
  },
  {
    sensor_id: 360,
    sensor_type: "motion",
    device_id: "MOT-99324",
    status: "inactive",
    facility_id: 12,
    battery_level: 8.0,
    connection_status: "disconnected",
    signal_strength: -88,
    last_sync: "2026-02-01T02:15:00Z",
    patient_name: "Carol King",
    room_name: "Room 318",
    hub_serial: "HUB-DEL-8832"
  },
  {
    sensor_id: 365,
    sensor_type: "door",
    device_id: "DOR-77815",
    status: "maintenance",
    facility_id: 12,
    battery_level: 42.0,
    connection_status: "intermittent",
    signal_strength: -75,
    last_sync: "2026-02-01T04:20:00Z",
    patient_name: "Michelle Scott",
    room_name: "Room 415",
    hub_serial: "HUB-DEL-8860"
  },
  {
    sensor_id: 368,
    sensor_type: "bed",
    device_id: "BED-55435",
    status: "active",
    facility_id: 12,
    battery_level: 83.0,
    connection_status: "connected",
    signal_strength: -44,
    last_sync: "2026-02-01T06:56:00Z",
    patient_name: "Kevin Green",
    room_name: "Room 140",
    hub_serial: "HUB-DEL-8815"
  },
];

const hubs: Hub[] = [
  { hub_id: 45, facility_id: 12, location_id: 88, serial_number: "HUB-DEL-8821", firmware_version: "v1.4.2", status: "online", room_name: "Room 214", connected_sensors: 3 },
  { hub_id: 46, facility_id: 12, location_id: 89, serial_number: "HUB-DEL-8815", firmware_version: "v1.4.2", status: "online", room_name: "Room 118", connected_sensors: 2 },
  { hub_id: 47, facility_id: 12, location_id: 90, serial_number: "HUB-DEL-8830", firmware_version: "v1.4.1", status: "online", room_name: "Room 305", connected_sensors: 4 },
  { hub_id: 48, facility_id: 12, location_id: 91, serial_number: "HUB-DEL-8818", firmware_version: "v1.4.2", status: "offline", room_name: "Room 122", connected_sensors: 1 },
  { hub_id: 49, facility_id: 12, location_id: 92, serial_number: "HUB-DEL-8825", firmware_version: "v1.4.2", status: "online", room_name: "Room 210", connected_sensors: 2 },
  { hub_id: 50, facility_id: 12, location_id: 93, serial_number: "HUB-DEL-8832", firmware_version: "v1.4.0", status: "updating", room_name: "Room 301", connected_sensors: 3 },
  { hub_id: 51, facility_id: 12, location_id: 94, serial_number: "HUB-DEL-8840", firmware_version: "v1.4.2", status: "online", room_name: "Room 315", connected_sensors: 2 },
  { hub_id: 52, facility_id: 12, location_id: 95, serial_number: "HUB-DEL-8845", firmware_version: "v1.4.2", status: "online", room_name: "Room 125", connected_sensors: 1 },
  // Additional hubs
  { hub_id: 53, facility_id: 12, location_id: 96, serial_number: "HUB-DEL-8850", firmware_version: "v1.4.2", status: "online", room_name: "Room 402", connected_sensors: 2 },
  { hub_id: 54, facility_id: 12, location_id: 97, serial_number: "HUB-DEL-8855", firmware_version: "v1.4.2", status: "online", room_name: "Room 225", connected_sensors: 3 },
  { hub_id: 55, facility_id: 12, location_id: 98, serial_number: "HUB-DEL-8860", firmware_version: "v1.4.1", status: "online", room_name: "Room 420", connected_sensors: 2 },
  { hub_id: 56, facility_id: 12, location_id: 99, serial_number: "HUB-DEL-8865", firmware_version: "v1.4.2", status: "offline", room_name: "Room 130", connected_sensors: 0 },
  { hub_id: 57, facility_id: 12, location_id: 100, serial_number: "HUB-DEL-8870", firmware_version: "v1.4.2", status: "online", room_name: "Room 318", connected_sensors: 1 },
  { hub_id: 58, facility_id: 12, location_id: 101, serial_number: "HUB-DEL-8875", firmware_version: "v1.4.0", status: "updating", room_name: "Room 232", connected_sensors: 2 },
  { hub_id: 59, facility_id: 12, location_id: 102, serial_number: "HUB-DEL-8880", firmware_version: "v1.4.2", status: "online", room_name: "Room 415", connected_sensors: 1 },
];

const sensorTypeLabels: Record<Sensor["sensor_type"], string> = {
  motion: "Motion Sensor",
  door: "Door Sensor",
  bed: "Bed Sensor",
  environmental: "Environmental",
  panic: "Panic Button"
};

const getDeviceIcon = (type: Sensor["sensor_type"]) => {
  switch (type) {
    case "door": return Lock;
    case "environmental": return Thermometer;
    case "panic": return Activity;
    case "bed": return Home;
    case "motion": return Home;
    default: return Home;
  }
};

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

const getSignalStrengthLabel = (dbm: number): { label: string; color: string } => {
  if (dbm >= -50) return { label: "Excellent", color: "text-green-600" };
  if (dbm >= -60) return { label: "Good", color: "text-green-500" };
  if (dbm >= -70) return { label: "Fair", color: "text-yellow-600" };
  return { label: "Poor", color: "text-red-600" };
};

const SENSORS_PER_PAGE = 4;
const HUBS_PER_PAGE = 3;

type SensorFilterType = "all" | "connected" | "disconnected" | "low-battery" | "hubs";

export function DevicesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sensorPage, setSensorPage] = useState(1);
  const [hubPage, setHubPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<SensorFilterType>("all");
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    device_type: "",
    device_id: "",
    room: "",
    patient: "",
  });

  // Filter sensors based on search and filter
  const filteredSensors = sensors.filter(sensor => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      sensor.device_id.toLowerCase().includes(query) ||
      sensor.patient_name.toLowerCase().includes(query) ||
      sensor.room_name.toLowerCase().includes(query) ||
      sensorTypeLabels[sensor.sensor_type].toLowerCase().includes(query) ||
      sensor.connection_status.toLowerCase().includes(query)
    );

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "connected":
        return sensor.connection_status === "connected";
      case "disconnected":
        return sensor.connection_status === "disconnected";
      case "low-battery":
        return sensor.battery_level < 20;
      default:
        return true;
    }
  });

  // Filter hubs based on search
  const filteredHubs = hubs.filter(hub => {
    const query = searchQuery.toLowerCase();
    return (
      hub.serial_number.toLowerCase().includes(query) ||
      hub.room_name.toLowerCase().includes(query) ||
      hub.status.toLowerCase().includes(query) ||
      hub.firmware_version.toLowerCase().includes(query)
    );
  });

  // Paginate sensors
  const totalSensorPages = Math.ceil(filteredSensors.length / SENSORS_PER_PAGE);
  const paginatedSensors = filteredSensors.slice(
    (sensorPage - 1) * SENSORS_PER_PAGE,
    sensorPage * SENSORS_PER_PAGE
  );

  // Paginate hubs
  const totalHubPages = Math.ceil(filteredHubs.length / HUBS_PER_PAGE);
  const paginatedHubs = filteredHubs.slice(
    (hubPage - 1) * HUBS_PER_PAGE,
    hubPage * HUBS_PER_PAGE
  );

  // Reset pages when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setSensorPage(1);
    setHubPage(1);
  };

  // Handle filter change
  const handleFilterChange = (filter: SensorFilterType) => {
    setActiveFilter(filter);
    setSensorPage(1);
  };

  const connectedSensors = sensors.filter(s => s.connection_status === "connected");
  const disconnectedSensors = sensors.filter(s => s.connection_status === "disconnected");
  const lowBatterySensors = sensors.filter(s => s.battery_level < 20);
  const onlineHubs = hubs.filter(h => h.status === "online");

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Devices & Sensors</h1>
            <p className="text-muted-foreground">Manage all connected devices and hubs</p>
          </div>
          <Button className="gap-2" onClick={() => setAddDeviceOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Device
          </Button>
        </div>

        {/* Add Device Dialog */}
        <Dialog open={addDeviceOpen} onOpenChange={setAddDeviceOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1.5">
                <Label>Device Type</Label>
                <Select value={newDevice.device_type} onValueChange={(v) => setNewDevice({ ...newDevice, device_type: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select device type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motion">Motion Sensor</SelectItem>
                    <SelectItem value="door">Door Sensor</SelectItem>
                    <SelectItem value="bed">Bed Sensor</SelectItem>
                    <SelectItem value="environmental">Environmental Sensor</SelectItem>
                    <SelectItem value="panic">Panic Button</SelectItem>
                    <SelectItem value="hub">Hub</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="device-id">Device ID / Serial Number</Label>
                <Input
                  id="device-id"
                  placeholder="e.g. MOT-12345"
                  value={newDevice.device_id}
                  onChange={(e) => setNewDevice({ ...newDevice, device_id: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="device-room">Room / Location</Label>
                <Input
                  id="device-room"
                  placeholder="e.g. Room 204B"
                  value={newDevice.room}
                  onChange={(e) => setNewDevice({ ...newDevice, room: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="device-patient">Assigned Patient (optional)</Label>
                <Input
                  id="device-patient"
                  placeholder="Patient name"
                  value={newDevice.patient}
                  onChange={(e) => setNewDevice({ ...newDevice, patient: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDeviceOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setAddDeviceOpen(false);
                  setNewDevice({ device_type: "", device_id: "", room: "", patient: "" });
                }}
              >
                Add Device
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search devices, patients, rooms..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Cpu className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{sensors.length}</div>
                <div className="text-xs text-muted-foreground">Total Sensors</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "connected" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("connected")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Wifi className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{connectedSensors.length}</div>
                <div className="text-xs text-muted-foreground">Connected</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "disconnected" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("disconnected")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <WifiOff className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{disconnectedSensors.length}</div>
                <div className="text-xs text-muted-foreground">Disconnected</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "low-battery" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("low-battery")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <BatteryLow className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{lowBatterySensors.length}</div>
                <div className="text-xs text-muted-foreground">Low Battery</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "hubs" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("hubs")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Home className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{onlineHubs.length}/{hubs.length}</div>
                <div className="text-xs text-muted-foreground">Hubs Online</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Side by Side Cards - No outer scroll */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Sensors Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Sensors ({filteredSensors.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                {paginatedSensors.map((sensor) => {
                  const DeviceIcon = getDeviceIcon(sensor.sensor_type);
                  const isConnected = sensor.connection_status === "connected";
                  const signalInfo = getSignalStrengthLabel(sensor.signal_strength);
                  return (
                    <div key={sensor.sensor_id} className={`p-3 border rounded-lg ${!isConnected ? "border-red-200 dark:border-red-800" : ""}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isConnected ? "bg-primary/10" : "bg-red-100 dark:bg-red-900/50"}`}>
                            <DeviceIcon className={`h-4 w-4 ${isConnected ? "text-primary" : "text-red-600"}`} />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{sensorTypeLabels[sensor.sensor_type]}</div>
                            <div className="text-xs text-muted-foreground">{sensor.device_id}</div>
                          </div>
                        </div>
                        <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                          {sensor.connection_status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Patient</span>
                          <span className="font-medium truncate ml-1">{sensor.patient_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location</span>
                          <span>{sensor.room_name}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={signalInfo.color}>{sensor.signal_strength} dBm</span>
                          <span className="text-muted-foreground">|</span>
                          <span className="flex items-center gap-1">
                            <Battery className={`h-3 w-3 ${sensor.battery_level < 20 ? "text-red-500" : "text-muted-foreground"}`} />
                            <span className={sensor.battery_level < 20 ? "text-red-500" : ""}>{sensor.battery_level.toFixed(0)}%</span>
                          </span>
                        </div>
                        <span className="text-muted-foreground">{formatTimeAgo(sensor.last_sync)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-3 border-t mt-3">
                <PaginationControlled
                  currentPage={sensorPage}
                  totalPages={totalSensorPages}
                  onPageChange={setSensorPage}
                  totalItems={filteredSensors.length}
                  itemsPerPage={SENSORS_PER_PAGE}
                />
              </div>
            </CardContent>
          </Card>

          {/* Hubs Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                Hubs ({filteredHubs.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                {paginatedHubs.map((hub) => (
                  <div key={hub.hub_id} className={`p-3 border rounded-lg ${hub.status === "offline" ? "border-red-200 dark:border-red-800" : ""}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${hub.status === "online" ? "bg-primary/10" : hub.status === "updating" ? "bg-yellow-100 dark:bg-yellow-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                          <Home className={`h-4 w-4 ${hub.status === "online" ? "text-primary" : hub.status === "updating" ? "text-yellow-600" : "text-red-600"}`} />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{hub.serial_number}</div>
                          <div className="text-xs text-muted-foreground">{hub.room_name}</div>
                        </div>
                      </div>
                      <Badge variant={hub.status === "online" ? "default" : hub.status === "updating" ? "secondary" : "destructive"} className="text-xs">
                        {hub.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Firmware: <span className="text-foreground">{hub.firmware_version}</span></span>
                      <span className="text-muted-foreground">{hub.connected_sensors} sensors</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t mt-3">
                <PaginationControlled
                  currentPage={hubPage}
                  totalPages={totalHubPages}
                  onPageChange={setHubPage}
                  totalItems={filteredHubs.length}
                  itemsPerPage={HUBS_PER_PAGE}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

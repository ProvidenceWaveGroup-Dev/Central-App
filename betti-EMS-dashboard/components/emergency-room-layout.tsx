"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  User,
  Wifi,
  Clock,
  TrendingDown,
  Navigation,
  Siren,
  CheckCircle,
} from "lucide-react";

// Room layout data - links to resident/device location (percentage-based floor plan)
const ROOM_LAYOUT = [
  { id: "living", name: "Living Room", x: 2, y: 5, w: 35, h: 40, devices: 2, resident: true },
  { id: "kitchen", name: "Kitchen", x: 39, y: 5, w: 30, h: 40, devices: 1, resident: false },
  { id: "bedroom", name: "Bedroom", x: 71, y: 5, w: 27, h: 40, devices: 2, resident: false },
  { id: "bath", name: "Bathroom", x: 71, y: 47, w: 27, h: 28, devices: 3, resident: false },
  { id: "hallway", name: "Hallway", x: 2, y: 47, w: 67, h: 28, devices: 0, resident: false },
  { id: "entrance", name: "Entrance", x: 2, y: 77, w: 35, h: 20, devices: 1, resident: false },
];

// Response time comparison: with layout vs without
const RESPONSE_TIME_DATA = {
  withLayout: { avg: 4.2, unit: "min", improvement: 32 },
  withoutLayout: { avg: 6.2, unit: "min" },
  lastTest: "2024-01-16",
};

export function EmergencyRoomLayout() {
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>("living");
  const residentRoom = ROOM_LAYOUT.find((r) => r.resident);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <MapPin className="h-5 w-5 text-primary" />
              Emergency Room Layout Mapping
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Room/space overview for emergency responders · Resident & device locations
            </p>
          </div>
          <Badge className="w-fit bg-green-600 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Floor plan layout - clickable rooms linked to resident/device location */}
        <div className="rounded-lg border-2 border-border bg-muted/30 p-4 min-h-[320px] relative">
          <div className="absolute inset-4 flex flex-wrap gap-0">
            {ROOM_LAYOUT.map((room) => (
              <button
                key={room.id}
                type="button"
                onMouseEnter={() => setHoveredRoom(room.id)}
                onMouseLeave={() => setHoveredRoom(null)}
                onClick={() => setSelectedRoom(room.id)}
                className={`absolute rounded-md border-2 transition-all duration-200 flex flex-col items-center justify-center text-xs font-medium
                  ${selectedRoom === room.id ? "border-primary bg-primary/20 ring-2 ring-primary/40" : "border-border bg-background hover:bg-primary/10"}
                  ${room.resident ? "border-green-500 bg-green-50 dark:bg-green-950/30" : ""}
                  ${hoveredRoom === room.id ? "z-10 scale-[1.02] shadow-lg" : ""}`}
                style={{
                  left: `${room.x}%`,
                  top: `${room.y}%`,
                  width: `${room.w}%`,
                  height: `${room.h}%`,
                }}
              >
                <span className="truncate w-full px-1">{room.name}</span>
                {room.resident && (
                  <span className="flex items-center gap-0.5 text-green-600 mt-0.5">
                    <User className="h-3 w-3" />
                    Resident
                  </span>
                )}
                {room.devices > 0 && (
                  <span className="flex items-center gap-0.5 text-muted-foreground mt-0.5">
                    <Wifi className="h-3 w-3" />
                    {room.devices}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-green-500 bg-green-50" />
            <span>Resident location</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-muted-foreground" />
            <span>Betti devices/sensors</span>
          </div>
        </div>

        {/* Selected room details - link layout to resident/device */}
        {selectedRoom && (
          <div className="rounded-lg border bg-muted/30 p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              {ROOM_LAYOUT.find((r) => r.id === selectedRoom)?.name} — Location Details
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block">Devices</span>
                <span className="font-medium">{ROOM_LAYOUT.find((r) => r.id === selectedRoom)?.devices ?? 0} Betti sensors</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Resident</span>
                <span className="font-medium">{residentRoom?.id === selectedRoom ? "Present" : "Not in room"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Last activity</span>
                <span className="font-medium">2m ago</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Confidence</span>
                <span className="font-medium text-green-600">95%</span>
              </div>
            </div>
          </div>
        )}

        {/* Response time improvements - test results */}
        <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-green-600" />
            Response-Time Improvements (Test Results)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="rounded-lg bg-background p-3 border">
              <span className="text-xs text-muted-foreground block">With layout mapping</span>
              <span className="text-2xl font-bold text-green-600">
                {RESPONSE_TIME_DATA.withLayout.avg} {RESPONSE_TIME_DATA.withLayout.unit}
              </span>
            </div>
            <div className="rounded-lg bg-background p-3 border">
              <span className="text-xs text-muted-foreground block">Without layout</span>
              <span className="text-2xl font-bold text-muted-foreground">
                {RESPONSE_TIME_DATA.withoutLayout.avg} {RESPONSE_TIME_DATA.withoutLayout.unit}
              </span>
            </div>
            <div className="rounded-lg bg-background p-3 border col-span-2 sm:col-span-1">
              <span className="text-xs text-muted-foreground block">Improvement</span>
              <span className="text-2xl font-bold text-primary">
                {RESPONSE_TIME_DATA.withLayout.improvement}% faster
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Last tested: {RESPONSE_TIME_DATA.lastTest} — Layout mapping reduces time-to-locate by providing room overview and device/resident positions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

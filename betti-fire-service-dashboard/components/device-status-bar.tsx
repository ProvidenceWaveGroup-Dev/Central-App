import { Battery, BatteryLow, Wifi, WifiOff, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const devices = [
  { name: "Kitchen Sensor", battery: 85, connected: true, status: "active" },
  { name: "Bedroom Sensor", battery: 15, connected: true, status: "warning" },
  { name: "Living Room Sensor", battery: 92, connected: true, status: "active" },
  { name: "Hallway Sensor", battery: 68, connected: false, status: "offline" },
  { name: "Bathroom Sensor", battery: 45, connected: true, status: "active" },
]

export function DeviceStatusBar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Device Health & Connectivity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {devices.map((device) => (
            <div key={device.name} className="flex items-center justify-between rounded-lg border border-border p-3">
              <div className="flex items-center gap-3">
                {device.status === "active" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : device.status === "warning" ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">{device.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {device.battery < 20 ? (
                    <BatteryLow className="h-4 w-4 text-red-500" />
                  ) : (
                    <Battery className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm">{device.battery}%</span>
                </div>
                {device.connected ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                <Badge
                  variant={
                    device.status === "active" ? "default" : device.status === "warning" ? "secondary" : "destructive"
                  }
                  className={
                    device.status === "active" ? "bg-green-500" : device.status === "warning" ? "bg-yellow-500" : ""
                  }
                >
                  {device.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

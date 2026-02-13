import { Battery, Wifi, WifiOff, BatteryWarning } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function DeviceHealth() {
  const batteryLevel = 45
  const isConnected = true
  const signalStrength = 85

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Battery className="h-5 w-5 text-primary" />
          Device Health / Connectivity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Battery Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {batteryLevel < 20 ? (
                <BatteryWarning className="h-5 w-5 text-destructive" />
              ) : (
                <Battery className="h-5 w-5 text-primary" />
              )}
              <span className="font-semibold text-sm">Battery Level</span>
            </div>
            <span className={`font-bold ${batteryLevel < 20 ? "text-destructive" : "text-foreground"}`}>
              {batteryLevel}%
            </span>
          </div>
          <Progress value={batteryLevel} className={`h-2 ${batteryLevel < 20 ? "[&>div]:bg-destructive" : ""}`} />
          {batteryLevel < 20 && <p className="text-destructive text-xs">Low battery - charge device soon</p>}
        </div>

        {/* Connection Status */}
        <div className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-5 w-5 text-primary" />
              ) : (
                <WifiOff className="h-5 w-5 text-destructive" />
              )}
              <div>
                <p className="font-semibold text-sm">Connection Status</p>
                <p className="text-muted-foreground text-xs">{isConnected ? "Connected to network" : "Disconnected"}</p>
              </div>
            </div>
            <Badge
              variant={isConnected ? "secondary" : "destructive"}
              className={isConnected ? "bg-primary text-white" : ""}
            >
              {isConnected ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>

        {/* Signal Strength */}
        {isConnected && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Signal Strength</span>
              <span className="font-semibold text-sm">{signalStrength}%</span>
            </div>
            <Progress value={signalStrength} className="h-2" />
          </div>
        )}

        {/* Last Sync */}
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Sync</span>
            <span className="font-semibold">2 minutes ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

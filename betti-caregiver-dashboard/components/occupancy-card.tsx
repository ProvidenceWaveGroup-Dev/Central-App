import { MapPin, Navigation, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const movementTrail = [
  { room: "Kitchen", time: "2m 15s ago", confidence: 95 },
  { room: "Hallway", time: "3m 45s ago", confidence: 88 },
  { room: "Bedroom", time: "5m 10s ago", confidence: 92 },
]

export function OccupancyCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-xl">Live Monitoring</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Location */}
        <div className="rounded-lg bg-primary/10 p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-primary">
            <MapPin className="h-4 w-4" />
            Last Known Location
          </div>
          <p className="mt-2 text-2xl font-bold">{movementTrail[0].room}</p>
          <p className="text-sm text-muted-foreground">{movementTrail[0].time}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Confidence:</span>
            <Badge variant="secondary">{movementTrail[0].confidence}%</Badge>
          </div>
        </div>

        {/* Movement Trail */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium">
            <Navigation className="h-4 w-4" />
            Recent Movement Trail
          </div>
          <div className="space-y-2">
            {movementTrail.map((location, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${index === 0 ? "bg-primary" : "bg-muted-foreground"}`} />
                  <div>
                    <p className="font-medium">{location.room}</p>
                    <p className="text-xs text-muted-foreground">{location.time}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {location.confidence}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Floor Plan Placeholder */}
        <div className="rounded-lg border-2 border-dashed border-border p-4">
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            <TrendingUp className="mr-2 h-4 w-4" />
            Floor Plan Visualization
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

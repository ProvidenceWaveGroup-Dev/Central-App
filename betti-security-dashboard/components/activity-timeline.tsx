import { Activity, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const activities = [
  { time: "3:42 AM", event: "Distress alert triggered", type: "critical" },
  { time: "3:40 AM", event: "Movement detected - Hallway", type: "normal" },
  { time: "3:15 AM", event: "No movement (25 mins)", type: "warning" },
  { time: "2:50 AM", event: "Movement detected - Bathroom", type: "normal" },
  { time: "11:30 PM", event: "Evening check-in completed", type: "success" },
]

export function ActivityTimeline() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="flex-shrink-0 pt-1">
                <div
                  className={`h-2 w-2 rounded-full ${
                    activity.type === "critical"
                      ? "bg-destructive"
                      : activity.type === "warning"
                        ? "bg-yellow-500"
                        : activity.type === "success"
                          ? "bg-primary"
                          : "bg-muted-foreground"
                  }`}
                />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm">{activity.event}</p>
                <p className="text-muted-foreground text-xs">{activity.time}</p>
              </div>
              {activity.type === "warning" && (
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Alert
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Bell, Phone, MessageSquare, CheckCircle } from "lucide-react"
import { OccupancyCard } from "./occupancy-card"

export function EventFeed() {
  const events = [
    {
      time: "08:32",
      icon: AlertTriangle,
      title: "Fall detected",
      description: "High-impact fall detected in Living Room",
      status: "critical",
      isLive: true,
    },
    {
      time: "08:33",
      icon: Bell,
      title: "Caregiver notified",
      description: "Alert sent to primary caregiver (Sarah M.)",
      status: "info",
      isLive: true,
    },
    {
      time: "08:34",
      icon: Phone,
      title: "EMS alert sent",
      description: "Emergency services contacted automatically",
      status: "warning",
      isLive: true,
    },
    {
      time: "08:35",
      icon: MessageSquare,
      title: "Betti AI check-in unanswered",
      description: 'Voice prompt: "Are you okay?" - No response',
      status: "critical",
      isLive: true,
    },
    {
      time: "08:30",
      icon: CheckCircle,
      title: "Medication reminder acknowledged",
      description: "Morning medication taken on schedule",
      status: "success",
      isLive: false,
    },
    {
      time: "08:15",
      icon: Bell,
      title: "Hydration reminder",
      description: "Daily water intake below target",
      status: "info",
      isLive: false,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-destructive/10 border-destructive/30"
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30"
      case "success":
        return "bg-primary/10 border-primary/30"
      default:
        return "bg-secondary/10 border-secondary/30"
    }
  }

  const getIconColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-destructive"
      case "warning":
        return "text-yellow-600"
      case "success":
        return "text-primary"
      default:
        return "text-secondary"
    }
  }

  return (
    <Card className="border-border shadow-sm h-full bg-white">
      <CardHeader>
        <CardTitle className="text-xl font-serif">Event Feed</CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time system activity log
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[800px] overflow-y-auto">
          {events.map((event, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getStatusColor(
                event.status
              )}`}
            >
              <div className="flex items-start gap-3">
                <div className="relative mt-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      event.isLive ? "animate-pulse" : "bg-red-500"
                    }`}
                    style={
                      event.isLive ? { backgroundColor: "#5C7F39" } : undefined
                    }
                  />
                </div>
                <div className={`mt-0.5 ${getIconColor(event.status)}`}>
                  <event.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-sm text-foreground">
                      {event.title}
                    </h4>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {event.time}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

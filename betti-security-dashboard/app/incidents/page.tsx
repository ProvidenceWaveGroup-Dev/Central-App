import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const incidentLogs = [
  {
    id: 1,
    timestamp: "2024-01-10 03:30:15",
    type: "Distress Alert",
    severity: "critical",
    source: "Voice Detection",
    location: "Bedroom",
    description: "Voice trigger detected - keyword 'Help' identified",
    response: "Caregiver notified - Sarah Johnson",
    status: "Active",
  },
  {
    id: 2,
    timestamp: "2024-01-10 01:15:42",
    type: "Fall Detection",
    severity: "critical",
    source: "Motion Sensor",
    location: "Bathroom",
    description: "Sudden impact detected with no movement for 30 seconds",
    response: "Emergency services contacted",
    status: "Resolved",
  },
  {
    id: 3,
    timestamp: "2024-01-09 23:45:18",
    type: "Panic Button",
    severity: "critical",
    source: "Manual Trigger",
    location: "Living Room",
    description: "Patient manually triggered panic button",
    response: "Caregiver arrived on scene",
    status: "Resolved",
  },
  {
    id: 4,
    timestamp: "2024-01-09 18:30:05",
    type: "Check-In Missed",
    severity: "warning",
    source: "Automated System",
    location: "Unknown",
    description: "No response to 3 consecutive check-in attempts",
    response: "Follow-up call completed",
    status: "Resolved",
  },
  {
    id: 5,
    timestamp: "2024-01-09 14:20:33",
    type: "Intoxication Alert",
    severity: "warning",
    source: "Voice Analysis",
    location: "Kitchen",
    description: "Slurred speech pattern detected - 85% confidence",
    response: "Monitoring increased",
    status: "Resolved",
  },
]

export default function IncidentsPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8"><div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight">Incidents</h1>
          <p className="text-muted-foreground mt-2">Complete history of security incidents and alerts</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Incident Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidentLogs.map((incident) => (
                <div
                  key={incident.id}
                  className={`rounded-lg border p-4 ${
                    incident.severity === "critical" ? "border-destructive bg-destructive/5" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{incident.type}</h3>
                        <p className="text-muted-foreground text-sm">{incident.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={incident.severity === "critical" ? "destructive" : "secondary"}>
                          {incident.severity}
                        </Badge>
                        <Badge variant={incident.status === "Active" ? "default" : "outline"}>{incident.status}</Badge>
                      </div>
                    </div>

                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Source:</span>
                        <span className="font-medium">{incident.source}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Location:</span>
                        <span className="font-medium">{incident.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Response:</span>
                        <span className="font-medium">{incident.response}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {incident.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div></div>
  )
}

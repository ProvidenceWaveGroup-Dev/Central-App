"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, CheckCircle, Clock } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const alerts = [
  {
    id: 1,
    type: "warning",
    title: "Inactivity Alert",
    message: "No movement detected for 2 hours",
    time: "1:15 PM",
    status: "open",
  },
  {
    id: 2,
    type: "resolved",
    title: "Medication Reminder",
    message: "Evening medication taken",
    time: "12:30 PM",
    status: "resolved",
  },
]

export function AlertsSafety() {
  const [alertsList, setAlertsList] = useState(alerts)
  const { toast } = useToast()

  const handleAcknowledge = (alertId: number) => {
    setAlertsList((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "resolved" as const, type: "resolved" as const } : alert,
      ),
    )

    toast({
      title: "Alert Acknowledged",
      description: "The alert has been marked as resolved",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-destructive" />
          Alerts & Safety
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {alertsList.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-4 rounded-lg border border-border">
            <div className="flex-shrink-0 mt-0.5">
              {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-destructive" />}
              {alert.type === "resolved" && <CheckCircle className="h-4 w-4 text-primary" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium text-foreground">{alert.title}</h4>
                <Badge variant={alert.status === "open" ? "destructive" : "secondary"} className="text-xs">
                  {alert.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {alert.time}
                </span>
                {alert.status === "open" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs bg-transparent"
                    onClick={() => handleAcknowledge(alert.id)}
                  >
                    Acknowledge
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

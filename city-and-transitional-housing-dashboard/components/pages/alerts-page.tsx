"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock } from "lucide-react"

export function AlertsPage() {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "High Temperature Detected",
      property: "Riverside Apartments - Unit 12A",
      severity: "critical",
      timestamp: "2024-10-25 14:32",
      status: "Open",
      description: "HVAC system malfunction detected",
    },
    {
      id: 2,
      title: "Water Leak Reported",
      property: "Green Valley Housing - Unit 5B",
      severity: "high",
      timestamp: "2024-10-25 13:15",
      status: "In Progress",
      description: "Bathroom water leak reported by resident",
    },
    {
      id: 3,
      title: "Maintenance Request",
      property: "Downtown Residences - Unit 23C",
      severity: "medium",
      timestamp: "2024-10-25 11:45",
      status: "Open",
      description: "Door lock replacement needed",
    },
    {
      id: 4,
      title: "Safety Inspection Due",
      property: "Northside Complex",
      severity: "medium",
      timestamp: "2024-10-24 09:20",
      status: "Scheduled",
      description: "Quarterly safety inspection scheduled",
    },
    {
      id: 5,
      title: "Electrical Issue",
      property: "Riverside Apartments - Unit 8F",
      severity: "high",
      timestamp: "2024-10-24 16:50",
      status: "Resolved",
      description: "Outlet malfunction - replaced",
    },
  ])

  const [selectedFilter, setSelectedFilter] = useState("All")

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Resolved":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "In Progress":
        return <Clock className="w-5 h-5 text-blue-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    if (selectedFilter === "All") return true
    if (selectedFilter === "Critical") return alert.severity === "critical"
    if (selectedFilter === "High") return alert.severity === "high"
    if (selectedFilter === "Medium") return alert.severity === "medium"
    if (selectedFilter === "Open") return alert.status === "Open"
    if (selectedFilter === "Resolved") return alert.status === "Resolved"
    return true
  })

  const handleAcknowledge = (alertId: number) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, status: "In Progress" } : alert)))
    alert("Alert acknowledged successfully")
  }

  const handleView = (alertId: number) => {
    alert(`View details for alert ${alertId}`)
  }

  return (
    <main className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Alerts</h1>
        <p className="text-muted-foreground">Real-time feed of safety, health, and maintenance alerts</p>
      </div>

      {/* Alert filters */}
      <div className="flex flex-wrap gap-2">
        {["All", "Critical", "High", "Medium", "Open", "Resolved"].map((filter) => (
          <Badge
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            className={`cursor-pointer ${selectedFilter === filter ? "bg-primary hover:bg-primary/90" : ""}`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <Card key={alert.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="mt-1">{getStatusIcon(alert.status)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{alert.title}</h3>
                      <p className="text-sm text-muted-foreground">{alert.property}</p>
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleView(alert.id)}>
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => handleAcknowledge(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}

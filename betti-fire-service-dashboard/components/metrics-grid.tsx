import { Clock, UserCheck, MessageSquare, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const metrics = [
  {
    icon: Clock,
    title: "Alert Timestamp & Duration",
    value: "10:23:45 AM",
    subtitle: "Duration: 2m 15s",
    status: "active",
  },
  {
    icon: UserCheck,
    title: "Caregiver Notification",
    value: "Acknowledged",
    subtitle: "Sarah Johnson - 10:24 AM",
    status: "success",
  },
  {
    icon: MessageSquare,
    title: "AI Check-In Status",
    value: "No Response",
    subtitle: '"Are you OK?" prompt sent 1m ago',
    status: "warning",
  },
  {
    icon: Shield,
    title: "Alert Source",
    value: "Halo Sensor",
    subtitle: "Voice trigger + Smoke detection",
    status: "info",
  },
]

export function MetricsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title} className="transition-all hover:shadow-lg hover:scale-105 duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
            <Badge
              variant={metric.status === "success" ? "default" : metric.status === "warning" ? "secondary" : "outline"}
              className={`mt-2 ${
                metric.status === "success" ? "bg-green-500" : metric.status === "warning" ? "bg-yellow-500" : ""
              }`}
            >
              {metric.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "movement",
    icon: "🚶‍♂️",
    message: "In Living Room – Sitting",
    time: "2 mins ago",
    status: "normal",
    color: "text-green-600",
  },
  {
    id: 2,
    type: "medication",
    icon: "💊",
    message: "Evening medication taken",
    time: "1 hour ago",
    status: "normal",
    color: "text-primary",
  },
  {
    id: 3,
    type: "hydration",
    icon: "💧",
    message: "Hydration reminder logged",
    time: "2 hours ago",
    status: "normal",
    color: "text-blue-600",
  },
  {
    id: 4,
    type: "meal",
    icon: "🍽️",
    message: "Lunch completed",
    time: "3 hours ago",
    status: "normal",
    color: "text-orange-600",
  },
  {
    id: 5,
    type: "sleep",
    icon: "🛏️",
    message: "Afternoon rest (30 mins)",
    time: "4 hours ago",
    status: "normal",
    color: "text-purple-600",
  },
  {
    id: 6,
    type: "bathroom",
    icon: "🚿",
    message: "Restroom visit",
    time: "5 hours ago",
    status: "normal",
    color: "text-gray-600",
  },
]

export function ActivityFeed() {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Activity className="h-5 w-5 text-primary" />
          Activity Feed
          <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800 border-green-200">
            Live
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">Last 24 hours</p>
      </CardHeader>
      <CardContent className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-sm">
              {activity.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{activity.message}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${
                activity.status === "normal"
                  ? "bg-green-500"
                  : activity.status === "missed"
                    ? "bg-orange-500"
                    : "bg-red-500"
              }`}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

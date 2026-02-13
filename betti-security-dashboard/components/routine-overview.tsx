import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const routineTasks = [
  { task: "Morning medication", time: "8:00 AM", status: "missed", icon: XCircle },
  { task: "Breakfast reminder", time: "8:30 AM", status: "missed", icon: XCircle },
  { task: "Hydration check", time: "10:00 AM", status: "pending", icon: Clock },
  { task: "Lunch reminder", time: "12:00 PM", status: "pending", icon: Clock },
  { task: "Evening medication", time: "6:00 PM", status: "completed", icon: CheckCircle },
  { task: "Dinner reminder", time: "6:30 PM", status: "completed", icon: CheckCircle },
]

export function RoutineOverview() {
  const completedCount = routineTasks.filter((t) => t.status === "completed").length
  const totalCount = routineTasks.length
  const completionRate = Math.round((completedCount / totalCount) * 100)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 font-serif">
            <Calendar className="h-5 w-5 text-primary" />
            Daily Routine Summary
          </CardTitle>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">Completion Rate</p>
            <p className="font-serif text-2xl font-bold">{completionRate}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={completionRate} className="h-3" />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {routineTasks.map((task, index) => {
            const Icon = task.icon
            return (
              <div
                key={index}
                className={`rounded-lg border p-3 ${
                  task.status === "missed"
                    ? "border-destructive/50 bg-destructive/5"
                    : task.status === "completed"
                      ? "border-primary/50 bg-primary/5"
                      : "border-border"
                }`}
              >
                <div className="flex items-start gap-2">
                  <Icon
                    className={`mt-0.5 h-4 w-4 ${
                      task.status === "missed"
                        ? "text-destructive"
                        : task.status === "completed"
                          ? "text-primary"
                          : "text-muted-foreground"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{task.task}</p>
                    <p className="text-muted-foreground text-xs">{task.time}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="rounded-lg bg-yellow-500/10 p-3">
          <p className="font-semibold text-sm">⚠️ Routine Deviation Alert</p>
          <p className="mt-1 text-muted-foreground text-xs">
            Morning check-in and medication reminders were not completed. This deviation from normal routine may
            indicate a concern.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

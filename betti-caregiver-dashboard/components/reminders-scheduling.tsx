"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Plus, CheckCircle, AlertCircle, User, Pill, Dumbbell } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { AddReminderDialog } from "@/components/add-reminder-dialog"
import { format } from "date-fns"
import Link from "next/link"

const upcomingReminders = [
  {
    id: 1,
    type: "medication",
    icon: Pill,
    title: "Evening Medication",
    description: "Blood pressure medication",
    time: "6:00 PM",
    status: "upcoming",
    priority: "high",
  },
  {
    id: 2,
    type: "appointment",
    icon: User,
    title: "Doctor Visit - Dr. Smith",
    description: "Regular checkup",
    time: "Tomorrow 10:00 AM",
    status: "confirmed",
    priority: "high",
  },
  {
    id: 3,
    type: "exercise",
    icon: Dumbbell,
    title: "Light Walking Exercise",
    description: "15 minutes around the house",
    time: "4:00 PM",
    status: "upcoming",
    priority: "medium",
  },
  {
    id: 4,
    type: "hydration",
    icon: Clock,
    title: "Hydration Reminder",
    description: "Drink a glass of water",
    time: "Every 2 hours",
    status: "recurring",
    priority: "medium",
  },
]

const todaySchedule = [
  { time: "8:00 AM", event: "Morning medication ✓", completed: true },
  { time: "9:00 AM", event: "Breakfast ✓", completed: true },
  { time: "12:00 PM", event: "Lunch ✓", completed: true },
  { time: "2:00 PM", event: "Afternoon rest ✓", completed: true },
  { time: "4:00 PM", event: "Light exercise", completed: false },
  { time: "6:00 PM", event: "Evening medication", completed: false },
  { time: "7:00 PM", event: "Dinner", completed: false },
]

export function RemindersScheduling() {
  const [reminders, setReminders] = useState(upcomingReminders)
  const [schedule, setSchedule] = useState(todaySchedule)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleCompleteReminder = (reminderId: number) => {
    setReminders((prev) =>
      prev.map((reminder) => (reminder.id === reminderId ? { ...reminder, status: "completed" as const } : reminder)),
    )

    toast({
      title: "Reminder Completed",
      description: "The reminder has been marked as done",
    })
  }

  const handleAddReminder = () => {
    setIsAddDialogOpen(true)
  }

  const handleSubmitReminder = (reminderData: {
    title: string
    date: Date
    time: string
    purpose: string
  }) => {
    const iconMap: Record<string, typeof Pill | typeof User | typeof Dumbbell | typeof Clock> = {
      medication: Pill,
      checkup: User,
      appointment: User,
      exercise: Dumbbell,
      hydration: Clock,
      meal: Clock,
      other: Clock,
    }

    const newReminder = {
      id: reminders.length + 1,
      type: reminderData.purpose as "medication" | "appointment" | "exercise" | "hydration",
      icon: iconMap[reminderData.purpose] || Clock,
      title: reminderData.title,
      description: reminderData.purpose,
      time: `${format(reminderData.date, "MMM d")} at ${reminderData.time}`,
      status: "upcoming" as const,
      priority: "medium" as const,
    }

    setReminders((prev) => [...prev, newReminder])

    toast({
      title: "Reminder Added",
      description: `${reminderData.title} has been scheduled for ${format(reminderData.date, "PPP")} at ${reminderData.time}`,
    })
  }

  const handleViewCalendar = () => {
    // Navigation handled by Link component
  }

  return (
    <>
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-accent" />
            Reminders & Calendar
            <Button size="sm" variant="outline" className="ml-auto bg-transparent" onClick={handleAddReminder}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Upcoming Appointments</h4>
            {reminders
              .filter((r) => r.type === "appointment")
              .map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-blue-50"
                >
                  <reminder.icon className="h-4 w-4 text-secondary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-foreground">{reminder.title}</h5>
                    <p className="text-xs text-muted-foreground">{reminder.description}</p>
                    <p className="text-xs text-secondary font-medium">{reminder.time}</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    {reminder.status}
                  </Badge>
                </div>
              ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Today&apos;s Reminders</h4>
            {reminders
              .filter((r) => r.type !== "appointment")
              .map((reminder) => (
                <div key={reminder.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <reminder.icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-foreground">{reminder.title}</h5>
                    <p className="text-xs text-muted-foreground">{reminder.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {reminder.priority === "high" && <AlertCircle className="h-3 w-3 text-orange-500" />}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="p-1"
                      onClick={() => handleCompleteReminder(reminder.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Today&apos;s Schedule</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {schedule.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded text-xs ${
                    item.completed ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  <span className="font-medium w-16 flex-shrink-0">{item.time}</span>
                  <span className="flex-1">{item.event}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <Link href="/calendar">
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View Full Calendar
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <AddReminderDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddReminder={handleSubmitReminder}
      />
    </>
  )
}

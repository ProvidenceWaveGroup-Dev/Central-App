"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Plus, CheckCircle, AlertCircle, User, Pill, Dumbbell, Utensils, Droplets, PersonStanding } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { AddReminderDialog } from "@/components/add-reminder-dialog"
import { format } from "date-fns"
import Link from "next/link"

type ReminderType = "medication" | "appointment" | "exercise" | "hydration" | "meal" | "restroom"
type FilterTab = "all" | "meal" | "hydration" | "restroom" | "medication"

const FILTER_TABS: { id: FilterTab; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Calendar },
  { id: "meal", label: "Meal", icon: Utensils },
  { id: "hydration", label: "Hydration", icon: Droplets },
  { id: "restroom", label: "Restroom", icon: PersonStanding },
  { id: "medication", label: "Medication", icon: Pill },
]

const upcomingReminders = [
  {
    id: 1,
    type: "medication" as ReminderType,
    icon: Pill,
    title: "Evening Medication",
    description: "Blood pressure medication",
    time: "6:00 PM",
    status: "upcoming",
    priority: "high",
  },
  {
    id: 2,
    type: "appointment" as ReminderType,
    icon: User,
    title: "Doctor Visit - Dr. Smith",
    description: "Regular checkup",
    time: "Tomorrow 10:00 AM",
    status: "confirmed",
    priority: "high",
  },
  {
    id: 3,
    type: "exercise" as ReminderType,
    icon: Dumbbell,
    title: "Light Walking Exercise",
    description: "15 minutes around the house",
    time: "4:00 PM",
    status: "upcoming",
    priority: "medium",
  },
  {
    id: 4,
    type: "hydration" as ReminderType,
    icon: Droplets,
    title: "Hydration Reminder",
    description: "Drink a glass of water",
    time: "Every 2 hours",
    status: "recurring",
    priority: "medium",
  },
  {
    id: 5,
    type: "meal" as ReminderType,
    icon: Utensils,
    title: "Lunch",
    description: "Prepare afternoon meal",
    time: "12:00 PM",
    status: "upcoming",
    priority: "medium",
  },
  {
    id: 6,
    type: "restroom" as ReminderType,
    icon: PersonStanding,
    title: "Restroom Break",
    description: "Scheduled restroom assistance",
    time: "Every 3 hours",
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
  const [schedule] = useState(todaySchedule)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")
  const { toast } = useToast()

  const getFilterCount = (tab: FilterTab) => {
    if (tab === "all") return reminders.length
    return reminders.filter((r) => r.type === tab).length
  }

  const filteredReminders =
    activeFilter === "all"
      ? reminders
      : reminders.filter((r) => r.type === activeFilter)

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
    const iconMap: Record<string, React.ElementType> = {
      medication: Pill,
      checkup: User,
      appointment: User,
      exercise: Dumbbell,
      hydration: Droplets,
      meal: Utensils,
      restroom: PersonStanding,
      other: Clock,
    }

    const newReminder = {
      id: reminders.length + 1,
      type: reminderData.purpose as ReminderType,
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

  return (
    <>
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-accent" />
            Reminders
            <Button size="sm" variant="outline" className="ml-auto bg-transparent" onClick={handleAddReminder}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {FILTER_TABS.map((tab) => {
              const TabIcon = tab.icon
              const count = getFilterCount(tab.id)
              const isActive = activeFilter === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isActive
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-background text-muted-foreground border-border hover:border-green-400 hover:text-green-700"
                  }`}
                >
                  <TabIcon className="h-3 w-3" />
                  {tab.label}
                  <span className={`ml-0.5 ${isActive ? "opacity-80" : "opacity-60"}`}>({count})</span>
                </button>
              )
            })}
          </div>

          {/* Reminders List */}
          <div className="space-y-3">
            {filteredReminders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No reminders for this category.
              </p>
            ) : (
              filteredReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    reminder.type === "appointment"
                      ? "border-border bg-blue-50"
                      : "bg-muted/30 border-transparent"
                  }`}
                >
                  <reminder.icon
                    className={`h-4 w-4 flex-shrink-0 ${
                      reminder.type === "appointment" ? "text-secondary" : "text-muted-foreground"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-foreground">{reminder.title}</h5>
                    <p className="text-xs text-muted-foreground">{reminder.description}</p>
                    <p className={`text-xs font-medium ${reminder.type === "appointment" ? "text-secondary" : "text-muted-foreground"}`}>
                      {reminder.time}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {reminder.type === "appointment" ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        {reminder.status}
                      </Badge>
                    ) : (
                      <>
                        {reminder.priority === "high" && <AlertCircle className="h-3 w-3 text-orange-500" />}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="p-1"
                          onClick={() => handleCompleteReminder(reminder.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Today's Schedule */}
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

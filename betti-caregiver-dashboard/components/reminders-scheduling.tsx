"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle,
  AlertCircle,
  User,
  Pill,
  Dumbbell,
  Utensils,
  Droplets,
  PersonStanding,
} from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { AddReminderDialog, type ReminderFormType, type ReminderPayload } from "@/components/add-reminder-dialog"
import Link from "next/link"

type FilterTab = "all" | "appointment" | "meal" | "exercise" | "medication" | "hydration" | "restroom"

const FILTER_TABS: { id: FilterTab; label: string; icon: React.ElementType }[] = [
  { id: "all",         label: "All",          icon: Calendar },
  { id: "appointment", label: "Appointments",  icon: User },
  { id: "meal",        label: "Meal",          icon: Utensils },
  { id: "exercise",    label: "PT & Exercise", icon: Dumbbell },
  { id: "medication",  label: "Medication",    icon: Pill },
  { id: "hydration",   label: "Hydration",     icon: Droplets },
  { id: "restroom",    label: "Restroom",       icon: PersonStanding },
]

const ICON_MAP: Record<ReminderFormType, React.ElementType> = {
  appointment: User,
  meal:        Utensils,
  exercise:    Dumbbell,
  medication:  Pill,
  hydration:   Droplets,
  restroom:    PersonStanding,
}

interface Reminder {
  id: number
  type: ReminderFormType
  icon: React.ElementType
  title: string
  description: string
  time: string
  status: string
  priority: "high" | "medium" | "low"
}

const initialReminders: Reminder[] = [
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
    title: "Doctor Visit — Dr. Smith",
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
    icon: Droplets,
    title: "Hydration Reminder",
    description: "Drink a glass of water",
    time: "Every 2 hours",
    status: "recurring",
    priority: "medium",
  },
  {
    id: 5,
    type: "meal",
    icon: Utensils,
    title: "Lunch",
    description: "Prepare afternoon meal",
    time: "12:00 PM",
    status: "upcoming",
    priority: "medium",
  },
  {
    id: 6,
    type: "restroom",
    icon: PersonStanding,
    title: "Restroom Break",
    description: "Scheduled restroom assistance",
    time: "Every 3 hours",
    status: "recurring",
    priority: "medium",
  },
]

const todaySchedule = [
  { time: "8:00 AM",  event: "Morning medication ✓", completed: true },
  { time: "9:00 AM",  event: "Breakfast ✓",           completed: true },
  { time: "12:00 PM", event: "Lunch ✓",                completed: true },
  { time: "2:00 PM",  event: "Afternoon rest ✓",       completed: true },
  { time: "4:00 PM",  event: "Light exercise",          completed: false },
  { time: "6:00 PM",  event: "Evening medication",      completed: false },
  { time: "7:00 PM",  event: "Dinner",                  completed: false },
]

export function RemindersScheduling() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all")
  const { toast } = useToast()

  const getFilterCount = (tab: FilterTab) =>
    tab === "all" ? reminders.length : reminders.filter((r) => r.type === tab).length

  const filteredReminders =
    activeFilter === "all" ? reminders : reminders.filter((r) => r.type === activeFilter)

  const handleCompleteReminder = (id: number) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "completed" } : r)),
    )
    toast({ title: "Reminder Completed", description: "The reminder has been marked as done" })
  }

  const handleSubmitReminder = (payload: ReminderPayload) => {
    const newReminder: Reminder = {
      id: reminders.length + 1,
      type: payload.type,
      icon: ICON_MAP[payload.type] || Clock,
      title: payload.title,
      description: String(payload.metadata.meal_type || payload.metadata.appointment_type || payload.metadata.exercise_type || payload.type),
      time: payload.timeLabel,
      status: "upcoming",
      priority: "medium",
    }
    setReminders((prev) => [...prev, newReminder])
    toast({
      title: "Reminder Added",
      description: `${payload.title} has been scheduled`,
    })
  }

  return (
    <>
      <Card className="h-fit">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-accent" />
            Reminders
            <Button size="sm" variant="outline" className="ml-auto bg-transparent" onClick={() => setIsAddDialogOpen(true)}>
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
                No reminders in this category.
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
              {todaySchedule.map((item, index) => (
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

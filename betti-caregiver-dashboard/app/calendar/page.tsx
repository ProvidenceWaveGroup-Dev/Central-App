"use client"

import { useState } from "react"
import { ArrowLeft, CalendarIcon, Clock, Pill, User, Dumbbell } from "lucide-react"
import Link from "next/link"
import { format, isSameDay } from "date-fns"

interface Reminder {
  id: number
  type: "medication" | "appointment" | "exercise" | "hydration" | "meal" | "checkup" | "other"
  title: string
  description: string
  date: Date
  time: string
  status: "upcoming" | "completed" | "confirmed" | "recurring"
  priority: "high" | "medium" | "low"
}

const allReminders: Reminder[] = [
  {
    id: 1,
    type: "medication",
    title: "Evening Medication",
    description: "Blood pressure medication",
    date: new Date(),
    time: "6:00 PM",
    status: "upcoming",
    priority: "high",
  },
  {
    id: 2,
    type: "appointment",
    title: "Doctor Visit - Dr. Smith",
    description: "Regular checkup",
    date: new Date(Date.now() + 86400000),
    time: "10:00 AM",
    status: "confirmed",
    priority: "high",
  },
  {
    id: 3,
    type: "exercise",
    title: "Light Walking Exercise",
    description: "15 minutes around the house",
    date: new Date(),
    time: "4:00 PM",
    status: "upcoming",
    priority: "medium",
  },
  {
    id: 4,
    type: "medication",
    title: "Morning Medication",
    description: "Daily vitamins",
    date: new Date(Date.now() + 86400000),
    time: "8:00 AM",
    status: "upcoming",
    priority: "high",
  },
  {
    id: 5,
    type: "appointment",
    title: "Physical Therapy",
    description: "Weekly session",
    date: new Date(Date.now() + 172800000),
    time: "2:00 PM",
    status: "confirmed",
    priority: "medium",
  },
]

const getIconForType = (type: string) => {
  switch (type) {
    case "medication":
      return Pill
    case "appointment":
    case "checkup":
      return User
    case "exercise":
      return Dumbbell
    default:
      return Clock
  }
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [reminders] = useState<Reminder[]>(allReminders)

  const selectedDateReminders = reminders.filter((reminder) => {
    const reminderDate = format(reminder.date, "yyyy-MM-dd")
    return reminderDate === selectedDate
  })

  const getPriorityBadgeStyle = (priority: string) => {
    if (priority === "high") {
      return "bg-red-100 text-red-800 border border-red-300"
    }
    if (priority === "medium") {
      return "bg-yellow-100 text-yellow-800 border border-yellow-300"
    }
    return "bg-gray-100 text-gray-800 border border-gray-300"
  }

  const getStatusBadgeStyle = (status: string) => {
    if (status === "completed") {
      return "bg-green-100 text-green-800 border border-green-300"
    }
    if (status === "confirmed") {
      return "bg-blue-100 text-blue-800 border border-blue-300"
    }
    if (status === "recurring") {
      return "bg-purple-100 text-purple-800 border border-purple-300"
    }
    return "bg-gray-100 text-gray-800 border border-gray-300"
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </Link>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Full Calendar</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage all reminders</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar View Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <CalendarIcon className="h-5 w-5 text-[#5C7F39]" />
                Calendar View
              </h2>
            </div>
            <div>
              <label htmlFor="date-selector" className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                id="date-selector"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent"
              />
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Total Reminders:</span> {reminders.length}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-semibold">Selected Date:</span> {format(new Date(selectedDate), "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>

          {/* Selected Date Reminders Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Clock className="h-5 w-5 text-[#5C7F39]" />
                {format(new Date(selectedDate), "MMMM d, yyyy")}
              </h2>
            </div>
            <div>
              {selectedDateReminders.length > 0 ? (
                <div className="space-y-3">
                  {selectedDateReminders.map((reminder) => {
                    const Icon = getIconForType(reminder.type)
                    return (
                      <div
                        key={reminder.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
                      >
                        <Icon className="h-5 w-5 text-[#233E7D] flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h4 className="text-sm font-semibold text-gray-900">{reminder.title}</h4>
                            {reminder.priority === "high" && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadgeStyle(reminder.priority)}`}>
                                High Priority
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{reminder.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs font-medium text-[#233E7D]">{reminder.time}</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ml-auto ${getStatusBadgeStyle(reminder.status)}`}>
                              {reminder.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No reminders scheduled for this date</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* All Upcoming Reminders Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">All Upcoming Reminders</h2>
          </div>
          <div>
            <div className="space-y-3">
              {reminders
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((reminder) => {
                  const Icon = getIconForType(reminder.type)
                  return (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <Icon className="h-5 w-5 text-[#233E7D] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900">{reminder.title}</h4>
                        <p className="text-xs text-gray-600">{reminder.description}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <CalendarIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-600">{format(reminder.date, "MMM d, yyyy")}</span>
                          <Clock className="h-3 w-3 text-gray-400 ml-2" />
                          <span className="text-xs font-medium text-[#233E7D]">{reminder.time}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${reminder.priority === "high" ? getPriorityBadgeStyle(reminder.priority) : getStatusBadgeStyle(reminder.status)}`}>
                        {reminder.status}
                      </span>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

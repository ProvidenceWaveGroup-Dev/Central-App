"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AlertTriangle, Bell, Phone, MessageSquare, CheckCircle, CalendarIcon, Filter, Download } from "lucide-react"
import { format } from "date-fns"
import { OccupancyCard } from "@/components/occupancy-card"

const allEvents = [
  {
    date: new Date(2025, 9, 8, 8, 32),
    icon: AlertTriangle,
    title: "Fall detected",
    description: "High-impact fall detected in Living Room",
    status: "critical",
    category: "Safety Alert",
  },
  {
    date: new Date(2025, 9, 8, 8, 33),
    icon: Bell,
    title: "Caregiver notified",
    description: "Alert sent to primary caregiver (Sarah M.)",
    status: "info",
    category: "Notification",
  },
  {
    date: new Date(2025, 9, 8, 8, 34),
    icon: Phone,
    title: "EMS alert sent",
    description: "Emergency services contacted automatically",
    status: "warning",
    category: "Emergency",
  },
  {
    date: new Date(2025, 9, 8, 8, 35),
    icon: MessageSquare,
    title: "Betti AI check-in unanswered",
    description: 'Voice prompt: "Are you okay?" - No response',
    status: "critical",
    category: "AI Interaction",
  },
  {
    date: new Date(2025, 9, 8, 8, 30),
    icon: CheckCircle,
    title: "Medication reminder acknowledged",
    description: "Morning medication taken on schedule",
    status: "success",
    category: "Medication",
  },
  {
    date: new Date(2025, 9, 8, 8, 15),
    icon: Bell,
    title: "Hydration reminder",
    description: "Daily water intake below target",
    status: "info",
    category: "Health Reminder",
  },
  {
    date: new Date(2025, 9, 7, 20, 15),
    icon: CheckCircle,
    title: "Evening medication taken",
    description: "All evening medications confirmed",
    status: "success",
    category: "Medication",
  },
  {
    date: new Date(2025, 9, 7, 14, 30),
    icon: Bell,
    title: "Appointment reminder",
    description: "Doctor appointment tomorrow at 10:00 AM",
    status: "info",
    category: "Appointment",
  },
  {
    date: new Date(2025, 9, 6, 9, 0),
    icon: CheckCircle,
    title: "Sleep quality good",
    description: "7.5 hours of quality sleep recorded",
    status: "success",
    category: "Sleep",
  },
  {
    date: new Date(2025, 9, 6, 15, 45),
    icon: AlertTriangle,
    title: "Heart rate elevated",
    description: "Heart rate at 105 bpm for 10 minutes",
    status: "warning",
    category: "Vitals",
  },
]

export default function ActivityFeedPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    "all",
    "Safety Alert",
    "Medication",
    "Vitals",
    "Emergency",
    "Notification",
    "AI Interaction",
    "Health Reminder",
    "Appointment",
    "Sleep",
  ]

  const filteredEvents = allEvents.filter((event) => {
    const matchesDate = selectedDate ? format(event.date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd") : true
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    return matchesDate && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-destructive/10 border-destructive/30"
      case "warning":
        return "bg-yellow-500/10 border-yellow-500/30"
      case "success":
        return "bg-primary/10 border-primary/30"
      default:
        return "bg-secondary/10 border-secondary/30"
    }
  }

  const getIconColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-destructive"
      case "warning":
        return "text-yellow-600"
      case "success":
        return "text-primary"
      default:
        return "text-secondary"
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Activity Feed</h1>
          <p className="text-muted-foreground">Real-time event monitoring and historical activity log</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Export Events
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Calendar Filter */}
            <div>
              <h3 className="font-semibold text-sm mb-3 text-foreground">Filter by Date</h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                </PopoverContent>
              </Popover>
              <Button variant="ghost" size="sm" className="w-full mt-2" onClick={() => setSelectedDate(undefined)}>
                Clear Date Filter
              </Button>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="font-semibold text-sm mb-3 text-foreground">Filter by Category</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "ghost"}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category === "all" ? "All Events" : category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Timeline */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-serif">Event Timeline</CardTitle>
              <Badge variant="outline">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedDate ? `Events for ${format(selectedDate, "MMMM d, yyyy")}` : "All events"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[700px] overflow-y-auto">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, index) => (
                  <div key={index} className={`p-4 rounded-lg border ${getStatusColor(event.status)}`}>
                    <div className="flex items-start gap-4">
                      <div className={`mt-0.5 ${getIconColor(event.status)}`}>
                        <event.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-semibold text-sm text-foreground">{event.title}</h4>
                            <Badge variant="outline" className="text-xs mt-1">
                              {event.category}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-foreground">{format(event.date, "h:mm a")}</p>
                            <p className="text-xs text-muted-foreground">{format(event.date, "MMM d, yyyy")}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg text-foreground mb-2">No events found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters to see more events</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <OccupancyCard/>
      </div>
    </div>
  )
}

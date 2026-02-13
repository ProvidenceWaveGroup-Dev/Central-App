"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, MapPin, Camera } from "lucide-react"
import { format } from "date-fns"
import { OccupancyCard } from "@/components/occupancy-card"

export default function OccupancyPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedCamera, setSelectedCamera] = useState<string>("camera1")

  const outdoorCameras = [
    { id: "camera1", name: "Front Entrance", location: "Main Door", status: "Active" },
    { id: "camera2", name: "Back Patio", location: "Rear Exit", status: "Active" },
    { id: "camera3", name: "Driveway", location: "Garage Area", status: "Active" },
    { id: "camera4", name: "Side Yard", location: "Garden", status: "Inactive" },
  ]

  const historicalMovement = [
    {
      date: "2024-01-10",
      movements: [
        { time: "14:30", location: "Kitchen → Living Room → Bedroom" },
        { time: "12:15", location: "Bedroom → Bathroom → Kitchen" },
        { time: "09:00", location: "Bedroom → Kitchen → Living Room" },
      ],
    },
    {
      date: "2024-01-09",
      movements: [
        { time: "14:30", location: "Kitchen → Living Room → Bedroom" },
        { time: "12:15", location: "Bedroom → Bathroom → Kitchen" },
        { time: "09:00", location: "Bedroom → Kitchen → Living Room" },
      ],
    },
    {
      date: "2024-01-08",
      movements: [
        { time: "16:45", location: "Living Room → Kitchen → Bedroom" },
        { time: "13:20", location: "Bedroom → Bathroom → Living Room" },
        { time: "08:30", location: "Bedroom → Kitchen" },
      ],
    },
  ]

  const filteredMovement = historicalMovement.filter((day) => {
    if (!date) return true
    const dayDate = new Date(day.date)
    return (
      dayDate.getDate() === date.getDate() &&
      dayDate.getMonth() === date.getMonth() &&
      dayDate.getFullYear() === date.getFullYear()
    )
  })

  return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Occupancy & Movement</h1>
            <p className="text-muted-foreground mt-1">Real-time location tracking and movement history</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[240px] justify-start text-left font-normal bg-transparent"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <Card className="p-4 md:p-6 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="mt-4 bg-accent/20 rounded-lg p-6 h-[300px] flex items-center justify-center border-2 border-dashed border-accent">
            <div className="text-center">
              <Camera className="h-12 w-12 text-primary mx-auto mb-2 animate-pulse" />
              <p className="text-sm font-medium text-foreground">
                {outdoorCameras.find((c) => c.id === selectedCamera)?.name}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Status: {outdoorCameras.find((c) => c.id === selectedCamera)?.status}
              </p>
            </div>
          </div>
        </Card>

        <div className="animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Live Location & Movement</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="transition-all hover:shadow-lg duration-300">
              <OccupancyCard />
            </div>
            <Card className="p-6 transition-all hover:shadow-lg duration-300 animate-in fade-in slide-in-from-right-4 duration-500">
              <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Live Mini Map</h3>
              <div className="relative bg-accent/20 rounded-lg p-4 h-[300px] border-2 border-dashed border-accent">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-2 animate-pulse" />
                    <p className="text-sm font-medium text-foreground">Current Location: Kitchen</p>
                    <p className="text-xs text-muted-foreground mt-1">Last updated: Just now</p>
                  </div>
                </div>
                {/* Simulated floor plan */}
                <div className="absolute top-4 left-4 w-16 h-16 bg-blue-100 border-2 border-blue-500 rounded flex items-center justify-center text-xs font-medium">
                  Living
                </div>
                <div className="absolute top-4 right-4 w-16 h-16 bg-red-100 border-2 border-red-500 rounded flex items-center justify-center text-xs font-medium">
                  Kitchen
                </div>
                <div className="absolute bottom-4 left-4 w-16 h-16 bg-green-100 border-2 border-green-500 rounded flex items-center justify-center text-xs font-medium">
                  Bedroom
                </div>
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-purple-100 border-2 border-purple-500 rounded flex items-center justify-center text-xs font-medium">
                  Bath
                </div>
                {/* Current position indicator */}
                <div className="absolute top-8 right-8 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg" />
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Movement History</h2>
          <div className="space-y-6">
            {filteredMovement.map((day) => (
              <div key={day.date}>
                <h3 className="font-semibold text-foreground mb-3">{format(new Date(day.date), "MMMM dd, yyyy")}</h3>
                <div className="space-y-2">
                  {day.movements.map((movement, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-accent/20 rounded-lg transition-all hover:bg-accent/30 duration-300"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground min-w-[60px]">
                        {movement.time}
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm text-foreground">{movement.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
  )
}

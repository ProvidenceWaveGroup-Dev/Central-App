"use client"

import { useState } from "react"
import { MapPin, Camera } from "lucide-react"
import { format } from "date-fns"
import { OccupancyCard } from "@/components/occupancy-card"

export default function OccupancyPage() {
  const [date, setDate] = useState(() => {
    const d = new Date()
    return d.toISOString().split("T")[0]
  })
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
    return day.date === date
  })

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Occupancy & Movement</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time location tracking and movement history</p>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full sm:w-[240px] rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent"
          />
        </div>

        <div>
          <h2 className="font-serif text-xl font-semibold text-gray-900 mb-4">Live Location & Movement</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <OccupancyCard />
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h3 className="font-serif text-lg font-semibold text-gray-900 mb-4">Live Mini Map</h3>
              <div className="relative bg-gray-50 rounded-lg p-4 h-[300px] border-2 border-dashed border-gray-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-[#233E7D] mx-auto mb-2 animate-pulse" />
                    <p className="text-sm font-medium text-gray-900">Current Location: Kitchen</p>
                    <p className="text-xs text-gray-500 mt-1">Last updated: Just now</p>
                  </div>
                </div>
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
                <div className="absolute top-8 right-8 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">Movement History</h2>
          </div>
          <div className="space-y-6">
            {filteredMovement.map((day) => (
              <div key={day.date}>
                <h3 className="font-semibold text-gray-900 mb-3">{format(new Date(day.date), "MMMM dd, yyyy")}</h3>
                <div className="space-y-2">
                  {day.movements.map((movement, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 min-w-[60px]">
                        {movement.time}
                      </div>
                      <div className="flex items-center gap-2 flex-1">
                        <MapPin className="h-4 w-4 text-[#233E7D] shrink-0" />
                        <span className="text-sm text-gray-900">{movement.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

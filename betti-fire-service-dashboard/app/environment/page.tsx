"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download } from "lucide-react"
import { format } from "date-fns"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export default function EnvironmentPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()
  const [liveData, setLiveData] = useState({
    temperature: 75,
    airQuality: 52,
    smokeDensity: 8,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData({
        temperature: 70 + Math.floor(Math.random() * 10),
        airQuality: 40 + Math.floor(Math.random() * 20),
        smokeDensity: Math.floor(Math.random() * 15),
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const historicalData = [
    { date: "2024-01-10", avgTemp: 72, avgAQI: 45, avgSmoke: 0 },
    { date: "2024-01-09", avgTemp: 71, avgAQI: 42, avgSmoke: 0 },
    { date: "2024-01-08", avgTemp: 73, avgAQI: 48, avgSmoke: 0 },
    { date: "2024-01-06", avgTemp: 70, avgAQI: 40, avgSmoke: 0 },
    { date: "2024-01-05", avgTemp: 72, avgAQI: 44, avgSmoke: 0 },
  ]

  const filteredData = historicalData.filter((record) => {
    if (!date) return true
    const recordDate = new Date(record.date)
    return (
      recordDate.getDate() === date.getDate() &&
      recordDate.getMonth() === date.getMonth() &&
      recordDate.getFullYear() === date.getFullYear()
    )
  })

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your environmental data is being exported...",
    })
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your data has been downloaded successfully.",
      })
    }, 1500)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Environment Monitoring</h1>
            <p className="text-muted-foreground mt-1">Real-time and historical environmental data</p>
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

        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Live Monitoring</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6 transition-all hover:shadow-lg hover:scale-105 duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Temperature</h3>
                <span className="text-2xl font-bold text-foreground transition-all duration-300">
                  {liveData.temperature}°F
                </span>
              </div>
              <Progress value={(liveData.temperature / 100) * 100} className="h-2 transition-all duration-300" />
              <p className="text-xs text-muted-foreground mt-2">Normal range: 68-78°F</p>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg hover:scale-105 duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Air Quality Index</h3>
                <span className="text-2xl font-bold text-foreground transition-all duration-300">
                  {liveData.airQuality}
                </span>
              </div>
              <Progress value={(liveData.airQuality / 100) * 100} className="h-2 transition-all duration-300" />
              <p className="text-xs text-muted-foreground mt-2">
                {liveData.airQuality <= 50 ? "Good" : liveData.airQuality <= 100 ? "Moderate" : "Unhealthy"}
              </p>
            </Card>

            <Card className="p-6 transition-all hover:shadow-lg hover:scale-105 duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Smoke Density</h3>
                <span className="text-2xl font-bold text-foreground transition-all duration-300">
                  {liveData.smokeDensity}%
                </span>
              </div>
              <Progress value={liveData.smokeDensity} className="h-2 transition-all duration-300" />
              <p className="text-xs text-muted-foreground mt-2">
                {liveData.smokeDensity < 5 ? "Clear" : liveData.smokeDensity < 10 ? "Warning" : "Critical"}
              </p>
            </Card>
          </div>
        </div>

        <Card className="p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="font-serif text-xl font-semibold text-foreground">Historical Data</h2>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-foreground">Date</th>
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-foreground">Avg Temp (°F)</th>
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-foreground">Avg AQI</th>
                  <th className="text-left py-3 px-2 md:px-4 font-semibold text-foreground">Avg Smoke</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((record) => (
                  <tr key={record.date} className="border-b hover:bg-accent/50">
                    <td className="py-3 px-2 md:px-4">{format(new Date(record.date), "MMM dd, yyyy")}</td>
                    <td className="py-3 px-2 md:px-4">{record.avgTemp}°F</td>
                    <td className="py-3 px-2 md:px-4">
                      <span
                        className={record.avgAQI <= 50 ? "text-green-600 font-medium" : "text-amber-600 font-medium"}
                      >
                        {record.avgAQI}
                      </span>
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      <span
                        className={record.avgSmoke === 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}
                      >
                        {record.avgSmoke}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
    </div>
  )
}

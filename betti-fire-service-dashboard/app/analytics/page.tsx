"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, FileText } from "lucide-react"
import { format } from "date-fns"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

export default function AnalyticsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { toast } = useToast()

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting analytics as ${format}...`,
    })
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your analytics have been downloaded as ${format}.`,
      })
    }, 1500)
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-1">Comprehensive insights and reports</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="bg-primary w-full sm:w-auto">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport("PDF")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("XLSX")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export as XLSX
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4 md:p-6 transition-all hover:shadow-lg hover:scale-105 duration-300 animate-in fade-in slide-in-from-top-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Incidents</h3>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">24</p>
            <p className="text-sm text-green-600 mt-1">↓ 12% from last month</p>
          </Card>
          <Card className="p-4 md:p-6 transition-all hover:shadow-lg hover:scale-105 duration-300 animate-in fade-in slide-in-from-top-4 delay-100">
            <h3 className="text-sm font-medium text-muted-foreground">Avg Response Time</h3>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">2.3 min</p>
            <p className="text-sm text-green-600 mt-1">↓ 0.5 min improvement</p>
          </Card>
          <Card className="p-4 md:p-6 transition-all hover:shadow-lg hover:scale-105 duration-300 animate-in fade-in slide-in-from-top-4 delay-200">
            <h3 className="text-sm font-medium text-muted-foreground">Active Alerts</h3>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">1</p>
            <p className="text-sm text-red-600 mt-1">Requires attention</p>
          </Card>
          <Card className="p-4 md:p-6 transition-all hover:shadow-lg hover:scale-105 duration-300 animate-in fade-in slide-in-from-top-4 delay-300">
            <h3 className="text-sm font-medium text-muted-foreground">System Uptime</h3>
            <p className="text-2xl md:text-3xl font-bold text-foreground mt-2">99.8%</p>
            <p className="text-sm text-green-600 mt-1">Excellent performance</p>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-4 md:p-6 transition-all hover:shadow-lg duration-300 animate-in fade-in slide-in-from-left-4 delay-400">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Incident Types Distribution</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Fire</span>
                  <span className="text-sm text-muted-foreground">8 (33%)</span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full" style={{ width: "33%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Fall</span>
                  <span className="text-sm text-muted-foreground">6 (25%)</span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: "25%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Medical</span>
                  <span className="text-sm text-muted-foreground">7 (29%)</span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "29%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Panic</span>
                  <span className="text-sm text-muted-foreground">3 (13%)</span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "13%" }} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 transition-all hover:shadow-lg duration-300 animate-in fade-in slide-in-from-right-4 delay-400">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Environmental Trends</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Temperature</span>
                  <span className="text-sm text-green-600">Stable</span>
                </div>
                <p className="text-xs text-muted-foreground">Avg: 72°F | Range: 68-75°F</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Air Quality</span>
                  <span className="text-sm text-green-600">Good</span>
                </div>
                <p className="text-xs text-muted-foreground">Avg AQI: 44 | Range: 38-52</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Smoke Detection</span>
                  <span className="text-sm text-red-600">1 Alert</span>
                </div>
                <p className="text-xs text-muted-foreground">Last detected: Today at 2:23 PM</p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4 md:p-6 transition-all hover:shadow-lg duration-300 animate-in fade-in slide-in-from-bottom-4 delay-500">
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Activity Patterns</h3>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-accent/20 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Most Active Time</p>
                <p className="text-sm text-muted-foreground">10:00 AM - 2:00 PM</p>
              </div>
              <span className="text-2xl font-bold text-primary">45%</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-accent/20 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Most Visited Room</p>
                <p className="text-sm text-muted-foreground">Kitchen</p>
              </div>
              <span className="text-2xl font-bold text-primary">38%</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-accent/20 rounded-lg">
              <div>
                <p className="font-medium text-foreground">Avg Daily Movement</p>
                <p className="text-sm text-muted-foreground">Between rooms</p>
              </div>
              <span className="text-2xl font-bold text-primary">24</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </div>
  )
}

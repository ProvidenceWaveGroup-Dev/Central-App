"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

const reports = [
  {
    id: 1,
    title: "Daily Activity Summary",
    date: "2024-01-10",
    type: "Daily Report",
    status: "Generated",
    description: "Complete summary of resident activities, incidents, and environment metrics for January 10, 2024",
  },
  {
    id: 2,
    title: "Weekly Incident Analysis",
    date: "2024-01-08",
    type: "Weekly Report",
    status: "Generated",
    description: "Analysis of all incidents and alerts from January 1-7, 2024",
  },
  {
    id: 3,
    title: "Monthly Health Trends",
    date: "2024-01-01",
    type: "Monthly Report",
    status: "Generated",
    description: "Comprehensive health and activity trends for December 2023",
  },
  {
    id: 4,
    title: "Caregiver Response Times",
    date: "2024-01-08",
    type: "Performance Report",
    status: "Generated",
    description: "Analysis of caregiver response times and effectiveness",
  },
  {
    id: 5,
    title: "Device Health Report",
    date: "2024-01-10",
    type: "Technical Report",
    status: "Generated",
    description: "Battery levels, connectivity status, and device performance metrics",
  },
]

export default function ReportsPage() {
  const { toast } = useToast()

  const handleDownload = (reportTitle: string) => {
    toast({
      title: "Downloading Report",
      description: `${reportTitle} is being downloaded...`,
    })
  }

  const handleGenerateReport = () => {
    toast({
      title: "Generating Report",
      description: "Your new report is being generated. This may take a few moments.",
    })
  }

  return (
    <div className="p-4 md:p-6 lg:p-8"><div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">Generated reports and analytics</p>
          </div>
          <Button onClick={handleGenerateReport} className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
            <FileText className="mr-2 h-4 w-4" />
            Generate New Report
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-lg sm:text-xl">
              <FileText className="h-5 w-5 text-primary" />
              Available Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 rounded-lg border p-4"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-sm sm:text-base">{report.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {report.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm">{report.description}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Generated on {report.date}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownload(report.title)}
                    className="w-full sm:w-auto bg-transparent"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div></div>
  )
}

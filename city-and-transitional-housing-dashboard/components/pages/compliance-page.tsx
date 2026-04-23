"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Download, FileText } from "lucide-react"

export function CompliancePage() {
  const complianceReports = [
    {
      id: 1,
      title: "City Housing Program Compliance",
      description: "City and Transitional Housing program requirements",
      progress: 92,
      lastUpdated: "2024-10-20",
      status: "On Track",
    },
    {
      id: 2,
      title: "Health & Safety Standards",
      description: "Building code and safety compliance",
      progress: 85,
      lastUpdated: "2024-10-18",
      status: "On Track",
    },
    {
      id: 3,
      title: "Environmental Compliance",
      description: "Energy efficiency and sustainability standards",
      progress: 78,
      lastUpdated: "2024-10-15",
      status: "Needs Attention",
    },
    {
      id: 4,
      title: "Accessibility Standards",
      description: "ADA and accessibility requirements",
      progress: 88,
      lastUpdated: "2024-10-22",
      status: "On Track",
    },
    {
      id: 5,
      title: "Financial Reporting",
      description: "Grant and funding compliance",
      progress: 95,
      lastUpdated: "2024-10-23",
      status: "On Track",
    },
  ]

  const getStatusColor = (status: string) => {
    return status === "On Track" ? "text-green-600" : "text-orange-600"
  }

  const handleExportAll = () => {
    alert("Exporting all reports as PDF...")
  }

  const handleExportPDF = () => {
    alert("Exporting reports as PDF...")
  }

  const handleExportCSV = () => {
    alert("Exporting reports as CSV...")
  }

  const handleViewReport = (reportId: number) => {
    alert(`View report ${reportId}`)
  }

  const handleExport = (reportId: number) => {
    alert(`Export report ${reportId}`)
  }

  return (
    <main className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Compliance, Health & Safety</h1>
        <p className="text-muted-foreground">Reports and compliance tracking with export options</p>
      </div>

      {/* Export options */}
      <div className="flex flex-wrap gap-2">
        <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2" onClick={handleExportAll}>
          <Download className="w-4 h-4" />
          Export All Reports
        </Button>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={handleExportPDF}>
          <Download className="w-4 h-4" />
          Export as PDF
        </Button>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent" onClick={handleExportCSV}>
          <Download className="w-4 h-4" />
          Export as CSV
        </Button>
      </div>

      {/* Compliance reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {complianceReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    {report.title}
                  </CardTitle>
                  <CardDescription>{report.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Compliance Status</span>
                  <span className={`text-sm font-semibold ${getStatusColor(report.status)}`}>{report.status}</span>
                </div>
                <Progress value={report.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{report.progress}% Complete</p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Last Updated: {report.lastUpdated}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => handleViewReport(report.id)}
                  >
                    View Report
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1 bg-transparent"
                    onClick={() => handleExport(report.id)}
                  >
                    <Download className="w-3 h-3" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}

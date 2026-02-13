"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportToPDF, exportToXLSX, type ExportData } from "@/lib/export-utils"

interface LogEntry {
  timestamp: string
  value: string
  status?: string
  notes?: string
}

interface HealthMetricModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  logs: LogEntry[]
  headers: string[]
}

export function HealthMetricModal({ isOpen, onClose, title, logs, headers }: HealthMetricModalProps) {
  const [exportFormat, setExportFormat] = useState<"pdf" | "xlsx">("pdf")

  const handleExport = () => {
    const exportData: ExportData = {
      title: title,
      headers: headers,
      rows: logs.map((log) => [log.timestamp, log.value, log.status || "", log.notes || ""]),
      metadata: {
        patientName: "Margaret Chen",
        dateRange: "Last 30 Days",
        generatedAt: new Date().toLocaleString(),
      },
    }

    if (exportFormat === "pdf") {
      exportToPDF(exportData)
    } else {
      exportToXLSX(exportData)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{title}</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 mb-4">
          <Select value={exportFormat} onValueChange={(value: "pdf" | "xlsx") => setExportFormat(value)}>
            <SelectTrigger className="w-32 bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="xlsx">XLSX</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="h-4 w-4" />
            Export {exportFormat.toUpperCase()}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto border border-border rounded-lg">
          <table className="w-full">
            <thead className="bg-primary text-white sticky top-0">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className="px-4 py-3 text-left text-sm font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 text-sm">{log.timestamp}</td>
                  <td className="px-4 py-3 text-sm font-medium">{log.value}</td>
                  {log.status && <td className="px-4 py-3 text-sm">{log.status}</td>}
                  {log.notes && <td className="px-4 py-3 text-sm text-muted-foreground">{log.notes}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}

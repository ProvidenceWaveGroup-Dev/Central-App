import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

export interface ExportData {
  title: string
  headers: string[]
  rows: (string | number)[][]
  metadata?: {
    patientName?: string
    dateRange?: string
    generatedAt?: string
  }
}

export function exportToPDF(data: ExportData) {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(data.title, 14, 20)

  // Add metadata if provided
  let yPosition = 30
  if (data.metadata) {
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    if (data.metadata.patientName) {
      doc.text(`Patient: ${data.metadata.patientName}`, 14, yPosition)
      yPosition += 6
    }
    if (data.metadata.dateRange) {
      doc.text(`Period: ${data.metadata.dateRange}`, 14, yPosition)
      yPosition += 6
    }
    if (data.metadata.generatedAt) {
      doc.text(`Generated: ${data.metadata.generatedAt}`, 14, yPosition)
      yPosition += 10
    }
  }

  // Add table
  autoTable(doc, {
    head: [data.headers],
    body: data.rows,
    startY: yPosition,
    theme: "grid",
    headStyles: {
      fillColor: [92, 127, 57], // Primary color #5C7F39
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
  })

  // Save the PDF
  const fileName = `${data.title.replace(/\s+/g, "_")}_${new Date().getTime()}.pdf`
  doc.save(fileName)
}

export function exportToXLSX(data: ExportData) {
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new()

  // Add metadata rows if provided
  const wsData: any[][] = []

  if (data.metadata) {
    wsData.push([data.title])
    wsData.push([]) // Empty row
    if (data.metadata.patientName) {
      wsData.push(["Patient:", data.metadata.patientName])
    }
    if (data.metadata.dateRange) {
      wsData.push(["Period:", data.metadata.dateRange])
    }
    if (data.metadata.generatedAt) {
      wsData.push(["Generated:", data.metadata.generatedAt])
    }
    wsData.push([]) // Empty row
  }

  // Add headers and data
  wsData.push(data.headers)
  wsData.push(...data.rows)

  const ws = XLSX.utils.aoa_to_sheet(wsData)

  // Set column widths
  const colWidths = data.headers.map(() => ({ wch: 20 }))
  ws["!cols"] = colWidths

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Report")

  // Save the file
  const fileName = `${data.title.replace(/\s+/g, "_")}_${new Date().getTime()}.xlsx`
  XLSX.writeFile(wb, fileName)
}

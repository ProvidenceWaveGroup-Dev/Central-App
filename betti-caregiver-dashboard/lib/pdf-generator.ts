import jsPDF from "jspdf"
import { format, differenceInDays } from "date-fns"

interface PatientData {
  name: string
  caregiverName: string
  reportType: "daily" | "weekly" | "monthly" | "custom"
  startDate?: Date
  endDate?: Date
}

interface HealthMetrics {
  mobility: string
  hydration: string
  sleepQuality: string
  medicationAdherence: string
}

interface VitalSigns {
  heartRate: string
  bloodPressure: string
  temperature: string
  oxygenLevel: string
}

export function generateHealthReport(
  patientData: PatientData,
  healthMetrics: HealthMetrics,
  vitalSigns: VitalSigns,
  activities: string[],
  alerts: string[],
) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let yPosition = 20

  // Header with Betti branding
  const logoWidth = 25
  const logoHeight = 25
  const logoX = 20
  const logoY = 10

  // White background for logo
  doc.setFillColor(255, 255, 255)
  doc.rect(logoX - 2, logoY - 2, logoWidth + 4, logoHeight + 4, "F")

  // Add logo image
  try {
    doc.addImage("/betti-logo.png", "PNG", logoX, logoY, logoWidth, logoHeight)
  } catch (error) {
    console.log("[v0] Logo image not loaded, using text fallback")
    // Fallback to text if image fails
    doc.setFillColor(92, 127, 57)
    doc.rect(0, 0, pageWidth, 30, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text("BETTI", 20, 20)
  }

  // Header text next to logo
  doc.setTextColor(92, 127, 57)
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("BETTI", logoX + logoWidth + 5, logoY + 12)

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  doc.text("Caregiver Dashboard", logoX + logoWidth + 5, logoY + 18)

  yPosition = 50
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")

  let reportTitle = `${patientData.reportType.charAt(0).toUpperCase() + patientData.reportType.slice(1)} Health Report`
  if (patientData.reportType === "custom" && patientData.startDate && patientData.endDate) {
    const days = differenceInDays(patientData.endDate, patientData.startDate)
    reportTitle = `Custom Health Report (${days} days)`
  }
  doc.text(reportTitle, 20, yPosition)

  yPosition += 10
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Generated: ${format(new Date(), "PPpp")}`, 20, yPosition)

  yPosition += 6
  doc.text(`Caregiver: ${patientData.caregiverName}`, 20, yPosition)

  yPosition += 6
  doc.text(`Patient: ${patientData.name}`, 20, yPosition)

  if (patientData.reportType === "custom" && patientData.startDate && patientData.endDate) {
    yPosition += 6
    doc.text(
      `Period: ${format(patientData.startDate, "MMM d, yyyy")} - ${format(patientData.endDate, "MMM d, yyyy")}`,
      20,
      yPosition,
    )
  }

  // Divider line
  yPosition += 8
  doc.setDrawColor(218, 218, 218)
  doc.line(20, yPosition, pageWidth - 20, yPosition)

  // Vital Signs Section
  yPosition += 10
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(35, 62, 125) // Secondary color #233E7D
  doc.text("Vital Signs", 20, yPosition)

  yPosition += 8
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(0, 0, 0)
  doc.text(`Heart Rate: ${vitalSigns.heartRate}`, 25, yPosition)

  yPosition += 6
  doc.text(`Blood Pressure: ${vitalSigns.bloodPressure}`, 25, yPosition)

  yPosition += 6
  doc.text(`Temperature: ${vitalSigns.temperature}`, 25, yPosition)

  yPosition += 6
  doc.text(`Oxygen Level: ${vitalSigns.oxygenLevel}`, 25, yPosition)

  // Health Metrics Section
  yPosition += 12
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(35, 62, 125)
  doc.text("Health Metrics", 20, yPosition)

  yPosition += 8
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(0, 0, 0)
  doc.text(`Mobility: ${healthMetrics.mobility}`, 25, yPosition)

  yPosition += 6
  doc.text(`Hydration: ${healthMetrics.hydration}`, 25, yPosition)

  yPosition += 6
  doc.text(`Sleep Quality: ${healthMetrics.sleepQuality}`, 25, yPosition)

  yPosition += 6
  doc.text(`Medication Adherence: ${healthMetrics.medicationAdherence}`, 25, yPosition)

  // Recent Activities Section
  yPosition += 12
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(35, 62, 125)
  doc.text("Recent Activities", 20, yPosition)

  yPosition += 8
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(0, 0, 0)
  activities.slice(0, 5).forEach((activity) => {
    doc.text(`• ${activity}`, 25, yPosition)
    yPosition += 6
  })

  // Alerts Section
  if (alerts.length > 0) {
    yPosition += 8
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(35, 62, 125)
    doc.text("Active Alerts", 20, yPosition)

    yPosition += 8
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    alerts.forEach((alert) => {
      doc.text(`• ${alert}`, 25, yPosition)
      yPosition += 6
    })
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text("This report is confidential and intended for authorized caregivers only.", pageWidth / 2, footerY, {
    align: "center",
  })

  // Save the PDF
  const fileName = `betti-health-report-${patientData.reportType}-${format(new Date(), "yyyy-MM-dd")}.pdf`
  doc.save(fileName)
}

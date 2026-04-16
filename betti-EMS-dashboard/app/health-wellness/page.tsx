import { AllergyBanner } from "@/components/allergy-banner"
import { HealthSnapshot } from "@/components/health-snapshot"
import { VitalsMicroTiles } from "@/components/vitals-micro-tiles"
import { MetricsGrid } from "@/components/metrics-grid"
import { MedicationAcknowledgment } from "@/components/medication-acknowledgment"

export default function HealthWellnessPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <AllergyBanner />

      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Resident Status</h1>
          <p className="text-sm text-gray-500 mt-1">Observed vitals, alerts, and care activity for assigned residents</p>
        </div>

        <div className="space-y-6">
          <HealthSnapshot />
          <VitalsMicroTiles />
          <MedicationAcknowledgment />
          <MetricsGrid />
        </div>
      </div>
    </div>
  )
}

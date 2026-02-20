import { DashboardHeader } from "@/components/dashboard-header";
import { AllergyBanner } from "@/components/allergy-banner";
import { HealthSnapshot } from "@/components/health-snapshot";
import { VitalsMicroTiles } from "@/components/vitals-micro-tiles";
import { EventFeed } from "@/components/event-feed";
import { OccupancyCard } from "@/components/occupancy-card";
import { MetricsGrid } from "@/components/metrics-grid";
import { MedicationAcknowledgment } from "@/components/medication-acknowledgment";
import { MentalHealthCard } from "@/components/mental-health-card";
import { FallAlertCard } from "@/components/fall-alert-card";
import { EmergencyRoomLayout } from "@/components/emergency-room-layout";
import { EnvironmentCard } from "@/components/environment-card";
import { CO2MonitoringCard } from "@/components/co2-monitoring-card";
import { VOCHazardCard } from "@/components/voc-hazard-card";
import { ThermalRiskCard } from "@/components/thermal-risk-card";
import { HumidityRiskCard } from "@/components/humidity-risk-card";
export default function BettiDashboard() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Allergy Banner - Always visible */}
      <AllergyBanner />

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Section */}
        <DashboardHeader />

        {/* Fall Emergency Response - Priority placement for EMS */}
        <FallAlertCard />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <HealthSnapshot />
            <VitalsMicroTiles />

            <div className="grid gap-6 md:grid-cols-2">
              <MedicationAcknowledgment />
              <MetricsGrid />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <OccupancyCard />
              <MentalHealthCard />
            </div>

            {/* Emergency Room Layout Mapping - just before Environmental monitoring */}
            <EmergencyRoomLayout />

            <EnvironmentCard />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <CO2MonitoringCard />
              <VOCHazardCard />
              <ThermalRiskCard />
              <HumidityRiskCard />
            </div>
          </div>
        </div>
        <EventFeed />
      </div>
    </div>
  );
}

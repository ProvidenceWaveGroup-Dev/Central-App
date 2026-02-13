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
import { EnvironmentCard } from "@/components/environment-card";
import { PageLoaderWrapper } from "@/components/page-loader-wrapper";

export default function BettiDashboard() {
  return (
    <PageLoaderWrapper>
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

            <EnvironmentCard />
          </div>
        </div>
        <EventFeed />
      </div>
    </div>
    </PageLoaderWrapper>
  );
}

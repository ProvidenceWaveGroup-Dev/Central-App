import { IncidentHeader } from "@/components/incident-header"
import { EnvironmentCard } from "@/components/environment-card"
import { CO2MonitoringCard } from "@/components/co2-monitoring-card"
import { VOCHazardCard } from "@/components/voc-hazard-card"
import { ThermalRiskCard } from "@/components/thermal-risk-card"
import { NotificationBellWidget } from "@/components/notification-bell-widget"
import { HumidityRiskCard } from "@/components/humidity-risk-card"
import { OccupancyCard } from "@/components/occupancy-card"
import { RouteCard } from "@/components/route-card"
import { DeviceStatusBar } from "@/components/device-status-bar"
import { MetricsGrid } from "@/components/metrics-grid"
import { CaregiverCard } from "@/components/caregiver-card"
import { MentalHealthCheck } from "@/components/mental-health-check"

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex-1 min-w-0">
            <IncidentHeader />
          </div>
          <div className="pt-1 shrink-0">
            <NotificationBellWidget alertsHref="/incidents" />
          </div>
        </div>

        {/* Caregiver tab */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 delay-100">
          <CaregiverCard />
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 animate-in fade-in slide-in-from-top-4 duration-500 delay-200">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 lg:col-span-2">
            <EnvironmentCard />
            <OccupancyCard />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 animate-in fade-in slide-in-from-top-4 duration-500 delay-250">
          <CO2MonitoringCard />
          <VOCHazardCard />
          <ThermalRiskCard />
          <HumidityRiskCard />
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 animate-in fade-in slide-in-from-top-4 duration-500 delay-300">
          <RouteCard />
          <DeviceStatusBar />
          <MentalHealthCheck />
        </div>

        <div className="animate-in fade-in slide-in-from-top-4 duration-500 delay-400">
          <MetricsGrid />
        </div>
      </div>
    </div>
    </div>
  );
}

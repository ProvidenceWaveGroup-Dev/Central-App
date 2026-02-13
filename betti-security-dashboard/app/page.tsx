import { IncidentHeader } from "@/components/incident-header"
import { LocationTrail } from "@/components/location-trail"
import { CareStatusBar } from "@/components/care-status-bar"
import { DistressDetection } from "@/components/distress-detection"
import { RoutineOverview } from "@/components/routine-overview"
import { IncidentTypeCard } from "@/components/incident-type-card"
import { CheckInResponsiveness } from "@/components/check-in-responsiveness"
import { ActivityTimeline } from "@/components/activity-timeline"
import { IntoxicationDetection } from "@/components/intoxication-detection"
import { EntryRouteRecommendation } from "@/components/entry-route-recommendation"
import { DeviceHealth } from "@/components/device-health"
import { MentalHealthCheck } from "@/components/mental-health-check"
import { EnvironmentCard } from "@/components/environment-card"

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8"><div className="mx-auto max-w-7xl">
      <div className="space-y-6">
        {/* Critical Alert Section */}
        <IncidentHeader />

        {/* Primary Monitoring Grid */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          <LocationTrail />
          <CareStatusBar />
          <IncidentTypeCard />
        </div>

        {/* Activity & Detection Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ActivityTimeline />
          <CheckInResponsiveness />
          <DeviceHealth />
          <MentalHealthCheck />
        </div>

        {/* AI Detection & Analysis */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DistressDetection />
          <IntoxicationDetection />
          <EntryRouteRecommendation />
        </div>

        {/* Environmental Health */}
        <EnvironmentCard />

        {/* Daily Summary */}
        <RoutineOverview />
      </div>
    </div></div>
  )
}

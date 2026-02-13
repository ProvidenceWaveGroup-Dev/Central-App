import { AlertTriangle } from "lucide-react"

export function AllergyBanner() {
  return (
    <div className="bg-destructive/10 border-b-2 border-destructive">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <div className="flex items-center gap-6">
              <span className="font-semibold text-destructive">
                ALLERGIES: Penicillin (Severe), Sulfa Drugs (Moderate)
              </span>
              <span className="text-sm text-muted-foreground">Last check-in: 10 mins ago</span>
            </div>
          </div>
          <div className="text-sm font-medium text-destructive">Anaphylaxis Risk - EpiPen Available</div>
        </div>
      </div>
    </div>
  )
}

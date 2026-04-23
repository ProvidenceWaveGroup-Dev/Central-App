"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

const grants = [
  {
    id: 1,
    name: "City Housing Program",
    funded: 1200,
    completed: 1050,
    budget: "$2.4M",
    status: "On Track",
  },
  {
    id: 2,
    name: "Pathways Initiative",
    funded: 450,
    completed: 380,
    budget: "$1.8M",
    status: "On Track",
  },
  {
    id: 3,
    name: "PPP Housing",
    funded: 320,
    completed: 245,
    budget: "$950K",
    status: "Review",
  },
]

export function GrantCompliance() {
  return (
    <Card className="border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg font-serif">Grant Compliance</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {grants.map((grant) => {
          const percentage = (grant.completed / grant.funded) * 100
          return (
            <div key={grant.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-foreground">{grant.name}</p>
                  <p className="text-xs text-muted-foreground">Budget: {grant.budget}</p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    grant.status === "On Track" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {grant.status}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {grant.completed} / {grant.funded} units
                </span>
                <span>{Math.round(percentage)}%</span>
              </div>
            </div>
          )
        })}
        <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </CardContent>
    </Card>
  )
}

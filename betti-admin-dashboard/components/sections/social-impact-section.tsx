"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Users,
  Home,
  Heart,
  BarChart3,
  ArrowUpRight,
  Clock,
} from "lucide-react";

type ImpactMetric = {
  label: string;
  value: string;
  sub: string;
  trend: string;
  positive: boolean;
};

const metrics: ImpactMetric[] = [
  { label: "Residents Supported",        value: "142",    sub: "across 4 facilities",               trend: "+8 this quarter",  positive: true  },
  { label: "Transitional Placements",    value: "34",     sub: "successfully housed YTD",           trend: "+12 vs last year", positive: true  },
  { label: "Avg. Placement Duration",    value: "47 days", sub: "median transitional stay",         trend: "-5 days vs Q3",    positive: true  },
  { label: "Event Response Time",        value: "4.2 min", sub: "avg. time to first response",      trend: "-0.8 min vs Q3",   positive: true  },
  { label: "Incident-Free Days",         value: "18",     sub: "consecutive days, all facilities",  trend: "Longest streak",   positive: true  },
  { label: "Family Satisfaction Score",  value: "4.6/5",  sub: "from last quarterly survey",        trend: "+0.3 vs Q3",       positive: true  },
];

type ProgramRow = {
  program: string;
  residents: number;
  capacity: number;
  successRate: number;
};

const programs: ProgramRow[] = [
  { program: "Long-Term Care",        residents: 88,  capacity: 100, successRate: 97 },
  { program: "Assisted Living",       residents: 32,  capacity: 40,  successRate: 94 },
  { program: "Transitional Housing",  residents: 14,  capacity: 20,  successRate: 82 },
  { program: "Memory Care Support",   residents: 8,   capacity: 12,  successRate: 91 },
];

type OutcomeRow = {
  outcome: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
};

const outcomes: OutcomeRow[] = [
  { outcome: "Permanent placements secured",  q1: "6",  q2: "9",  q3: "11", q4: "8" },
  { outcome: "Early intervention alerts",     q1: "23", q2: "31", q3: "28", q4: "19" },
  { outcome: "Falls with no injury",          q1: "4",  q2: "3",  q3: "2",  q4: "1" },
  { outcome: "Family engagement sessions",    q1: "41", q2: "55", q3: "62", q4: "37" },
  { outcome: "Resident-initiated requests",   q1: "18", q2: "24", q3: "29", q4: "21" },
];

export function SocialImpactSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-muted-foreground" />
        <div>
          <h2 className="text-2xl font-bold">Social Impact</h2>
          <p className="text-sm text-muted-foreground">Outcome indicators, housing program performance, and resident well-being trends across the platform.</p>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
                </div>
                <span className={`inline-flex items-center gap-0.5 text-xs font-semibold rounded-full px-2 py-0.5 ${m.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  <ArrowUpRight className="h-3 w-3" />
                  {m.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Program Capacity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Home className="h-4 w-4" />
            Program Capacity &amp; Occupancy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {programs.map((p) => {
            const pct = Math.round((p.residents / p.capacity) * 100);
            return (
              <div key={p.program}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium">{p.program}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {p.residents}/{p.capacity}
                    </span>
                    <Badge variant="outline" className={`text-xs ${p.successRate >= 90 ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                      {p.successRate}% outcomes
                    </Badge>
                  </div>
                </div>
                <Progress value={pct} className="h-2" />
                <p className="text-xs text-muted-foreground mt-0.5">{pct}% capacity</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quarterly Outcomes Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-4 w-4" />
            Quarterly Outcome Tracking — 2025/2026
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-muted/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-2">Outcome</div>
            <div className="text-center">Q1</div>
            <div className="text-center">Q2</div>
            <div className="text-center">Q3</div>
          </div>
          {outcomes.map((o) => (
            <div key={o.outcome} className="grid grid-cols-5 gap-2 px-4 py-3 border-b last:border-0 items-center hover:bg-muted/30 transition-colors">
              <div className="col-span-2 text-sm">{o.outcome}</div>
              <div className="text-center text-sm font-medium">{o.q1}</div>
              <div className="text-center text-sm font-medium">{o.q2}</div>
              <div className="text-center text-sm font-medium">{o.q3}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Note */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="flex items-start gap-3 pt-4">
          <Heart className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800">Impact Reporting</p>
            <p className="text-xs text-blue-700 mt-0.5">
              Social impact data reflects observed system events and program outcomes. These figures inform operational decisions and partner reporting — they do not constitute clinical assessments.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Last updated note */}
      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
        <Clock className="h-3 w-3" />
        Data refreshed quarterly. Current period: Q4 2025 / Q1 2026.
      </p>
    </div>
  );
}

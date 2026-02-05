"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  Brain,
  Zap,
  Settings,
  Plus,
  Activity,
  Clock,
  CheckCircle,
  Search,
} from "lucide-react";

// Schema-aligned: ai_inferences table
interface AIInference {
  inference_id: number;
  patient_id: number;
  patient_name: string;
  model_version: string;
  output: string;
  confidence: number;
  created_at: string;
  alert_generated: boolean;
}

// Schema-aligned: rule_definitions, conditions, actions
interface RuleDefinition {
  rule_id: number;
  name: string;
  description: string;
  is_active: boolean;
  conditions: { condition_type: string; threshold: string; operator: string }[];
  actions: { action_type: string; target: string }[];
  triggered_count: number;
  last_triggered: string | null;
}

const aiInferences: AIInference[] = [
  {
    inference_id: 8821,
    patient_id: 501,
    patient_name: "Margaret Johnson",
    model_version: "betti-fall-v2.3",
    output: "Fall likely, bathroom context",
    confidence: 0.91,
    created_at: "2026-02-01T06:47:30Z",
    alert_generated: true
  },
  {
    inference_id: 8818,
    patient_id: 503,
    patient_name: "Helen Davis",
    model_version: "betti-activity-v1.8",
    output: "Unusual inactivity pattern detected",
    confidence: 0.85,
    created_at: "2026-02-01T06:15:00Z",
    alert_generated: true
  },
  {
    inference_id: 8815,
    patient_id: 502,
    patient_name: "Robert Smith",
    model_version: "betti-vital-v2.1",
    output: "Heart rate elevated but within safe range",
    confidence: 0.78,
    created_at: "2026-02-01T05:45:00Z",
    alert_generated: false
  },
  {
    inference_id: 8812,
    patient_id: 505,
    patient_name: "Patricia Brown",
    model_version: "betti-sleep-v1.5",
    output: "Sleep quality below baseline, monitor",
    confidence: 0.72,
    created_at: "2026-02-01T04:30:00Z",
    alert_generated: false
  },
  // Additional inferences
  {
    inference_id: 8809,
    patient_id: 507,
    patient_name: "Dorothy Miller",
    model_version: "betti-vital-v2.1",
    output: "Blood pressure spike detected, moderate risk",
    confidence: 0.88,
    created_at: "2026-02-01T04:00:00Z",
    alert_generated: true
  },
  {
    inference_id: 8806,
    patient_id: 508,
    patient_name: "Charles Moore",
    model_version: "betti-activity-v1.8",
    output: "Normal activity patterns observed",
    confidence: 0.65,
    created_at: "2026-02-01T03:45:00Z",
    alert_generated: false
  },
  {
    inference_id: 8803,
    patient_id: 509,
    patient_name: "Elizabeth Taylor",
    model_version: "betti-fall-v2.3",
    output: "Gait instability detected during walking",
    confidence: 0.76,
    created_at: "2026-02-01T03:30:00Z",
    alert_generated: false
  },
  {
    inference_id: 8800,
    patient_id: 510,
    patient_name: "Richard Anderson",
    model_version: "betti-vital-v2.1",
    output: "Irregular heartbeat pattern, recommend checkup",
    confidence: 0.92,
    created_at: "2026-02-01T03:15:00Z",
    alert_generated: true
  },
  {
    inference_id: 8797,
    patient_id: 511,
    patient_name: "Susan Jackson",
    model_version: "betti-glucose-v1.2",
    output: "Blood glucose trending lower than baseline",
    confidence: 0.81,
    created_at: "2026-02-01T03:00:00Z",
    alert_generated: false
  },
  {
    inference_id: 8794,
    patient_id: 512,
    patient_name: "Joseph White",
    model_version: "betti-fall-v2.3",
    output: "High fall risk detected, near bed area",
    confidence: 0.94,
    created_at: "2026-02-01T02:45:00Z",
    alert_generated: true
  },
  {
    inference_id: 8791,
    patient_id: 513,
    patient_name: "Nancy Harris",
    model_version: "betti-sleep-v1.5",
    output: "REM sleep disruption, possible discomfort",
    confidence: 0.69,
    created_at: "2026-02-01T02:30:00Z",
    alert_generated: false
  },
  {
    inference_id: 8788,
    patient_id: 514,
    patient_name: "Thomas Martin",
    model_version: "betti-activity-v1.8",
    output: "Movement patterns indicate restlessness",
    confidence: 0.74,
    created_at: "2026-02-01T02:15:00Z",
    alert_generated: false
  },
  {
    inference_id: 8785,
    patient_id: 515,
    patient_name: "Betty Garcia",
    model_version: "betti-vital-v2.1",
    output: "Temperature slightly elevated, monitoring",
    confidence: 0.67,
    created_at: "2026-02-01T02:00:00Z",
    alert_generated: false
  },
  {
    inference_id: 8782,
    patient_id: 504,
    patient_name: "James Williams",
    model_version: "betti-fall-v2.3",
    output: "Stable posture, low fall risk",
    confidence: 0.58,
    created_at: "2026-02-01T01:45:00Z",
    alert_generated: false
  },
  {
    inference_id: 8779,
    patient_id: 506,
    patient_name: "William Jones",
    model_version: "betti-activity-v1.8",
    output: "Extended period of stillness detected",
    confidence: 0.86,
    created_at: "2026-02-01T01:30:00Z",
    alert_generated: true
  },
  {
    inference_id: 8776,
    patient_id: 501,
    patient_name: "Margaret Johnson",
    model_version: "betti-sleep-v1.5",
    output: "Deep sleep phase, vitals stable",
    confidence: 0.82,
    created_at: "2026-02-01T01:15:00Z",
    alert_generated: false
  },
];

const ruleDefinitions: RuleDefinition[] = [
  {
    rule_id: 1,
    name: "Night Inactivity Alert",
    description: "Alert when no movement detected for extended period at night",
    is_active: true,
    conditions: [
      { condition_type: "time_range", threshold: "22:00-06:00", operator: "within" },
      { condition_type: "inactivity_duration", threshold: "45", operator: ">" }
    ],
    actions: [
      { action_type: "create_alert", target: "high_priority" },
      { action_type: "notify", target: "primary_caregiver" }
    ],
    triggered_count: 23,
    last_triggered: "2026-02-01T03:15:00Z"
  },
  {
    rule_id: 2,
    name: "Fall Detection Response",
    description: "Immediate escalation when fall confidence exceeds threshold",
    is_active: true,
    conditions: [
      { condition_type: "model_output", threshold: "fall", operator: "contains" },
      { condition_type: "confidence", threshold: "0.85", operator: ">=" }
    ],
    actions: [
      { action_type: "create_alert", target: "critical" },
      { action_type: "notify", target: "all_assigned" },
      { action_type: "notify", target: "emergency_contact" }
    ],
    triggered_count: 8,
    last_triggered: "2026-02-01T06:47:30Z"
  },
  {
    rule_id: 3,
    name: "Medication Reminder",
    description: "Send reminder when scheduled medication time approaches",
    is_active: true,
    conditions: [
      { condition_type: "medication_schedule", threshold: "15", operator: "minutes_before" }
    ],
    actions: [
      { action_type: "notify", target: "patient_device" },
      { action_type: "notify", target: "primary_caregiver" }
    ],
    triggered_count: 156,
    last_triggered: "2026-02-01T06:45:00Z"
  },
  {
    rule_id: 4,
    name: "Wandering Detection",
    description: "Alert when dementia patient leaves designated area",
    is_active: true,
    conditions: [
      { condition_type: "patient_tag", threshold: "dementia", operator: "has" },
      { condition_type: "zone_exit", threshold: "designated_area", operator: "true" }
    ],
    actions: [
      { action_type: "create_alert", target: "high_priority" },
      { action_type: "notify", target: "all_staff_on_duty" }
    ],
    triggered_count: 5,
    last_triggered: "2026-02-01T02:15:00Z"
  },
  {
    rule_id: 5,
    name: "Low Battery Warning",
    description: "Notify when sensor battery falls below threshold",
    is_active: false,
    conditions: [
      { condition_type: "battery_level", threshold: "20", operator: "<" }
    ],
    actions: [
      { action_type: "notify", target: "facility_admin" }
    ],
    triggered_count: 42,
    last_triggered: "2026-01-30T14:00:00Z"
  },
  // Additional rules
  {
    rule_id: 6,
    name: "Vital Signs Escalation",
    description: "Escalate when multiple vital signs are abnormal simultaneously",
    is_active: true,
    conditions: [
      { condition_type: "vital_abnormal_count", threshold: "2", operator: ">=" },
      { condition_type: "time_window", threshold: "30", operator: "minutes" }
    ],
    actions: [
      { action_type: "create_alert", target: "critical" },
      { action_type: "notify", target: "nursing_station" },
      { action_type: "notify", target: "on_call_physician" }
    ],
    triggered_count: 12,
    last_triggered: "2026-02-01T05:30:00Z"
  },
  {
    rule_id: 7,
    name: "Sleep Disruption Monitor",
    description: "Track and alert on repeated sleep disturbances",
    is_active: true,
    conditions: [
      { condition_type: "sleep_disruption_count", threshold: "3", operator: ">=" },
      { condition_type: "time_window", threshold: "2", operator: "hours" }
    ],
    actions: [
      { action_type: "create_alert", target: "low_priority" },
      { action_type: "log", target: "patient_record" }
    ],
    triggered_count: 34,
    last_triggered: "2026-02-01T04:45:00Z"
  },
  {
    rule_id: 8,
    name: "Bathroom Safety Check",
    description: "Alert if patient is in bathroom for extended period",
    is_active: true,
    conditions: [
      { condition_type: "location", threshold: "bathroom", operator: "equals" },
      { condition_type: "duration", threshold: "20", operator: ">" }
    ],
    actions: [
      { action_type: "create_alert", target: "medium_priority" },
      { action_type: "notify", target: "primary_caregiver" }
    ],
    triggered_count: 18,
    last_triggered: "2026-02-01T06:20:00Z"
  },
  {
    rule_id: 9,
    name: "Device Offline Alert",
    description: "Notify when patient device goes offline unexpectedly",
    is_active: true,
    conditions: [
      { condition_type: "device_status", threshold: "offline", operator: "equals" },
      { condition_type: "offline_duration", threshold: "5", operator: ">" }
    ],
    actions: [
      { action_type: "create_alert", target: "medium_priority" },
      { action_type: "notify", target: "facility_admin" }
    ],
    triggered_count: 7,
    last_triggered: "2026-02-01T01:00:00Z"
  },
  {
    rule_id: 10,
    name: "High Risk Patient Check-in",
    description: "Require periodic check-ins for high-risk patients",
    is_active: true,
    conditions: [
      { condition_type: "risk_score", threshold: "0.8", operator: ">=" },
      { condition_type: "last_check_in", threshold: "60", operator: ">" }
    ],
    actions: [
      { action_type: "create_task", target: "caregiver_checklist" },
      { action_type: "notify", target: "assigned_caregiver" }
    ],
    triggered_count: 89,
    last_triggered: "2026-02-01T06:00:00Z"
  },
  {
    rule_id: 11,
    name: "Temperature Anomaly",
    description: "Alert on sudden temperature changes in patient room",
    is_active: false,
    conditions: [
      { condition_type: "room_temp_change", threshold: "5", operator: ">=" },
      { condition_type: "time_window", threshold: "15", operator: "minutes" }
    ],
    actions: [
      { action_type: "notify", target: "maintenance" }
    ],
    triggered_count: 3,
    last_triggered: "2026-01-28T10:30:00Z"
  },
  {
    rule_id: 12,
    name: "Emergency Button Response",
    description: "Immediate response when patient presses emergency button",
    is_active: true,
    conditions: [
      { condition_type: "button_press", threshold: "emergency", operator: "equals" }
    ],
    actions: [
      { action_type: "create_alert", target: "critical" },
      { action_type: "notify", target: "all_staff_on_duty" },
      { action_type: "notify", target: "emergency_contact" },
      { action_type: "log", target: "incident_report" }
    ],
    triggered_count: 4,
    last_triggered: "2026-01-31T14:22:00Z"
  },
];

const formatTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  // Use ISO format for consistency between server and client
  return date.toISOString().split("T")[0];
};

const INFERENCES_PER_PAGE = 4;
const RULES_PER_PAGE = 4;

type InferenceFilterType = "all" | "high-confidence" | "with-alerts";
type RuleFilterType = "all" | "active" | "inactive";

export function AIRulesSection() {
  const [rules, setRules] = useState(ruleDefinitions);
  const [searchQuery, setSearchQuery] = useState("");
  const [inferenceFilter, setInferenceFilter] = useState<InferenceFilterType>("all");
  const [ruleFilter, setRuleFilter] = useState<RuleFilterType>("all");
  const [inferencePage, setInferencePage] = useState(1);
  const [rulePage, setRulePage] = useState(1);

  const activeRules = rules.filter(r => r.is_active);
  const highConfidenceInferences = aiInferences.filter(i => i.confidence >= 0.85);
  const alertGeneratedInferences = aiInferences.filter(i => i.alert_generated);

  // Filter inferences
  const filteredInferences = aiInferences.filter(inference => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      inference.patient_name.toLowerCase().includes(query) ||
      inference.model_version.toLowerCase().includes(query) ||
      inference.output.toLowerCase().includes(query)
    );

    if (!matchesSearch) return false;

    switch (inferenceFilter) {
      case "high-confidence":
        return inference.confidence >= 0.85;
      case "with-alerts":
        return inference.alert_generated;
      default:
        return true;
    }
  });

  // Filter rules
  const filteredRules = rules.filter(rule => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      rule.name.toLowerCase().includes(query) ||
      rule.description.toLowerCase().includes(query)
    );

    if (!matchesSearch) return false;

    switch (ruleFilter) {
      case "active":
        return rule.is_active;
      case "inactive":
        return !rule.is_active;
      default:
        return true;
    }
  });

  // Pagination for inferences
  const inferenceTotalPages = Math.ceil(filteredInferences.length / INFERENCES_PER_PAGE);
  const paginatedInferences = filteredInferences.slice(
    (inferencePage - 1) * INFERENCES_PER_PAGE,
    inferencePage * INFERENCES_PER_PAGE
  );

  // Pagination for rules
  const ruleTotalPages = Math.ceil(filteredRules.length / RULES_PER_PAGE);
  const paginatedRules = filteredRules.slice(
    (rulePage - 1) * RULES_PER_PAGE,
    rulePage * RULES_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setInferencePage(1);
    setRulePage(1);
  };

  const handleInferenceFilterChange = (filter: InferenceFilterType) => {
    setInferenceFilter(filter);
    setInferencePage(1);
  };

  const handleRuleFilterChange = (filter: RuleFilterType) => {
    setRuleFilter(filter);
    setRulePage(1);
  };

  const toggleRule = (ruleId: number) => {
    setRules(rules.map(r =>
      r.rule_id === ruleId ? { ...r, is_active: !r.is_active } : r
    ));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI & Rules</h1>
            <p className="text-muted-foreground">Manage AI models, inferences, and automation rules</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Rule
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inferences and rules..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${inferenceFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleInferenceFilterChange("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Brain className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{aiInferences.length}</div>
                <div className="text-xs text-muted-foreground">Recent Inferences</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${inferenceFilter === "high-confidence" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleInferenceFilterChange(inferenceFilter === "high-confidence" ? "all" : "high-confidence")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{highConfidenceInferences.length}</div>
                <div className="text-xs text-muted-foreground">High Confidence</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${inferenceFilter === "with-alerts" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleInferenceFilterChange(inferenceFilter === "with-alerts" ? "all" : "with-alerts")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{alertGeneratedInferences.length}</div>
                <div className="text-xs text-muted-foreground">Alerts Generated</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${ruleFilter === "active" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleRuleFilterChange(ruleFilter === "active" ? "all" : "active")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{activeRules.length}/{rules.length}</div>
                <div className="text-xs text-muted-foreground">Active Rules</div>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Side by Side Cards - No outer scroll */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* AI Inferences Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Inferences ({filteredInferences.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                {paginatedInferences.map((inference) => (
                  <div key={inference.inference_id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-sm">{inference.patient_name}</div>
                        <div className="text-xs text-muted-foreground">{inference.model_version}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={inference.confidence >= 0.85 ? "default" : "secondary"}>
                          {(inference.confidence * 100).toFixed(0)}%
                        </Badge>
                        {inference.alert_generated && (
                          <Badge variant="destructive" className="text-xs">Alert</Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{inference.output}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(inference.created_at)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t mt-3">
                <PaginationControlled
                  currentPage={inferencePage}
                  totalPages={inferenceTotalPages}
                  onPageChange={setInferencePage}
                  totalItems={filteredInferences.length}
                  itemsPerPage={INFERENCES_PER_PAGE}
                />
              </div>
            </CardContent>
          </Card>

          {/* Automation Rules Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Automation Rules ({filteredRules.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                {paginatedRules.map((rule) => (
                  <div key={rule.rule_id} className={`p-3 border rounded-lg ${!rule.is_active ? "opacity-60" : ""}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{rule.name}</div>
                        <div className="text-xs text-muted-foreground">{rule.description}</div>
                      </div>
                      <Switch
                        checked={rule.is_active}
                        onCheckedChange={() => toggleRule(rule.rule_id)}
                      />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <span>{rule.conditions.length} conditions</span>
                      <span>{rule.actions.length} actions</span>
                      <span>{rule.triggered_count} triggers</span>
                    </div>
                    {rule.last_triggered && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        Last: {formatTimeAgo(rule.last_triggered)}
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="w-full mt-3 gap-1">
                      <Settings className="h-3 w-3" />
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t mt-3">
                <PaginationControlled
                  currentPage={rulePage}
                  totalPages={ruleTotalPages}
                  onPageChange={setRulePage}
                  totalItems={filteredRules.length}
                  itemsPerPage={RULES_PER_PAGE}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Brain,
  Zap,
  Plus,
  Activity,
  Clock,
  CheckCircle,
  Search,
  AlertTriangle,
} from "lucide-react";

interface AIInference {
  inference_id: number;
  patient_id: number;
  patient_name: string;
  model_version: string;
  output: string;
  confidence: number;
  created_at: string;
  alert_generated: boolean;
  risk_level?: string;
}

interface RuleCondition {
  field_name: string;
  operator: string;
  value_text: string;
  sequence: number;
}

interface RuleAction {
  action_type: string;
  sequence: number;
  params?: Record<string, string>;
}

interface RuleDefinition {
  rule_id: number;
  name: string;
  event_type: string;
  scope_tier: string;
  is_enabled: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
  triggered_count: number;
  last_triggered: string | null;
}

type InferenceFilterType = "all" | "high-confidence" | "with-alerts";
type RuleFilterType = "all" | "active" | "inactive";

const INFERENCES_PER_PAGE = 4;
const RULES_PER_PAGE = 4;

const formatTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "N/A";
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return date.toISOString().split("T")[0];
};

export function AIRulesSection() {
  // TODO: re-enable when backend is available
  // const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
  const [inferences, setInferences] = useState<AIInference[]>([]);
  const [rules, setRules] = useState<RuleDefinition[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [inferenceFilter, setInferenceFilter] = useState<InferenceFilterType>("all");
  const [ruleFilter, setRuleFilter] = useState<RuleFilterType>("all");
  const [inferencePage, setInferencePage] = useState(1);
  const [rulePage, setRulePage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleEventType, setNewRuleEventType] = useState("fall_suspected");
  const [newRuleField, setNewRuleField] = useState("confidence");
  const [newRuleOperator, setNewRuleOperator] = useState("gte");
  const [newRuleValue, setNewRuleValue] = useState("0.8");
  const [newRuleActionType, setNewRuleActionType] = useState("update_event_feed");
  const [newRuleActionSummary, setNewRuleActionSummary] = useState("Auto-generated from admin dashboard");

  // TODO: re-enable when backend is available
  /*
  const authHeaders = (): Record<string, string> => {
    const token = typeof window !== "undefined" ? localStorage.getItem("betti_token") : null;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };
  */

  const toArray = <T,>(payload: unknown): T[] => {
    if (Array.isArray(payload)) {
      return payload as T[];
    }
    if (payload && typeof payload === "object") {
      const objectPayload = payload as { value?: unknown; items?: unknown; data?: unknown };
      if (Array.isArray(objectPayload.value)) {
        return objectPayload.value as T[];
      }
      if (Array.isArray(objectPayload.items)) {
        return objectPayload.items as T[];
      }
      if (Array.isArray(objectPayload.data)) {
        return objectPayload.data as T[];
      }
    }
    return [];
  };

  // TODO: re-enable when backend is available
  const loadData = async () => {
    /*
    setError("");
    try {
      const headers = authHeaders();
      if (!headers.Authorization) {
        throw new Error("Login session not found. Please sign in again.");
      }
      const [inferencesPrimaryRes, rulesPrimaryRes] = await Promise.all([
        fetch(`${apiUrl}/api/ai/inferences?limit=200&home_only=true`, { headers }),
        fetch(`${apiUrl}/api/rules?limit=500`, { headers }),
      ]);
      const inferencesRes = inferencesPrimaryRes.ok
        ? inferencesPrimaryRes
        : await fetch(`${apiUrl}/api/ai/inferences?limit=200`, { headers });
      const rulesRes = rulesPrimaryRes.ok
        ? rulesPrimaryRes
        : await fetch(`${apiUrl}/api/rules?limit=500`, { headers });
      if (!inferencesRes.ok && !rulesRes.ok) {
        throw new Error("Failed to load AI/rules data");
      }
      const [inferencesPayload, rulesPayload] = await Promise.all([
        inferencesRes.ok ? inferencesRes.json().catch(() => []) : Promise.resolve([]),
        rulesRes.ok ? rulesRes.json().catch(() => []) : Promise.resolve([]),
      ]);
      setInferences(toArray<AIInference>(inferencesPayload));
      setRules(toArray<RuleDefinition>(rulesPayload));
      if (!inferencesRes.ok || !rulesRes.ok) {
        setActionMessage("Partial live data loaded in AI & Rules.");
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load AI/rules data");
      setInferences([]);
      setRules([]);
    } finally {
      setIsLoading(false);
    }
    */
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filteredInferences = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return inferences.filter((inference) => {
      const matchesSearch =
        !query ||
        inference.patient_name.toLowerCase().includes(query) ||
        inference.model_version.toLowerCase().includes(query) ||
        inference.output.toLowerCase().includes(query) ||
        String(inference.risk_level || "").toLowerCase().includes(query);

      if (!matchesSearch) return false;
      if (inferenceFilter === "high-confidence") return inference.confidence >= 0.85;
      if (inferenceFilter === "with-alerts") return inference.alert_generated;
      return true;
    });
  }, [inferenceFilter, inferences, searchQuery]);

  const filteredRules = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return rules.filter((rule) => {
      const matchesSearch =
        !query ||
        rule.name.toLowerCase().includes(query) ||
        rule.event_type.toLowerCase().includes(query) ||
        rule.scope_tier.toLowerCase().includes(query);
      if (!matchesSearch) return false;
      if (ruleFilter === "active") return rule.is_enabled;
      if (ruleFilter === "inactive") return !rule.is_enabled;
      return true;
    });
  }, [ruleFilter, rules, searchQuery]);

  const inferenceTotalPages = Math.max(1, Math.ceil(filteredInferences.length / INFERENCES_PER_PAGE));
  const paginatedInferences = filteredInferences.slice(
    (inferencePage - 1) * INFERENCES_PER_PAGE,
    inferencePage * INFERENCES_PER_PAGE,
  );

  const ruleTotalPages = Math.max(1, Math.ceil(filteredRules.length / RULES_PER_PAGE));
  const paginatedRules = filteredRules.slice((rulePage - 1) * RULES_PER_PAGE, rulePage * RULES_PER_PAGE);

  const highConfidenceInferences = inferences.filter((inference) => inference.confidence >= 0.85).length;
  const alertGeneratedInferences = inferences.filter((inference) => inference.alert_generated).length;
  const activeRules = rules.filter((rule) => rule.is_enabled).length;

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setInferencePage(1);
    setRulePage(1);
  };

  const toggleRule = async (rule: RuleDefinition) => {
    setIsSaving(true);
    setActionMessage("");
    // TODO: re-enable when backend is available
    /*
    try {
      const response = await fetch(`${apiUrl}/api/rules/${rule.rule_id}/enabled`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ is_enabled: !rule.is_enabled }),
      });
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || "Failed to update rule");
      }
      const updated = (await response.json()) as RuleDefinition;
      setRules((prev) =>
        prev.map((current) => (current.rule_id === updated.rule_id ? { ...current, ...updated } : current)),
      );
      setActionMessage(`Rule ${updated.name} ${updated.is_enabled ? "enabled" : "disabled"}.`);
    } catch (toggleError) {
      setActionMessage(toggleError instanceof Error ? toggleError.message : "Failed to update rule");
    } finally {
      setIsSaving(false);
    }
    */
    setIsSaving(false);
  };

  const submitCreateRule = async () => {
    if (!newRuleName.trim()) {
      setActionMessage("Rule name is required.");
      return;
    }
    setIsSaving(true);
    setActionMessage("");
    // TODO: re-enable when backend is available
    /*
    try {
      const response = await fetch(`${apiUrl}/api/rules`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          name: newRuleName.trim(),
          event_type: newRuleEventType.trim(),
          scope_tier: "all",
          priority: 100,
          is_enabled: true,
          conditions: [
            {
              field_name: newRuleField.trim(),
              operator: newRuleOperator.trim(),
              value_text: newRuleValue.trim(),
              sequence: 0,
            },
          ],
          actions: [
            {
              action_type: newRuleActionType.trim(),
              sequence: 0,
              params: {
                summary: newRuleActionSummary.trim() || "Rule fired",
              },
            },
          ],
        }),
      });
      if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || "Failed to create rule");
      }
      const created = (await response.json()) as RuleDefinition;
      setRules((prev) => [created, ...prev]);
      setCreateOpen(false);
      setNewRuleName("");
      setActionMessage("Rule created successfully.");
    } catch (createError) {
      setActionMessage(createError instanceof Error ? createError.message : "Failed to create rule");
    } finally {
      setIsSaving(false);
    }
    */
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI & Rules</h1>
            <p className="text-muted-foreground">Live intelligence inferences and dynamic rules from DB.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Rule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create Dynamic Rule</DialogTitle>
                <DialogDescription>
                  Add a database-backed rule condition and action for event processing.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Rule Name</Label>
                  <Input value={newRuleName} onChange={(event) => setNewRuleName(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Event Type</Label>
                  <Input value={newRuleEventType} onChange={(event) => setNewRuleEventType(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Action Type</Label>
                  <Input value={newRuleActionType} onChange={(event) => setNewRuleActionType(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Condition Field</Label>
                  <Input value={newRuleField} onChange={(event) => setNewRuleField(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Operator</Label>
                  <Input value={newRuleOperator} onChange={(event) => setNewRuleOperator(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Condition Value</Label>
                  <Input value={newRuleValue} onChange={(event) => setNewRuleValue(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Action Summary</Label>
                  <Input
                    value={newRuleActionSummary}
                    onChange={(event) => setNewRuleActionSummary(event.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={isSaving}>
                  Cancel
                </Button>
                <Button onClick={() => void submitCreateRule()} disabled={isSaving}>
                  Save Rule
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inferences and rules..."
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="pl-10"
          />
        </div>

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2 text-sm text-destructive">
            {error}
          </div>
        )}
        {isLoading && !error && (
          <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
            Loading AI and rule data...
          </div>
        )}
        {actionMessage && (
          <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
            {actionMessage}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${inferenceFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => setInferenceFilter("all")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Brain className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{inferences.length}</div>
                  <div className="text-xs text-muted-foreground">Recent Inferences</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${inferenceFilter === "high-confidence" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => setInferenceFilter(inferenceFilter === "high-confidence" ? "all" : "high-confidence")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{highConfidenceInferences}</div>
                  <div className="text-xs text-muted-foreground">High Confidence</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${inferenceFilter === "with-alerts" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => setInferenceFilter(inferenceFilter === "with-alerts" ? "all" : "with-alerts")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{alertGeneratedInferences}</div>
                  <div className="text-xs text-muted-foreground">Alerts Generated</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${ruleFilter === "active" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
            onClick={() => setRuleFilter(ruleFilter === "active" ? "all" : "active")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{activeRules}/{rules.length}</div>
                  <div className="text-xs text-muted-foreground">Active Rules</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Inferences ({filteredInferences.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                {paginatedInferences.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No inferences available.</div>
                ) : (
                  paginatedInferences.map((inference) => (
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
                          {inference.alert_generated && <Badge variant="destructive" className="text-xs">Alert</Badge>}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{inference.output}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(inference.created_at)}
                        {inference.risk_level && <span>• risk: {inference.risk_level}</span>}
                      </div>
                    </div>
                  ))
                )}
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

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Dynamic Rules ({filteredRules.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                {paginatedRules.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No rules available.</div>
                ) : (
                  paginatedRules.map((rule) => (
                    <div key={rule.rule_id} className={`p-3 border rounded-lg ${!rule.is_enabled ? "opacity-60" : ""}`}>
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{rule.name}</div>
                          <div className="text-xs text-muted-foreground">
                            event: {rule.event_type} • scope: {rule.scope_tier}
                          </div>
                        </div>
                        <Switch
                          checked={rule.is_enabled}
                          onCheckedChange={() => void toggleRule(rule)}
                          disabled={isSaving}
                        />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                        <span>{rule.conditions.length} conditions</span>
                        <span>{rule.actions.length} actions</span>
                        <span>{rule.triggered_count} triggers</span>
                      </div>
                      {rule.last_triggered && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Activity className="h-3 w-3" />
                          Last: {formatTimeAgo(rule.last_triggered)}
                        </div>
                      )}
                    </div>
                  ))
                )}
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

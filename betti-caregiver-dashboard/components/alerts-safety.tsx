"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, CheckCircle, Clock } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

type Alert = {
  alert_id: number
  patient_id?: number
  description?: string
  event_time?: string
  status?: string
  severity_level_id?: number
}

const ALERTS_POLL_INTERVAL_MS = Number(process.env.NEXT_PUBLIC_CAREGIVER_ALERTS_POLL_MS || "30000")
const ALERTS_FETCH_LIMIT = 50
const ALERTS_CACHE_KEY = "betti_caregiver_alerts_safety_v1"
const ALERTS_CACHE_TTL_MS = 120000
const DEFAULT_FETCH_TIMEOUT_MS = Number(process.env.NEXT_PUBLIC_CAREGIVER_FETCH_TIMEOUT_MS || "25000")

class FetchTimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "FetchTimeoutError"
  }
}

const isAbortError = (error: unknown): boolean => {
  return (
    error === "request-timeout" ||
    (typeof error === "string" && error.toLowerCase().includes("timeout")) ||
    (error instanceof DOMException && error.name === "AbortError") ||
    (error instanceof Error &&
      (error.name === "AbortError" || error.message.toLowerCase().includes("aborted")))
  )
}

const fetchWithTimeout = async (
  url: string,
  init: RequestInit,
  timeoutMs = DEFAULT_FETCH_TIMEOUT_MS,
): Promise<Response> => {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (error) {
    if (isAbortError(error)) {
      throw new FetchTimeoutError(`Timed out after ${timeoutMs}ms`)
    }
    throw error
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export function AlertsSafety() {
  const [alertsList, setAlertsList] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000"
  const initializedRef = useRef(false)
  const lastSeenAlertIdRef = useRef(0)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem(ALERTS_CACHE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as { ts?: number; alerts?: unknown }
          const ts = Number(parsed.ts || 0)
          if (Number.isFinite(ts) && Date.now() - ts <= ALERTS_CACHE_TTL_MS && Array.isArray(parsed.alerts)) {
            setAlertsList(parsed.alerts as Alert[])
            setLoading(false)
          }
        }
      } catch {
        // ignore cache parse failures
      }
    }

    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission().catch(() => undefined)
    }

    const runPoll = async () => {
      if (!mountedRef.current) {
        return
      }
      await fetchAlerts()
    }

    void runPoll()
    const intervalId = window.setInterval(() => {
      void runPoll()
    }, ALERTS_POLL_INTERVAL_MS)

    return () => {
      mountedRef.current = false
      window.clearInterval(intervalId)
    }
  }, [])

  const decodeJwtSub = (token?: string | null): number | null => {
    if (!token) {
      return null
    }
    try {
      const payloadPart = token.split(".")[1]
      if (!payloadPart) {
        return null
      }
      const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/")
      const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
      const decoded = atob(padded)
      const parsed = JSON.parse(decoded) as { sub?: unknown }
      const sub = Number(parsed?.sub)
      return Number.isFinite(sub) && sub > 0 ? sub : null
    } catch {
      return null
    }
  }

  const getAuthContext = (): { token: string; userId: number | null; headers: Record<string, string> } => {
    if (typeof window === "undefined") {
      return { token: "", userId: null, headers: {} }
    }
    const params = new URLSearchParams(window.location.search)
    const token =
      localStorage.getItem("betti_token") || params.get("betti_token") || params.get("token") || ""
    let userId = Number(localStorage.getItem("betti_user_id") || params.get("betti_user_id") || params.get("user_id") || 0)
    const sub = decodeJwtSub(token)
    if (sub) {
      userId = sub
      localStorage.setItem("betti_user_id", String(sub))
    }
    if (token && !localStorage.getItem("betti_token")) {
      localStorage.setItem("betti_token", token)
    }
    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    return { token, userId: userId > 0 ? userId : null, headers }
  }

  const loadAssignedPatientIds = async (userId: number, headers: Record<string, string>): Promise<Set<number>> => {
    const urls = [
      `${apiUrl}/api/users/${userId}/assigned-patients?active_only=true`,
      `${apiUrl}/api/users/${userId}/assigned-patients?active_only=false&home_only=false`,
    ]
    for (const url of urls) {
      let res: Response
      try {
        res = await fetchWithTimeout(url, { headers })
      } catch (error) {
        if (error instanceof FetchTimeoutError) {
          continue
        }
        throw error
      }
      if (!res.ok) {
        continue
      }
      const rows = (await res.json().catch(() => [])) as Array<{ patient_id?: number | null }>
      const ids = new Set<number>()
      for (const row of rows || []) {
        const id = Number(row?.patient_id || 0)
        if (id > 0) {
          ids.add(id)
        }
      }
      if (ids.size > 0) {
        return ids
      }
    }
    return new Set<number>()
  }

  const fetchAlerts = async () => {
    try {
      if (!mountedRef.current) return
      setError("")
      setIsRefreshing(true)
      const auth = getAuthContext()
      const assignedPatientIds =
        auth.userId && auth.userId > 0
          ? await loadAssignedPatientIds(auth.userId, auth.headers)
          : new Set<number>()

      const alertsTimeoutMs = Number(process.env.NEXT_PUBLIC_ALERTS_FETCH_TIMEOUT_MS || "30000")
      const response = await fetchWithTimeout(`${apiUrl}/api/alerts?limit=${ALERTS_FETCH_LIMIT}`, {
        headers: auth.headers,
      }, alertsTimeoutMs)
      if (response.ok) {
        const rows = (await response.json().catch(() => [])) as Alert[]
        const relevantAlerts =
          assignedPatientIds.size > 0
            ? (rows || []).filter((row) => {
                const pid = Number(row?.patient_id || 0)
                return pid > 0 && assignedPatientIds.has(pid)
              })
            : rows || []

        const sorted = [...relevantAlerts].sort((a, b) => Number(b.alert_id || 0) - Number(a.alert_id || 0))
        if (!mountedRef.current) return
        setAlertsList(sorted)
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(
              ALERTS_CACHE_KEY,
              JSON.stringify({ ts: Date.now(), alerts: sorted }),
            )
          } catch {
            // ignore cache write failures
          }
        }

        const activeAlerts = sorted.filter(
          (row) => String(row?.status || "active").toLowerCase() === "active",
        )
        const newestActiveId = activeAlerts.length > 0 ? Number(activeAlerts[0].alert_id || 0) : 0

        if (!initializedRef.current) {
          let storedSeen = 0
          if (typeof window !== "undefined") {
            storedSeen = Number(sessionStorage.getItem("betti_caregiver_last_seen_alert_id") || 0)
          }
          lastSeenAlertIdRef.current = storedSeen > 0 ? storedSeen : newestActiveId
          if (typeof window !== "undefined") {
            sessionStorage.setItem("betti_caregiver_last_seen_alert_id", String(lastSeenAlertIdRef.current))
          }
          initializedRef.current = true
        } else if (newestActiveId > lastSeenAlertIdRef.current) {
          const newlyArrived = activeAlerts
            .filter((row) => Number(row.alert_id || 0) > lastSeenAlertIdRef.current)
            .sort((a, b) => Number(a.alert_id || 0) - Number(b.alert_id || 0))
          for (const alert of newlyArrived.slice(0, 3)) {
            const message = alert.description || `New alert #${alert.alert_id}`
            toast({
              title: "New Care Alert",
              description: message,
            })
            if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
              try {
                new Notification("Betti Caregiver Alert", {
                  body: message,
                  tag: `betti-alert-${alert.alert_id}`,
                })
              } catch {
                // no-op
              }
            }
          }
          lastSeenAlertIdRef.current = newestActiveId
          if (typeof window !== "undefined") {
            sessionStorage.setItem("betti_caregiver_last_seen_alert_id", String(lastSeenAlertIdRef.current))
          }
        }
      }
    } catch (error) {
      if (!mountedRef.current) return
      if (error instanceof FetchTimeoutError) {
        setError("Live alerts are slow right now. Retrying in background...")
      } else {
        console.error("Failed to fetch alerts:", error)
        setError("Unable to load live alerts right now.")
      }
    } finally {
      if (!mountedRef.current) return
      setIsRefreshing(false)
      setLoading(false)
    }
  }

  const handleAcknowledge = async (alertId: number) => {
    try {
      const auth = getAuthContext()
      await fetch(`${apiUrl}/api/alerts/${alertId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...auth.headers,
        },
        body: JSON.stringify({
          status: "acknowledged",
        }),
      }).catch(() => undefined)

      setAlertsList((prev) =>
        prev.map((alert) =>
          alert.alert_id === alertId ? { ...alert, status: "acknowledged" } : alert,
        ),
      )

      toast({
        title: "Alert Acknowledged",
        description: "The alert has been marked as acknowledged",
      })
    } catch (error) {
      console.error('Failed to acknowledge alert:', error)
    }
  }

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  }

  const getSeverityType = (severityId?: number) => {
    if (!severityId) return 'warning'
    return severityId >= 3 ? 'warning' : 'resolved'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            Alerts & Safety
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading alerts...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-destructive" />
          Alerts & Safety ({alertsList.length} recent)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isRefreshing && !loading && (
          <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
            Refreshing live alerts...
          </div>
        )}
        {error && (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {error}
          </div>
        )}
        {alertsList.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent alerts</p>
        ) : (
          <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
            {alertsList.slice(0, 20).map((alert) => {
              const type = getSeverityType(alert.severity_level_id)
              return (
                <div key={alert.alert_id} className="flex items-start gap-3 p-4 rounded-lg border border-border">
                  <div className="flex-shrink-0 mt-0.5">
                    {type === "warning" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    {type === "resolved" && <CheckCircle className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground">
                        {alert.description || `Alert #${alert.alert_id}`}
                      </h4>
                      <Badge variant={alert.status === "active" ? "destructive" : "secondary"} className="text-xs">
                        {alert.status || 'active'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Patient ID: {alert.patient_id}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(alert.event_time)}
                      </span>
                      {alert.status === "active" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-transparent"
                          onClick={() => handleAcknowledge(alert.alert_id)}
                        >
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

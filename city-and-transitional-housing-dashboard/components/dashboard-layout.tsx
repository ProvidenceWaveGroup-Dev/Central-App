import type React from "react"
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">{children?.[0]}</div>
      <div className="lg:col-span-1">{children?.[1]}</div>
    </div>
  )
}

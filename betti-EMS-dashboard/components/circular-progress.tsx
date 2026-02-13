import type { LucideIcon } from "lucide-react"

interface CircularProgressProps {
  icon: LucideIcon
  label: string
  value: number
  color: string
  bgColor: string
}

export function CircularProgress({ icon: Icon, label, value, color, bgColor }: CircularProgressProps) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 transform -rotate-90">
          <circle cx="56" cy="56" r="45" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={color}
            strokeLinecap="round"
          />
        </svg>
        <div className={`absolute inset-0 flex flex-col items-center justify-center ${bgColor} rounded-full m-3`}>
          <Icon className={`w-6 h-6 ${color}`} />
          <span className={`text-lg font-bold ${color}`}>{value}%</span>
        </div>
      </div>
      <p className="text-xs text-center text-muted-foreground font-medium leading-tight">{label}</p>
    </div>
  )
}

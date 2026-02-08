"use client"

import { TrendingUp, Users } from "lucide-react"

interface ExpectedImpactData {
  preEventReach: number
  duringEventReach: number
  postEventReach: number
  expectedAttendance: number
  maxCapacity?: number
}

interface ExpectedImpactSidebarProps {
  data: ExpectedImpactData
}

const formatNumber = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toString()
}

export function ExpectedImpactSidebar({ data }: ExpectedImpactSidebarProps) {
  const totalReach = data.preEventReach + data.duringEventReach + data.postEventReach

  return (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Expected Impact</h3>
        <p className="text-sm text-muted-foreground">Live metrics based on your inputs</p>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <div className="mb-3 text-sm font-semibold text-blue-900">Pre-Event</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-700">Reach</span>
            <span className="text-lg font-bold text-blue-900">{formatNumber(data.preEventReach)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-700">Engagements (5%)</span>
            <span className="text-lg font-bold text-blue-900">
              {formatNumber(Math.round(data.preEventReach * 0.05))}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
        <div className="mb-3 text-sm font-semibold text-secondary">During Event</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-orange-700">Reach</span>
            <span className="text-lg font-bold text-secondary">{formatNumber(data.duringEventReach)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-orange-700">Engagements (5%)</span>
            <span className="text-lg font-bold text-secondary">
              {formatNumber(Math.round(data.duringEventReach * 0.05))}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
        <div className="mb-3 text-sm font-semibold text-purple-600">Post-Event</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-700">Reach</span>
            <span className="text-lg font-bold text-purple-600">{formatNumber(data.postEventReach)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-purple-700">Engagements (5%)</span>
            <span className="text-lg font-bold text-purple-600">
              {formatNumber(Math.round(data.postEventReach * 0.05))}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="rounded-2xl border border-primary/30 bg-card p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-primary">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">Campaign Totals</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Reach</span>
              <span className="text-xl font-bold text-foreground">{formatNumber(totalReach)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total Engagements</span>
              <span className="text-xl font-bold text-foreground">
                {formatNumber(Math.round(totalReach * 0.05))}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-green-100 bg-green-50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-green-900">
            <Users className="h-4 w-4" />
            Expected Attendance
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-2xl font-bold text-green-900">{data.expectedAttendance}</div>
            {data.maxCapacity && <div className="text-sm text-green-700">/ {data.maxCapacity}</div>}
          </div>
          {data.maxCapacity && (
            <div className="mt-2">
              <div className="h-1.5 w-full rounded-full bg-green-200">
                <div
                  className="h-1.5 rounded-full bg-green-600"
                  style={{
                    width: `${Math.min((data.expectedAttendance / data.maxCapacity) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="mt-1 text-[10px] text-green-700">
                {Math.round((data.expectedAttendance / data.maxCapacity) * 100)}% capacity
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import {
  DollarSign,
  CalendarDays,
  Users,
  Zap,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react"

import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { ProgressChart } from "@/components/sporgates/progress-chart"
import { useBusinessContext } from "@/lib/business-context"
import { activitiesService } from "@/lib/services/activities"
import { businessesService } from "@/lib/services/businesses"

interface BusinessDashboardPageProps {
  onNavigate: (page: PageRoute) => void
}

export function BusinessDashboardPage({ onNavigate }: BusinessDashboardPageProps) {
  const { activeBusinessId } = useBusinessContext()
  const [activities, setActivities] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!activeBusinessId) return
      setLoading(true)
      try {
        const [activitiesData, teamData] = await Promise.all([
          activitiesService.getAll({ organizerId: activeBusinessId }),
          businessesService.getStaff(activeBusinessId)
        ])
        setActivities(Array.isArray(activitiesData) ? activitiesData : [])
        setTeamMembers(Array.isArray(teamData) ? teamData : [])
      } catch (error) {
        console.error("Failed to load dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [activeBusinessId])

  // Build dashboard data from API + inline defaults for KPIs (no analytics endpoint exists)
  const topActivities = activities
    .map((a: any) => ({
      ...a,
      calculatedRevenue: (a.pricePerPerson || 0) * (a.currentParticipants || 0)
    }))
    .sort((a: any, b: any) => b.calculatedRevenue - a.calculatedRevenue || (b.currentParticipants || 0) - (a.currentParticipants || 0))
    .slice(0, 5)
    .map((a: any) => ({
      name: a.name || "Untitled Activity",
      bookings: a.currentParticipants || 0,
      revenue: a.calculatedRevenue
    }))

  const mappedTeamMembers = teamMembers.map((m: any) => ({
    name: `${m.firstName || ''} ${m.lastName || ''}`.trim() || m.username || 'Unknown',
    role: m.role || "Staff",
    status: "active",
    avatar: (m.firstName?.[0] || "") + (m.lastName?.[0] || "") || "U"
  }))

  const monthlyRevenue = [
    { month: "Jan", revenue: 4200 }, { month: "Feb", revenue: 5100 },
    { month: "Mar", revenue: 4800 }, { month: "Apr", revenue: 6300 },
    { month: "May", revenue: 5900 }, { month: "Jun", revenue: 7200 },
  ]

  const data = {
    totalRevenue: monthlyRevenue.reduce((s, m) => s + m.revenue, 0),
    revenueChange: 12.5,
    totalBookings: activities.length * 4,
    bookingChange: 8.3,
    totalCustomers: 1289,
    customerChange: 15.2,
    activeActivities: activities.length,
    monthlyRevenue,
    topActivities,
    teamMembers: mappedTeamMembers,
    recentBookings: [
      { id: "BK-001", customer: "Jordan Rivera", activity: "Morning Yoga", amount: 25, status: "confirmed" },
      { id: "BK-002", customer: "Emily Park", activity: "Basketball Training", amount: 35, status: "pending" },
      { id: "BK-003", customer: "David Kim", activity: "Tennis Session", amount: 40, status: "confirmed" },
    ],
  }

  const maxRevenue = Math.max(...data.monthlyRevenue.map((d: { revenue: number }) => d.revenue))
  const revenueTrend = data.monthlyRevenue.map((item: { month: string; revenue: number }) => ({
    date: item.month,
    value: item.revenue,
  }))

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Business Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your business performance
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          {
            label: "Total Revenue",
            value: `$${data.totalRevenue.toLocaleString()}`,
            change: data.revenueChange,
            icon: DollarSign,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Total Bookings",
            value: data.totalBookings,
            change: data.bookingChange,
            icon: CalendarDays,
            color: "text-secondary",
            bg: "bg-secondary/10",
          },
          {
            label: "Customers",
            value: data.totalCustomers.toLocaleString(),
            change: data.customerChange,
            icon: Users,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Active Activities",
            value: data.activeActivities,
            change: 0,
            icon: Zap,
            color: "text-secondary",
            bg: "bg-secondary/10",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", kpi.bg)}>
                <kpi.icon className={cn("h-4 w-4", kpi.color)} />
              </div>
              {kpi.change !== 0 && (
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-[10px] font-semibold",
                    kpi.change > 0 ? "text-green-600" : "text-red-500"
                  )}
                >
                  {kpi.change > 0 ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {Math.abs(kpi.change)}%
                </span>
              )}
            </div>
            <p className="text-xl font-bold text-foreground">{kpi.value}</p>
            <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Revenue Overview</h3>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </div>
            <TrendingUp className="h-4 w-4 text-secondary" />
          </div>
          <div className="flex items-end gap-2" style={{ height: 160 }}>
            {data.monthlyRevenue.map((item) => (
              <div key={item.month} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-foreground">
                  ${(item.revenue / 1000).toFixed(1)}k
                </span>
                <div
                  className="gradient-primary w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${(item.revenue / maxRevenue) * 120}px`,
                  }}
                />
                <span className="text-[10px] text-muted-foreground">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Activities */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Top Activities</h3>
            <button
              type="button"
              onClick={() => onNavigate("business-activities")}
              className="text-xs font-semibold text-secondary"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {data.topActivities.map((activity, i) => (
              <div
                key={activity.name}
                className="flex items-center gap-3 rounded-xl bg-muted p-3"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-card text-xs font-bold text-primary shadow-sm">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">{activity.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {activity.bookings} bookings
                  </p>
                </div>
                <span className="text-xs font-bold text-primary">${activity.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <ProgressChart title="Revenue Trend" data={revenueTrend} color="#0f172a" />
      </div>

      {/* Recent Bookings */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Recent Bookings</h3>
          <button
            type="button"
            onClick={() => onNavigate("business-customers")}
            className="text-xs font-semibold text-secondary"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  ID
                </th>
                <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Customer
                </th>
                <th className="hidden pb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground md:table-cell">
                  Activity
                </th>
                <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Amount
                </th>
                <th className="pb-3 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {data.recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-border last:border-0">
                  <td className="py-3 text-xs font-medium text-muted-foreground">
                    {booking.id}
                  </td>
                  <td className="py-3 text-xs font-semibold text-foreground">
                    {booking.customer}
                  </td>
                  <td className="hidden py-3 text-xs text-muted-foreground md:table-cell">
                    {booking.activity}
                  </td>
                  <td className="py-3 text-xs font-semibold text-foreground">
                    ${booking.amount}
                  </td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                        booking.status === "confirmed" && "bg-green-100 text-green-700",
                        booking.status === "pending" && "bg-yellow-100 text-yellow-700",
                        booking.status === "cancelled" && "bg-red-100 text-red-700"
                      )}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button type="button" className="rounded-full p-1 hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Team Members */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Team Members</h3>
          <button
            type="button"
            onClick={() => onNavigate("business-team")}
            className="text-xs font-semibold text-secondary"
          >
            Manage
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {data.teamMembers.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center gap-2 rounded-xl bg-muted p-4 text-center"
            >
              <div className="gradient-primary flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white">
                {member.avatar}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{member.name}</p>
                <p className="text-[10px] text-muted-foreground">{member.role}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium",
                  member.status === "active"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                )}
              >
                {member.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

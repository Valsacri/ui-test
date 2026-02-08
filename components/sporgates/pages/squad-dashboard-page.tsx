"use client"

import { Users, Calendar, Trophy, TrendingUp, ChevronRight } from "lucide-react"
import { squads, activities } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"

interface SquadDashboardPageProps {
  onNavigate: (page: PageRoute, id?: string) => void
}

export function SquadDashboardPage({ onNavigate }: SquadDashboardPageProps) {
  const squad = squads[0]

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Squad Dashboard</h1>
        <p className="text-sm text-muted-foreground">Manage {squad.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Users className="mb-2 h-5 w-5 text-primary" />
          <p className="text-xl font-bold text-foreground">{squad.members}</p>
          <p className="text-[11px] text-muted-foreground">Members</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Trophy className="mb-2 h-5 w-5 text-secondary" />
          <p className="text-xl font-bold text-foreground">{squad.wins}</p>
          <p className="text-[11px] text-muted-foreground">Wins</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Calendar className="mb-2 h-5 w-5 text-primary" />
          <p className="text-xl font-bold text-foreground">{squad.upcomingEvents}</p>
          <p className="text-[11px] text-muted-foreground">Upcoming</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <TrendingUp className="mb-2 h-5 w-5 text-secondary" />
          <p className="text-xl font-bold text-foreground">
            {squad.wins + squad.losses > 0 ? Math.round((squad.wins / (squad.wins + squad.losses)) * 100) : 0}%
          </p>
          <p className="text-[11px] text-muted-foreground">Win Rate</p>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-bold text-foreground">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { text: "Won against Brooklyn Ballers 78-65", time: "2 days ago" },
            { text: "Practice session completed", time: "4 days ago" },
            { text: "New member joined the squad", time: "1 week ago" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
              <p className="flex-1 text-foreground">{item.text}</p>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Upcoming Events</h3>
          <button type="button" className="text-xs font-semibold text-primary">View All</button>
        </div>
        <div className="space-y-3">
          {activities.slice(0, 3).map((activity) => (
            <button
              type="button"
              key={activity.id}
              onClick={() => onNavigate("activity-detail", activity.id)}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted"
            >
              <img src={activity.image} alt={activity.title} className="h-10 w-10 rounded-lg object-cover" crossOrigin="anonymous" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground">{activity.title}</p>
                <p className="text-[10px] text-muted-foreground">{activity.date} - {activity.time}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      {/* Roster Preview */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Roster</h3>
          <button
            type="button"
            onClick={() => onNavigate("squad-detail", squad.id)}
            className="text-xs font-semibold text-primary"
          >
            View All
          </button>
        </div>
        <div className="space-y-2">
          {squad.memberList.map((member) => (
            <div key={member.name} className="flex items-center gap-3">
              <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white">
                {member.avatar}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-foreground">{member.name}</p>
              </div>
              <span className="text-[10px] text-muted-foreground">{member.role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

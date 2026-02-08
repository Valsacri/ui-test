"use client"

import { ArrowRight, Zap, Trophy, TrendingUp, Target } from "lucide-react"
import { activities, facilities, goals, userProfile } from "@/lib/mock-data"
import { ActivityCard } from "@/components/sporgates/cards/activity-card"
import { FacilityCard } from "@/components/sporgates/cards/facility-card"
import type { PageRoute } from "@/lib/navigation"

interface HomePageProps {
  onNavigate: (page: PageRoute, detailId?: string) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      {/* Hero Banner */}
      <div className="gradient-hero overflow-hidden rounded-2xl p-6 text-white shadow-lg md:p-8">
        <div className="max-w-lg">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/80">
            Welcome back
          </p>
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">
            Hey, {userProfile.name.split(" ")[0]}!
          </h1>
          <p className="mb-4 text-sm text-white/80">
            You have 3 upcoming activities this week. Keep up the momentum!
          </p>
          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#003C66] transition-opacity hover:opacity-90"
          >
            Explore Now
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          {
            label: "Activities Joined",
            value: userProfile.stats.totalActivities,
            icon: Zap,
            color: "text-secondary",
          },
          {
            label: "Hours Played",
            value: userProfile.stats.hoursPlayed,
            icon: Trophy,
            color: "text-primary",
          },
          {
            label: "Sports Played",
            value: userProfile.stats.sportsPlayed,
            icon: TrendingUp,
            color: "text-secondary",
          },
          {
            label: "Avg Rating",
            value: userProfile.stats.avgRating,
            icon: Target,
            color: "text-primary",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm"
          >
            <stat.icon className={`mb-2 h-5 w-5 ${stat.color}`} />
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Goals Progress */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Your Goals</h2>
          <button
            type="button"
            className="text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                  {goal.sport}
                </span>
                <span className="text-xs text-muted-foreground">{goal.deadline}</span>
              </div>
              <h3 className="mb-2 text-sm font-bold text-foreground">{goal.title}</h3>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-foreground">
                  {goal.progress}/{goal.target} {goal.unit}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="gradient-secondary h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(goal.progress / goal.target) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Activities */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Featured Activities</h2>
          <button
            type="button"
            onClick={() => onNavigate("activities")}
            className="flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
          >
            See All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activities.slice(0, 3).map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onClick={() => onNavigate("activity-detail", activity.id)}
            />
          ))}
        </div>
      </div>

      {/* Top Facilities */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Top Facilities</h2>
          <button
            type="button"
            onClick={() => onNavigate("facilities")}
            className="flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
          >
            See All <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {facilities.slice(0, 2).map((facility) => (
            <FacilityCard
              key={facility.id}
              facility={facility}
              onClick={() => onNavigate("facility-detail", facility.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

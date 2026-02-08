"use client"

import { useMemo, useState } from "react"
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Share2,
  Trophy,
  Sparkles,
  Target,
  TrendingUp,
  MessageCircle,
  Bell,
} from "lucide-react"
import { activities, goals, userProfile } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { MemojiFaceAvatar } from "@/components/sporgates/memoji-face-avatar"

interface ProfileEnhancedPageProps {
  onNavigate: (page: PageRoute, id?: string) => void
}

const tabs = ["Highlights", "Goals", "Activity"]

export function ProfileEnhancedPage({ onNavigate }: ProfileEnhancedPageProps) {
  const [activeTab, setActiveTab] = useState("Highlights")

  const upcomingActivities = useMemo(() => activities.slice(0, 3), [])
  const completedGoals = goals.filter((goal) => goal.progress >= goal.target).length

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("profile")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Profile
      </button>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="gradient-secondary h-28" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-4 md:flex-row md:items-end">
            <div className="gradient-secondary flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-lg">
              {userProfile.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{userProfile.name}</h1>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                  Level Up
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{userProfile.username}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {userProfile.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {userProfile.memberSince}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onNavigate("messages")}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <MessageCircle className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{userProfile.bio}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Activities", value: userProfile.stats.totalActivities, icon: Sparkles },
          { label: "Goals", value: goals.length, icon: Target },
          { label: "Completed", value: completedGoals, icon: Trophy },
          { label: "Hours", value: userProfile.stats.hoursPlayed, icon: TrendingUp },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-all",
              activeTab === tab
                ? "gradient-primary text-white shadow-md"
                : "bg-card text-foreground border border-border hover:bg-muted"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Highlights" && (
        <div className="space-y-4 animate-fade-in">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground">Your Memoji</h3>
                <p className="text-xs text-muted-foreground">Personalize your profile avatar</p>
              </div>
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Customize
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <MemojiFaceAvatar size="md" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-secondary" />
              <h3 className="text-sm font-bold text-foreground">Milestones</h3>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {userProfile.badges.map((badge) => (
                <div
                  key={badge.name}
                  className="rounded-xl border border-border bg-muted p-3 text-center"
                >
                  <p className="text-xs font-semibold text-foreground">{badge.name}</p>
                  <p className="text-[10px] text-muted-foreground">Achievement unlocked</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">Upcoming Activities</h3>
            <div className="space-y-3">
              {upcomingActivities.map((activity) => (
                <button
                  key={activity.id}
                  type="button"
                  onClick={() => onNavigate("activity-detail", activity.id)}
                  className="flex w-full items-center gap-4 rounded-xl border border-border bg-muted px-4 py-3 text-left transition-all hover:shadow-md"
                >
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="h-12 w-12 rounded-lg object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-secondary">{activity.sport}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Goals" && (
        <div className="space-y-4 animate-fade-in">
          {goals.map((goal) => {
            const progress = Math.min(100, Math.round((goal.progress / goal.target) * 100))
            return (
              <div key={goal.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{goal.title}</p>
                    <p className="text-xs text-muted-foreground">{goal.deadline}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                    {goal.sport}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{goal.progress}/{goal.target} {goal.unit}</span>
                    <span className="text-secondary">{progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="gradient-secondary h-full rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === "Activity" && (
        <div className="space-y-4 animate-fade-in">
          {activities.slice(0, 4).map((activity) => (
            <button
              key={activity.id}
              type="button"
              onClick={() => onNavigate("activity-detail", activity.id)}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:shadow-md"
            >
              <img
                src={activity.image}
                alt={activity.title}
                className="h-14 w-14 rounded-xl object-cover"
                crossOrigin="anonymous"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.date} • {activity.time}</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-semibold text-muted-foreground">
                {activity.sport}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

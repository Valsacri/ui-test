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
  Users,
  Award,
  CheckCircle2,
  Plus,
  Ruler,
  Weight,
  Edit,
} from "lucide-react"
import {
  activities,
  goals,
  userProfile,
  achievements,
  activityHistory,
  progressData,
  personalProfile,
  recommendedActivities,
} from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { MemojiFaceAvatar } from "@/components/sporgates/memoji-face-avatar"

interface ProfileEnhancedPageProps {
  onNavigate: (page: PageRoute, id?: string) => void
}

const tabs = ["Overview", "Activity", "Goals", "Achievements", "Personal Info"]

const iconMap: Record<string, React.ElementType> = {
  Trophy,
  Users,
  Target,
  Award,
}

export function ProfileEnhancedPage({ onNavigate }: ProfileEnhancedPageProps) {
  const [activeTab, setActiveTab] = useState("Overview")
  const [joinedIds, setJoinedIds] = useState<string[]>([])

  const upcomingActivities = useMemo(() => activities.slice(0, 3), [])
  const completedGoals = goals.filter((goal) => goal.progress >= goal.target).length
  const completedMilestones = goals.reduce(
    (acc, g) => acc + (g.milestones?.filter((m) => m.completed).length ?? 0),
    0
  )
  const overallProgress = Math.round(
    goals.reduce((acc, g) => acc + Math.min(100, Math.round((g.progress / g.target) * 100)), 0) /
    goals.length
  )

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

      {/* ===== PROFILE HEADER ===== */}
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

      {/* ===== STATS ===== */}
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

      {/* ===== TABS ===== */}
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

      {/* ============================================================ */}
      {/* OVERVIEW TAB */}
      {/* ============================================================ */}
      {activeTab === "Overview" && (
        <div className="space-y-4 animate-fade-in">
          {/* Recent Achievements */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-4 w-4 text-secondary" />
              <h3 className="text-sm font-bold text-foreground">Recent Achievements</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {achievements.slice(0, 4).map((a) => {
                const Icon = iconMap[a.icon] || Trophy
                return (
                  <div key={a.id} className="rounded-xl border border-border p-3 transition-shadow hover:shadow-md">
                    <Icon className={cn("h-7 w-7 mb-2", a.color)} />
                    <p className="text-xs font-semibold text-foreground">{a.title}</p>
                    <p className="text-[10px] text-muted-foreground">{a.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* This Month's Progress */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <h3 className="text-sm font-bold text-foreground">This Month's Progress</h3>
            </div>
            <div className="flex items-end gap-1 h-28">
              {progressData.map((p) => (
                <div key={p.date} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md gradient-primary"
                    style={{ height: `${((p.value - 170) / 20) * 100}%` }}
                  />
                  <span className="text-[9px] text-muted-foreground">{p.date.split(" ")[1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">Recent Activity</h3>
            <div className="space-y-2">
              {activityHistory.slice(0, 3).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between rounded-xl border-l-4 border-secondary bg-muted px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.sport} • {a.date}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                      a.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    )}
                  >
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* ACTIVITY TAB */}
      {/* ============================================================ */}
      {activeTab === "Activity" && (
        <div className="space-y-3 animate-fade-in">
          {activityHistory.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.sport}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                    a.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  )}
                >
                  {a.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{a.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* GOALS TAB */}
      {/* ============================================================ */}
      {activeTab === "Goals" && (
        <div className="space-y-4 animate-fade-in">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Target, label: "Active Goals", value: goals.length },
              { icon: CheckCircle2, label: "Milestones", value: completedMilestones },
              { icon: TrendingUp, label: "Overall", value: `${overallProgress}%` },
            ].map((s) => (
              <div
                key={s.label}
                className="gradient-primary rounded-2xl p-4 text-center text-white shadow-md"
              >
                <s.icon className="mx-auto mb-1 h-5 w-5" />
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-[10px] text-white/80">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Weight Progress */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-foreground flex items-center gap-2">
              <Weight className="h-4 w-4 text-primary" />
              Weight Progress
            </h3>
            <div className="flex items-start gap-5 mb-4 pb-4 border-b border-border">
              <MemojiFaceAvatar size="sm" />
              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{userProfile.name}</p>
                  <p className="text-xs text-muted-foreground">{userProfile.location}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-muted p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Ruler className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[10px] text-muted-foreground">Height</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{personalProfile.height}</p>
                  </div>
                  <div className="rounded-xl bg-muted p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Weight className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[10px] text-muted-foreground">Current</span>
                    </div>
                    <p className="text-sm font-bold text-foreground">{personalProfile.currentWeight}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Target className="h-3.5 w-3.5 text-secondary" />
                  <span className="text-muted-foreground">Goal:</span>
                  <span className="font-semibold text-foreground">{personalProfile.targetWeight}</span>
                </div>
              </div>
            </div>
            {/* Mini chart */}
            <div className="flex items-end gap-1 h-20">
              {progressData.map((p) => (
                <div key={p.date} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md bg-blue-500"
                    style={{ height: `${((p.value - 170) / 20) * 100}%` }}
                  />
                  <span className="text-[8px] text-muted-foreground">{p.date.split(" ")[1]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent p-5 shadow-sm dark:from-purple-900/10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-purple-500" />
              <h3 className="text-sm font-bold text-foreground">AI Insights</h3>
            </div>
            <div className="flex items-start gap-3 mb-4">
              <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-purple-500" />
              <p className="text-xs leading-relaxed text-muted-foreground">
                <strong className="text-foreground">Great progress!</strong> You&apos;ve completed{" "}
                {overallProgress}% of your goals. Keep up the cardio sessions — your weight trend
                is tracking well.
              </p>
            </div>
            <p className="mb-2 text-xs font-semibold text-foreground">Recommended Activities:</p>
            <div className="space-y-2">
              {recommendedActivities.map((ra) => (
                <div
                  key={ra.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3"
                >
                  <div>
                    <p className="text-xs font-semibold text-foreground">{ra.title}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {ra.sport} • {ra.date} • {ra.time}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setJoinedIds((prev) => [...prev, ra.id])}
                    disabled={joinedIds.includes(ra.id)}
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-semibold transition-all",
                      joinedIds.includes(ra.id)
                        ? "bg-green-100 text-green-700"
                        : "gradient-primary text-white shadow-sm hover:opacity-90"
                    )}
                  >
                    {joinedIds.includes(ra.id) ? "Joined ✓" : "Join"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Goals list */}
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
                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {goal.progress}/{goal.target} {goal.unit}
                    </span>
                    <span className="text-secondary">{progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="gradient-secondary h-full rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                </div>
                {/* Milestones */}
                {goal.milestones && (
                  <div className="mt-3 space-y-1.5">
                    {goal.milestones.map((m) => (
                      <div key={m.id} className="flex items-center gap-2 text-xs">
                        <CheckCircle2
                          className={cn(
                            "h-3.5 w-3.5 shrink-0",
                            m.completed ? "text-green-500" : "text-muted-foreground/40"
                          )}
                        />
                        <span className={m.completed ? "text-muted-foreground line-through" : "text-foreground"}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* ACHIEVEMENTS TAB */}
      {/* ============================================================ */}
      {activeTab === "Achievements" && (
        <div className="grid grid-cols-1 gap-4 animate-fade-in md:grid-cols-2">
          {achievements.map((a) => {
            const Icon = iconMap[a.icon] || Trophy
            return (
              <div
                key={a.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                    <Icon className={cn("h-6 w-6", a.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">{a.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>
                    <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Earned {a.date}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* PERSONAL INFO TAB */}
      {/* ============================================================ */}
      {activeTab === "Personal Info" && (
        <div className="animate-fade-in">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-foreground">Personal Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { label: "Full Name", value: userProfile.name },
                { label: "Username", value: userProfile.username },
                { label: "Email", value: "alex.johnson@email.com" },
                { label: "Phone", value: "+1 (555) 123-4567" },
                { label: "Location", value: userProfile.location },
              ].map((field) => (
                <div key={field.label}>
                  <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    defaultValue={field.value}
                    readOnly
                    className="h-10 w-full rounded-xl border border-border bg-muted px-4 text-sm text-foreground outline-none"
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                Bio
              </label>
              <textarea
                defaultValue={userProfile.bio}
                readOnly
                rows={2}
                className="w-full resize-none rounded-xl border border-border bg-muted p-4 text-sm text-foreground outline-none"
              />
            </div>
            <button
              type="button"
              className="gradient-primary w-full rounded-xl py-2.5 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

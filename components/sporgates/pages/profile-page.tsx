"use client"

import { useState } from "react"
import {
  MapPin,
  Calendar,
  Users,
  Award,
  Edit3,
  Zap,
  Clock,
  Star,
  TrendingUp,
  CalendarDays,
  ChevronRight,
} from "lucide-react"
import { userProfile, activities, goals } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface ProfilePageProps {
  onNavigate: (page: PageRoute) => void
}

const tabs = ["Overview", "Activity", "Achievements"]

const recentActivity = [
  { id: "1", type: "joined", title: "5v5 Basketball Pickup Game", date: "Feb 7, 2026", sport: "Basketball" },
  { id: "2", type: "completed", title: "Swimming Laps at Asphalt Green", date: "Feb 5, 2026", sport: "Swimming" },
  { id: "3", type: "booked", title: "Tennis Court at Central Park", date: "Feb 3, 2026", sport: "Tennis" },
  { id: "4", type: "joined", title: "Sunday Soccer League", date: "Feb 1, 2026", sport: "Soccer" },
  { id: "5", type: "completed", title: "Boxing Fundamentals Class", date: "Jan 30, 2026", sport: "Boxing" },
  { id: "6", type: "booked", title: "Personal Basketball Training", date: "Jan 28, 2026", sport: "Basketball" },
]

const achievements = [
  { name: "Early Bird", description: "10 morning activities completed", icon: "sunrise", unlocked: true, date: "Jan 2026" },
  { name: "Team Player", description: "Join 5 team sports events", icon: "users", unlocked: true, date: "Dec 2025" },
  { name: "Marathon Runner", description: "Run a total of 50 miles", icon: "medal", unlocked: true, date: "Feb 2026" },
  { name: "Social Butterfly", description: "Connect with 100 athletes", icon: "heart", unlocked: true, date: "Jan 2026" },
  { name: "Multi-Sport", description: "Play 5 different sports", icon: "trophy", unlocked: true, date: "Nov 2025" },
  { name: "Streak Master", description: "7-day activity streak", icon: "flame", unlocked: false, progress: 5, target: 7 },
  { name: "Century Club", description: "100 total activities", icon: "star", unlocked: false, progress: 48, target: 100 },
  { name: "Top Rated", description: "Maintain 4.9+ rating", icon: "sparkle", unlocked: false, progress: 4.8, target: 4.9 },
]

const weeklyData = [
  { day: "Mon", hours: 1.5 },
  { day: "Tue", hours: 2.0 },
  { day: "Wed", hours: 0 },
  { day: "Thu", hours: 1.0 },
  { day: "Fri", hours: 2.5 },
  { day: "Sat", hours: 3.0 },
  { day: "Sun", hours: 1.5 },
]

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState("Overview")
  const maxHours = Math.max(...weeklyData.map((d) => d.hours))

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="gradient-primary h-32" />
        <div className="px-6 pb-6 pt-6">
          <div className="-mt-12 flex items-end gap-4">
            <div className="gradient-primary flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-lg">
              {userProfile.avatar}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{userProfile.name}</h1>
                <button
                  type="button"
                  onClick={() => onNavigate("settings-profile")}
                  className="rounded-full p-1.5 transition-colors hover:bg-muted"
                >
                  <Edit3 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{userProfile.username}</p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => onNavigate("profile-enhanced")}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                View Insights
              </button>
              <button
                type="button"
                onClick={() => onNavigate("profile-information")}
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Profile Info
              </button>
              <button
                type="button"
                onClick={() => onNavigate("settings")}
                className="rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                Edit Profile
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground">{userProfile.bio}</p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {userProfile.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              Joined {userProfile.memberSince}
            </span>
          </div>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <span>
              <strong className="text-foreground">{userProfile.followers}</strong>{" "}
              <span className="text-muted-foreground">Followers</span>
            </span>
            <span>
              <strong className="text-foreground">{userProfile.following}</strong>{" "}
              <span className="text-muted-foreground">Following</span>
            </span>
            <span>
              <strong className="text-foreground">{userProfile.activitiesJoined}</strong>{" "}
              <span className="text-muted-foreground">Activities</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Overview Tab */}
      {activeTab === "Overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "Total Activities", value: userProfile.stats.totalActivities, icon: Zap, color: "text-secondary", bg: "bg-secondary/10" },
              { label: "Hours Played", value: userProfile.stats.hoursPlayed, icon: Clock, color: "text-primary", bg: "bg-primary/10" },
              { label: "Sports Played", value: userProfile.stats.sportsPlayed, icon: Users, color: "text-secondary", bg: "bg-secondary/10" },
              { label: "Avg Rating", value: userProfile.stats.avgRating, icon: Star, color: "text-primary", bg: "bg-primary/10" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Weekly Activity Chart */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">Weekly Activity</h2>
                <p className="text-xs text-muted-foreground">Hours per day this week</p>
              </div>
              <TrendingUp className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex items-end gap-3" style={{ height: 140 }}>
              {weeklyData.map((day) => (
                <div key={day.day} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-foreground">
                    {day.hours > 0 ? `${day.hours}h` : ""}
                  </span>
                  <div
                    className={cn(
                      "w-full rounded-t-lg transition-all duration-500",
                      day.hours > 0 ? "gradient-primary" : "bg-muted"
                    )}
                    style={{
                      height: day.hours > 0 ? `${(day.hours / maxHours) * 100}px` : "8px",
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Goals Progress */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-foreground">Goals Progress</h2>
            <div className="space-y-4">
              {goals.map((goal) => {
                const percentage = (goal.progress / goal.target) * 100
                return (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {goal.sport}
                        </span>
                        <span className="text-xs font-medium text-foreground">{goal.title}</span>
                      </div>
                      <span className="text-xs font-semibold text-secondary">{Math.round(percentage)}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="gradient-secondary h-full rounded-full transition-all duration-700"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Favorite Sports */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-foreground">Favorite Sports</h2>
            <div className="flex flex-wrap gap-2">
              {userProfile.favoriteSports.map((sport) => (
                <span
                  key={sport}
                  className="rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary"
                >
                  {sport}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === "Activity" && (
        <div className="space-y-6 animate-fade-in">
          <div className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-5 py-4">
              <h2 className="text-base font-bold text-foreground">Recent Activity</h2>
              <p className="text-xs text-muted-foreground">Your activity timeline</p>
            </div>
            <div className="divide-y divide-border">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      item.type === "joined" && "bg-primary/10 text-primary",
                      item.type === "completed" && "bg-green-100 text-green-600",
                      item.type === "booked" && "bg-secondary/10 text-secondary"
                    )}
                  >
                    {item.type === "joined" && <Users className="h-4 w-4" />}
                    {item.type === "completed" && <Star className="h-4 w-4" />}
                    {item.type === "booked" && <CalendarDays className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{item.type}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                    {item.sport}
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Activities */}
          <div>
            <h2 className="mb-3 text-base font-bold text-foreground">Upcoming Activities</h2>
            <div className="space-y-3">
              {activities.slice(0, 3).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="h-14 w-14 rounded-xl object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{activity.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>{activity.date}</span>
                      <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-secondary/10 px-2.5 py-0.5 text-[10px] font-semibold text-secondary">
                    {activity.sport}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === "Achievements" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">5</p>
              <p className="text-[11px] text-muted-foreground">Unlocked</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">3</p>
              <p className="text-[11px] text-muted-foreground">In Progress</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">8</p>
              <p className="text-[11px] text-muted-foreground">Total</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">62%</p>
              <p className="text-[11px] text-muted-foreground">Completion</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.name}
                className={cn(
                  "flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
                  achievement.unlocked ? "border-border" : "border-border opacity-75"
                )}
              >
                <div
                  className={cn(
                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
                    achievement.unlocked ? "gradient-secondary" : "bg-muted"
                  )}
                >
                  <Award className={cn("h-6 w-6", achievement.unlocked ? "text-white" : "text-muted-foreground")} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{achievement.name}</p>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  {achievement.unlocked ? (
                    <p className="mt-1 text-[10px] font-medium text-secondary">
                      Unlocked {achievement.date}
                    </p>
                  ) : (
                    <div className="mt-1.5">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="gradient-secondary h-full rounded-full"
                          style={{
                            width: `${((achievement.progress || 0) / (achievement.target || 1)) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {achievement.progress}/{achievement.target}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

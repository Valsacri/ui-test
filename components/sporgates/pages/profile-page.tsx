"use client"

import {
  MapPin,
  Calendar,
  Users,
  Award,
  Edit3,
  Zap,
  Clock,
  Star,
} from "lucide-react"
import { userProfile } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"

interface ProfilePageProps {
  onNavigate: (page: PageRoute) => void
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Profile Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="gradient-primary h-32" />
        <div className="px-6 pb-6">
          <div className="-mt-12 flex items-end gap-4">
            <div className="gradient-primary flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-lg">
              {userProfile.avatar}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{userProfile.name}</h1>
                <button
                  type="button"
                  onClick={() => onNavigate("settings")}
                  className="rounded-full p-1.5 transition-colors hover:bg-muted"
                >
                  <Edit3 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{userProfile.username}</p>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Total Activities", value: userProfile.stats.totalActivities, icon: Zap, color: "text-secondary" },
          { label: "Hours Played", value: userProfile.stats.hoursPlayed, icon: Clock, color: "text-primary" },
          { label: "Sports Played", value: userProfile.stats.sportsPlayed, icon: Users, color: "text-secondary" },
          { label: "Avg Rating", value: userProfile.stats.avgRating, icon: Star, color: "text-primary" },
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

      {/* Badges */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-foreground">Badges & Achievements</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {userProfile.badges.map((badge) => (
            <div
              key={badge.name}
              className="flex flex-col items-center gap-2 rounded-xl bg-muted p-4"
            >
              <div className="gradient-secondary flex h-12 w-12 items-center justify-center rounded-full">
                <Award className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-semibold text-foreground">{badge.name}</span>
            </div>
          ))}
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
  )
}

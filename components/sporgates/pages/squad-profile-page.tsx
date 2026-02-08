"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Users,
  Trophy,
  Calendar,
  MapPin,
  Star,
  Share2,
  Shield,
  Swords,
} from "lucide-react"
import { squads, activities } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface SquadProfilePageProps {
  squadId: string
  onNavigate: (page: PageRoute, id?: string) => void
}

const tabs = ["Overview", "Members", "Activities", "Highlights"]

const highlights = [
  { label: "50 Events", icon: Trophy, color: "text-secondary" },
  { label: "Top Rated", icon: Star, color: "text-primary" },
  { label: "Weekly Goal", icon: Swords, color: "text-secondary" },
  { label: "Verified", icon: Shield, color: "text-primary" },
]

export function SquadProfilePage({ squadId, onNavigate }: SquadProfilePageProps) {
  const squad = squads.find((item) => item.id === squadId) || squads[0]
  const [activeTab, setActiveTab] = useState("Overview")
  const [isMember, setIsMember] = useState(false)

  const relatedActivities = activities
    .filter((activity) => activity.sport === squad.sport)
    .slice(0, 3)

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("community")}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Community
      </button>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="gradient-secondary h-28" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex flex-col gap-4 md:flex-row md:items-end">
            <div className="gradient-secondary flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-lg">
              {squad.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{squad.name}</h1>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                  {squad.sport}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{squad.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {squad.members}/{squad.maxMembers} members
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {squad.upcomingEvents} upcoming events
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  NYC
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsMember((prev) => !prev)}
                className={cn(
                  "rounded-full px-5 py-2 text-xs font-semibold transition-all",
                  isMember
                    ? "border border-primary bg-primary/10 text-primary"
                    : "gradient-primary text-white shadow-md"
                )}
              >
                {isMember ? "Member" : "Join Squad"}
              </button>
              <button
                type="button"
                className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
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

      {activeTab === "Overview" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-primary">{squad.members}</p>
              <p className="text-[11px] text-muted-foreground">Members</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-secondary">{squad.wins}</p>
              <p className="text-[11px] text-muted-foreground">Wins</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-primary">{squad.upcomingEvents}</p>
              <p className="text-[11px] text-muted-foreground">Events</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-secondary">
                {squad.wins + squad.losses > 0
                  ? Math.round((squad.wins / (squad.wins + squad.losses)) * 100)
                  : 0}%
              </p>
              <p className="text-[11px] text-muted-foreground">Win Rate</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">About Squad</h3>
            <p className="text-sm text-muted-foreground">
              {squad.description} The squad meets weekly, hosts community challenges, and tracks
              progress toward shared fitness goals.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">Highlights</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center rounded-xl bg-muted p-3 text-center"
                >
                  <item.icon className={cn("mb-1 h-5 w-5", item.color)} />
                  <p className="text-xs font-semibold text-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "Members" && (
        <div className="space-y-3 animate-fade-in">
          {squad.memberList.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold text-white">
                {member.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
              <span className={cn(
                "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                member.role === "Captain" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
              )}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Activities" && (
        <div className="space-y-3 animate-fade-in">
          {relatedActivities.map((activity) => (
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
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{activity.date}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span>{activity.location}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {activeTab === "Highlights" && (
        <div className="space-y-4 animate-fade-in">
          {[
            { label: "Won against Brooklyn Ballers 78-65", date: "Feb 8, 2026" },
            { label: "New member Lisa Anderson joined", date: "Feb 4, 2026" },
            { label: "Hosted community pickup game", date: "Jan 30, 2026" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

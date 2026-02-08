"use client"

import { useState } from "react"
import { ArrowLeft, Users, Trophy, Calendar, MapPin, ChevronRight } from "lucide-react"
import { squads, activities } from "@/lib/mock-data"
import type { PageRoute } from "@/lib/navigation"
import { cn } from "@/lib/utils"

interface SquadDetailPageProps {
  squadId: string
  onNavigate: (page: PageRoute, id?: string) => void
}

export function SquadDetailPage({ squadId, onNavigate }: SquadDetailPageProps) {
  const squad = squads.find((s) => s.id === squadId) || squads[0]
  const [activeTab, setActiveTab] = useState("Overview")
  const tabs = ["Overview", "Roster", "Events", "Timeline"]

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("community")}
        className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Community
      </button>

      {/* Squad Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="gradient-primary h-28" />
        <div className="px-6 pb-6">
          <div className="-mt-10 flex items-end gap-4">
            <div className="gradient-primary flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-lg">
              {squad.avatar}
            </div>
            <div className="flex-1 pb-1">
              <h1 className="text-xl font-bold text-foreground">{squad.name}</h1>
              <p className="text-sm text-muted-foreground">{squad.description}</p>
            </div>
            <button
              type="button"
              className="hidden rounded-full border border-primary px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white md:block"
            >
              Join Squad
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {squad.members}/{squad.maxMembers} Members
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" />
              {squad.wins}W - {squad.losses}L
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {squad.upcomingEvents} Upcoming Events
            </span>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
              {squad.sport}
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

      {activeTab === "Overview" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{squad.members}</p>
              <p className="text-[11px] text-muted-foreground">Members</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">{squad.wins}</p>
              <p className="text-[11px] text-muted-foreground">Wins</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{squad.upcomingEvents}</p>
              <p className="text-[11px] text-muted-foreground">Events</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">
                {squad.wins + squad.losses > 0 ? Math.round((squad.wins / (squad.wins + squad.losses)) * 100) : 0}%
              </p>
              <p className="text-[11px] text-muted-foreground">Win Rate</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">Recent Activity</h3>
            <p className="text-sm text-muted-foreground">{squad.recentActivity}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">Captain</h3>
            <div className="flex items-center gap-3">
              <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">
                {squad.captainAvatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{squad.captain}</p>
                <p className="text-xs text-muted-foreground">Squad Captain</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Roster" && (
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

      {activeTab === "Events" && (
        <div className="space-y-3 animate-fade-in">
          {activities.slice(0, 3).map((activity) => (
            <button
              type="button"
              key={activity.id}
              onClick={() => onNavigate("activity-detail", activity.id)}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm text-left transition-all hover:shadow-md"
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
                  <Calendar className="h-3 w-3" />
                  <span>{activity.date}</span>
                  <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                  <span>{activity.time}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}

      {activeTab === "Timeline" && (
        <div className="space-y-4 animate-fade-in">
          {[
            { date: "Feb 8, 2026", event: "Won against Brooklyn Ballers 78-65", type: "win" },
            { date: "Feb 5, 2026", event: "New member Carlos Rivera joined", type: "member" },
            { date: "Feb 1, 2026", event: "Lost to Manhattan Hoops 52-58", type: "loss" },
            { date: "Jan 28, 2026", event: "Squad created", type: "milestone" },
          ].map((item) => (
            <div key={item.date + item.event} className="flex items-start gap-3">
              <div className={cn(
                "mt-1 h-3 w-3 shrink-0 rounded-full",
                item.type === "win" && "bg-green-500",
                item.type === "loss" && "bg-red-400",
                item.type === "member" && "bg-primary",
                item.type === "milestone" && "bg-secondary"
              )} />
              <div>
                <p className="text-sm font-medium text-foreground">{item.event}</p>
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

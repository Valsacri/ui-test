"use client"

import { useState } from "react"
import useSWR from "swr"
import Image from "next/image"
import { ArrowLeft, Users, Trophy, Calendar, ChevronRight } from "lucide-react"
import { squadService, activitiesService } from "@/lib/services"
import type { PageRoute } from "@/lib/navigation"
import { ProfileSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { cn } from "@/lib/utils"

interface SquadDetailPageProps {
  squadId: string
  onNavigate: (page: PageRoute, id?: string) => void
}

export function SquadDetailPage({ squadId, onNavigate }: SquadDetailPageProps) {
  const [activeTab, setActiveTab] = useState("Overview")
  const tabs = ["Overview", "Roster", "Events", "Timeline"]

  const { data: squad, error: squadError, isLoading: squadLoading, mutate: mutateSquad } = useSWR(
    squadId ? `/squads/${squadId}` : null,
    () => squadService.getById(squadId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: actRaw = [], isLoading: actLoading } = useSWR(
    squadId ? `/activities/squad-detail/${squadId}` : null,
    () => activitiesService.getAll(),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const isLoading = squadLoading
  const activities = Array.isArray(actRaw) ? actRaw.slice(0, 3) : []

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (squadError) {
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
        <ErrorState
          title="Couldn't load squad"
          message={squadError?.message || "Something went wrong. Please try again."}
          onRetry={() => mutateSquad()}
        />
      </div>
    )
  }

  if (!squad) {
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
        <ErrorState
          title="Squad not found"
          message="The squad you're looking for doesn't exist or is no longer available."
          onRetry={() => onNavigate("community")}
        />
      </div>
    )
  }

  const memberList = squad.memberList || squad.members_list || []
  const wins = squad.wins || 0
  const losses = squad.losses || 0

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
              {squad.name ? squad.name.slice(0, 2).toUpperCase() : "SQ"}
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
              {squad.members || memberList.length} Members
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" />
              {wins}W - {losses}L
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {squad.upcomingEvents || 0} Upcoming Events
            </span>
            {squad.sport && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
                {squad.sport}
              </span>
            )}
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
              <p className="text-2xl font-bold text-primary">{squad.members || memberList.length}</p>
              <p className="text-[11px] text-muted-foreground">Members</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">{wins}</p>
              <p className="text-[11px] text-muted-foreground">Wins</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-primary">{squad.upcomingEvents || 0}</p>
              <p className="text-[11px] text-muted-foreground">Events</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm text-center">
              <p className="text-2xl font-bold text-secondary">
                {wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0}%
              </p>
              <p className="text-[11px] text-muted-foreground">Win Rate</p>
            </div>
          </div>

          {squad.recentActivity && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-bold text-foreground">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">{squad.recentActivity}</p>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold text-foreground">Captain</h3>
            <div className="flex items-center gap-3">
              <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">
                {squad.captainAvatar || squad.captain?.slice(0, 2)?.toUpperCase() || "CP"}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{squad.captain || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">Squad Captain</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "Roster" && (
        <div className="space-y-3 animate-fade-in">
          {memberList.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No members listed</p>
          ) : (
            memberList.map((member: any) => (
              <div
                key={member.name || member.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="gradient-primary flex h-11 w-11 items-center justify-center rounded-full text-xs font-bold text-white">
                  {member.avatar || member.name?.slice(0, 2)?.toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role || "Member"}</p>
                </div>
                <span className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                  member.role === "Captain" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"
                )}>
                  {member.role || "Member"}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "Events" && (
        <div className="space-y-3 animate-fade-in">
          {activities.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No upcoming events</p>
          ) : (
            activities.map((activity: any) => (
              <button
                type="button"
                key={activity.id}
                onClick={() => onNavigate("activity-detail", activity.id)}
                className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm text-left transition-all hover:shadow-md"
              >
                {activity.image && (
                  <Image
                    src={activity.image}
                    alt={activity.title}
                    width={56}
                    height={56}
                    className="rounded-xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{activity.title || activity.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{activity.date || "TBD"}</span>
                    {activity.time && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                        <span>{activity.time}</span>
                      </>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))
          )}
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

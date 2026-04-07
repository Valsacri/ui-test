"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Users, Calendar, Trophy, TrendingUp, ChevronRight } from "lucide-react"
import { DashboardSkeleton } from "@/components/sporgates/ux/page-skeleton"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { squadService, activitiesService, authService } from "@/lib/services"
import { leagueService } from "@/lib/services/league"
import type { PageRoute } from "@/lib/navigation"

const SELECTED_SQUAD_KEY = "sporgates_selected_squad_id"

function formatTimeAgo(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return `${weeks}w ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

interface SquadDashboardPageProps {
  onNavigate: (page: PageRoute, id?: string) => void
}

export function SquadDashboardPage({ onNavigate }: SquadDashboardPageProps) {
  const currentUser = authService.getCurrentUser()
  const userId = currentUser?.id ?? ""
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem(SELECTED_SQUAD_KEY)
      if (s) setSelectedSquadId(s)
    } catch {
      /* ignore */
    }
  }, [])

  const { data: squadsRaw, error: squadsError, isLoading: sqLoading, mutate: mutateSquads } = useSWR(
    userId ? `/squads/user/${userId}` : null,
    () => squadService.getByUser(userId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const squads = Array.isArray(squadsRaw) ? squadsRaw : []

  useEffect(() => {
    if (squads.length === 0) return
    const valid = selectedSquadId && squads.some((s: { id: string }) => s.id === selectedSquadId)
    if (!valid) {
      const pick = squads[0].id as string
      setSelectedSquadId(pick)
      try {
        localStorage.setItem(SELECTED_SQUAD_KEY, pick)
      } catch {
        /* ignore */
      }
    }
  }, [squads, selectedSquadId])

  const squad =
    squads.find((s: { id: string }) => s.id === selectedSquadId) ?? (squads.length > 0 ? squads[0] : null)
  const squadId = squad?.id as string | undefined

  const setSquadSelection = (id: string) => {
    setSelectedSquadId(id)
    try {
      localStorage.setItem(SELECTED_SQUAD_KEY, id)
    } catch {
      /* ignore */
    }
  }

  const { data: actRaw = [], isLoading: actLoading } = useSWR(
    squadId ? [`/activities/hostSquad`, squadId] : null,
    () => activitiesService.getAll({ hostSquadId: squadId }),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: squadLeaguesRaw, isLoading: squadLeaguesLoading } = useSWR(
    squadId ? [`/v1/leagues/team`, squadId] : null,
    () => leagueService.getByTeam(squadId!),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const squadLeagues = Array.isArray(squadLeaguesRaw)
    ? squadLeaguesRaw
    : (squadLeaguesRaw as { content?: unknown[] })?.content ?? []

  const isLoading = sqLoading || (squadId ? actLoading : false)
  const actList = Array.isArray(actRaw) ? actRaw : (actRaw as { content?: unknown[] })?.content ?? []
  const activities = actList.slice(0, 5)

  if (isLoading && !squad) {
    return <DashboardSkeleton />
  }

  if (squadsError) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <h1 className="text-2xl font-bold text-foreground">Squad Dashboard</h1>
        <ErrorState
          title="Couldn't load squads"
          message={squadsError?.message || "Something went wrong. Please try again."}
          onRetry={() => mutateSquads()}
        />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <h1 className="text-2xl font-bold text-foreground">Squad Dashboard</h1>
        <ErrorState
          title="Sign in required"
          message="Sign in to view your squad dashboard."
          onRetry={() => onNavigate("community")}
        />
      </div>
    )
  }

  if (!squad) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <h1 className="text-2xl font-bold text-foreground">Squad Dashboard</h1>
        <ErrorState
          title="No squad yet"
          message="Create or join a squad from Community to get started."
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Squad Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage {squad.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {squads.length > 1 && (
            <select
              className="h-9 rounded-lg border border-border bg-muted px-2 text-xs font-medium"
              value={squadId}
              onChange={(e) => setSquadSelection(e.target.value)}
            >
              {squads.map((s: { id: string; name?: string }) => (
                <option key={s.id} value={s.id}>
                  {s.name ?? s.id}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={() => onNavigate("league-list")}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-primary"
          >
            Browse leagues
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Users className="mb-2 h-5 w-5 text-primary" />
          <p className="text-xl font-bold text-foreground">{squad.members || memberList.length}</p>
          <p className="text-[11px] text-muted-foreground">Members</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Trophy className="mb-2 h-5 w-5 text-secondary" />
          <p className="text-xl font-bold text-foreground">{wins}</p>
          <p className="text-[11px] text-muted-foreground">Wins</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <Calendar className="mb-2 h-5 w-5 text-primary" />
          <p className="text-xl font-bold text-foreground">{squad.upcomingEvents || 0}</p>
          <p className="text-[11px] text-muted-foreground">Upcoming</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <TrendingUp className="mb-2 h-5 w-5 text-secondary" />
          <p className="text-xl font-bold text-foreground">
            {wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0}%
          </p>
          <p className="text-[11px] text-muted-foreground">Win Rate</p>
        </div>
      </div>

      {/* Leagues this squad competes in */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-foreground">Your leagues</h3>
          <button
            type="button"
            onClick={() => onNavigate("league-list")}
            className="text-xs font-semibold text-primary"
          >
            Register in a league
          </button>
        </div>
        {squadLeaguesLoading ? (
          <p className="text-xs text-muted-foreground">Loading leagues…</p>
        ) : squadLeagues.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            This squad is not registered in any league yet. Browse leagues to join a season.
          </p>
        ) : (
          <ul className="space-y-2">
            {squadLeagues.map((L: { id: string; name?: string; status?: string }) => (
              <li key={L.id}>
                <button
                  type="button"
                  onClick={() => onNavigate("league-detail", L.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2 text-left transition-colors hover:bg-muted/60"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Trophy className="h-4 w-4 shrink-0 text-secondary" />
                    <span className="truncate text-sm font-semibold text-foreground">{L.name ?? L.id}</span>
                  </span>
                  <span className="shrink-0 text-[10px] font-medium text-muted-foreground">
                    {L.status ? String(L.status) : "—"}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Activity from hosted activities */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Recent Activity</h3>
          <button
            type="button"
            onClick={() => onNavigate("squad-detail", squad.id)}
            className="text-xs font-semibold text-primary"
          >
            View Squad
          </button>
        </div>
        <div className="space-y-3">
          {actLoading ? (
            <p className="text-xs text-muted-foreground">Loading activity…</p>
          ) : actList.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-3">
              No recent activity yet. Host activities to see them here.
            </p>
          ) : (
            actList.slice(0, 5).map((a: any) => {
              const raw = a.startDateTime as string | number[] | undefined
              const d = raw == null ? null
                : Array.isArray(raw) ? new Date(raw[0] as number, (raw[1] as number) - 1, raw[2] as number)
                : new Date(raw as string)
              const timeAgo = d ? formatTimeAgo(d) : ""
              return (
                <button
                  type="button"
                  key={a.id}
                  onClick={() => onNavigate("activity-detail", a.id)}
                  className="flex w-full items-center gap-3 text-sm text-left hover:bg-muted rounded-lg px-1 py-1 transition-colors"
                >
                  <div className="h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p className="flex-1 text-foreground truncate">{a.name || "Activity"}</p>
                  {timeAgo && <span className="shrink-0 text-xs text-muted-foreground">{timeAgo}</span>}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Upcoming Events</h3>
          <button type="button" onClick={() => onNavigate("squad-detail", squad.id)} className="text-xs font-semibold text-primary">View All</button>
        </div>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
          ) : (
            activities.map((activity: any) => (
              <button
                type="button"
                key={activity.id}
                onClick={() => onNavigate("activity-detail", activity.id)}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-muted"
              >
                {activity.image && (
                  <img src={activity.image} alt={activity.title} className="h-10 w-10 rounded-lg object-cover" crossOrigin="anonymous" />
                )}
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">{activity.title || activity.name}</p>
                  <p className="text-[10px] text-muted-foreground">{activity.date || "TBD"} {activity.time && `- ${activity.time}`}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))
          )}
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
          {memberList.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No members listed</p>
          ) : (
            memberList.map((member: any) => (
              <div key={member.name || member.id} className="flex items-center gap-3">
                <div className="gradient-primary flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white">
                  {member.avatar || member.name?.slice(0, 2)?.toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground">{member.name}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">{member.role || "Member"}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

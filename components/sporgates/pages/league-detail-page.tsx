"use client"

import { useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import { ArrowLeft, Trophy, Loader2, Users, Calendar } from "lucide-react"
import { toast } from "sonner"
import type { PageRoute } from "@/lib/navigation"
import { leagueService } from "@/lib/services/league"
import { squadService } from "@/lib/services/squad"
import { activitiesService } from "@/lib/services"
import { authService } from "@/lib/services/auth"
import { getApiErrorMessage } from "@/lib/api-errors"
import { resolvePostImageUrl, formatFeedTime } from "@/lib/utils"
import { ErrorState } from "@/components/sporgates/ux/error-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type StandingDraft = {
  teamId: string
  teamName: string
  position: string
  played: string
  won: string
  drawn: string
  lost: string
  pointsFor: string
  pointsAgainst: string
  totalPoints: string
}

function rowFromApi(row: Record<string, unknown>): StandingDraft {
  const n = (v: unknown) => (v != null ? String(v) : "")
  return {
    teamId: n(row.teamId),
    teamName: n(row.teamName),
    position: n(row.position),
    played: n(row.played),
    won: n(row.won),
    drawn: n(row.drawn),
    lost: n(row.lost),
    pointsFor: n(row.pointsFor),
    pointsAgainst: n(row.pointsAgainst),
    totalPoints: n(row.totalPoints),
  }
}

function draftToPayload(rows: StandingDraft[]): Record<string, unknown>[] {
  const num = (s: string) => {
    const t = s.trim()
    if (t === "") return undefined
    const x = Number(t)
    return Number.isFinite(x) ? x : undefined
  }
  return rows.map((r) => ({
    teamId: r.teamId.trim() || undefined,
    teamName: r.teamName.trim() || undefined,
    position: num(r.position),
    played: num(r.played),
    won: num(r.won),
    drawn: num(r.drawn),
    lost: num(r.lost),
    pointsFor: num(r.pointsFor),
    pointsAgainst: num(r.pointsAgainst),
    totalPoints: num(r.totalPoints),
  }))
}

/** Stable fallbacks — `useSWR` + `data = []` creates a new `[]` each render and breaks useEffect deps. */
const EMPTY_STANDINGS: Record<string, unknown>[] = []
const EMPTY_SQUADS: { id: string; sportId?: string; name?: string }[] = []

interface LeagueDetailPageProps {
  leagueId: string
  onNavigate: (page: PageRoute, id?: string) => void
}

export function LeagueDetailPage({ leagueId, onNavigate }: LeagueDetailPageProps) {
  const [tab, setTab] = useState<"overview" | "standings" | "teams" | "schedule">("overview")
  const [registeringId, setRegisteringId] = useState<string | null>(null)
  const [standingsEdit, setStandingsEdit] = useState(false)
  const [draftStandings, setDraftStandings] = useState<StandingDraft[]>([])
  const [confirmStandingsOpen, setConfirmStandingsOpen] = useState(false)
  const [savingStandings, setSavingStandings] = useState(false)
  const [publishing, setPublishing] = useState(false)

  const currentUser = authService.getCurrentUser()

  const { data: league, error: leagueErr, isLoading: leagueLoading, mutate: mutLeague } = useSWR(
    leagueId ? `/leagues/${leagueId}` : null,
    () => leagueService.getById(leagueId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )

  const { data: standingsData, error: standErr, isLoading: standLoading, mutate: mutStand } = useSWR(
    leagueId && tab === "standings" ? `/leagues/${leagueId}/standings` : null,
    () => leagueService.getStandings(leagueId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  const standings = Array.isArray(standingsData) ? standingsData : EMPTY_STANDINGS

  const { data: leagueSquadsData, isLoading: teamsLoading, mutate: mutLeagueSquads } = useSWR(
    leagueId && tab === "teams" ? `/squads/league/${leagueId}` : null,
    () => squadService.getByLeague(leagueId),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  const leagueSquads = Array.isArray(leagueSquadsData) ? leagueSquadsData : EMPTY_SQUADS

  const { data: captainSquadsData } = useSWR(
    currentUser?.id && tab === "teams" && league ? `/squads/captain/${currentUser.id}` : null,
    () => squadService.getByCaptain(currentUser!.id),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  const captainSquads = Array.isArray(captainSquadsData) ? captainSquadsData : EMPTY_SQUADS

  const { data: leagueActivitiesRaw, isLoading: scheduleLoading } = useSWR(
    leagueId && tab === "schedule" ? `/v1/activities?leagueId=${leagueId}` : null,
    () => activitiesService.getAll({ leagueId: leagueId }),
    { revalidateOnFocus: false, dedupingInterval: 10000 }
  )
  const leagueActivities = Array.isArray(leagueActivitiesRaw) ? leagueActivitiesRaw : []

  const leagueSportId = league && "sportId" in league ? (league as { sportId?: string }).sportId : undefined
  const registeredIds = new Set(leagueSquads.map((s: { id: string }) => s.id))
  const eligibleToRegister = captainSquads.filter(
    (s: { id: string; sportId?: string }) =>
      s.sportId && leagueSportId && s.sportId === leagueSportId && !registeredIds.has(s.id)
  )

  const organizerId = league && "organizerId" in league ? (league as { organizerId?: string }).organizerId : undefined
  const isOrganizer = Boolean(currentUser?.id && organizerId && currentUser.id === organizerId)

  /** Single stable snapshot for one useEffect dep (avoids dev/HMR "dependency array changed size" warnings). */
  const standingsSyncSnapshot = useMemo(
    () => ({
      editing: standingsEdit,
      rows: standings as Record<string, unknown>[],
    }),
    [standingsEdit, standings]
  )

  useEffect(() => {
    if (standingsSyncSnapshot.editing) return
    setDraftStandings(standingsSyncSnapshot.rows.map(rowFromApi))
  }, [standingsSyncSnapshot])

  const isLoading = leagueLoading && !league

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (leagueErr || !league) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => onNavigate("league-list")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <ErrorState
          title="Couldn't load league"
          message={leagueErr?.message || "Not found"}
          onRetry={() => mutLeague()}
        />
      </div>
    )
  }

  const statusUpper = String(league.status ?? "").toUpperCase()
  const isDraft = statusUpper === "DRAFT"

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={() => onNavigate("league-list")}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All leagues
      </button>

      <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
        <div className="flex items-start gap-4">
          {league.logoUrl ? (
            <img src={resolvePostImageUrl(league.logoUrl)} alt={league.name} className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
          ) : (
            <div className="gradient-secondary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white">
              <Trophy className="h-7 w-7" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-foreground">{league.name}</h1>
            <p className="text-sm text-muted-foreground">{league.description || "League"}</p>
            <p className="mt-2 text-xs font-medium text-primary">
              {league.status ?? ""}
              {league.format ? ` · ${league.format}` : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 border-b border-border pb-2 overflow-x-auto">
        {(
          [
            ["overview", "Overview"],
            ["standings", "Standings"],
            ["teams", "Teams"],
            ["schedule", "Schedule"],
          ] as const
        ).map(([t, label]) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`shrink-0 rounded-lg px-3 py-1.5 text-sm font-semibold ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <p>
              Teams: <span className="font-medium text-foreground">{league.totalTeams ?? 0}</span>
            </p>
            {league.startDate && (
              <p className="mt-2">
                Season window: {String(league.startDate)} — {String(league.endDate ?? "")}
              </p>
            )}
          </div>
          {isOrganizer && isDraft && (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/5 p-4">
              <p className="text-sm font-semibold text-foreground">Organizer: this league is a draft</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Publish when you are ready for captains to register squads and for standings to be visible to everyone.
              </p>
              <Button
                type="button"
                className="mt-3"
                disabled={publishing}
                onClick={async () => {
                  setPublishing(true)
                  try {
                    await leagueService.updateStatus(leagueId, "ACTIVE")
                    toast.success("League published")
                    await mutLeague()
                  } catch (err: unknown) {
                    toast.error(getApiErrorMessage(err, "Could not publish league"))
                  } finally {
                    setPublishing(false)
                  }
                }}
              >
                {publishing ? "Publishing…" : "Publish league"}
              </Button>
            </div>
          )}
        </div>
      )}

      {tab === "schedule" && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Activities linked to this league (fixtures, league events). Create or edit activities with{" "}
            <span className="font-mono text-[10px]">leagueId</span> set to this league&apos;s id.
          </p>
          {scheduleLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : leagueActivities.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-8 text-center">
              <Calendar className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-semibold text-foreground">No league activities yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                When activities are tagged with this league, they will appear here.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {leagueActivities.map((a: Record<string, unknown>) => {
                const id = String(a.id ?? "")
                const title = String(a.name ?? "Activity")
                const start = a.startDateTime as string | undefined
                const loc = a.location != null ? String(a.location) : ""
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onNavigate("activity-detail", id)}
                      className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground truncate">{title}</p>
                        <p className="text-xs text-muted-foreground">
                          {start ? formatFeedTime(start) : "TBD"}
                          {loc ? ` · ${loc}` : ""}
                        </p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {tab === "teams" && (
        <div className="space-y-4">
          {currentUser && eligibleToRegister.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Register your squad</p>
              <ul className="space-y-2">
                {eligibleToRegister.map((s: { id: string; name?: string }) => (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-muted/40 px-3 py-2">
                    <span className="text-sm font-medium text-foreground">{s.name || s.id}</span>
                    <button
                      type="button"
                      disabled={registeringId === s.id}
                      onClick={async () => {
                        setRegisteringId(s.id)
                        try {
                          await squadService.addToLeague(s.id, leagueId)
                          toast.success("Squad registered for this league")
                          await Promise.all([mutLeague(), mutLeagueSquads()])
                        } catch (err: unknown) {
                          toast.error(getApiErrorMessage(err, "Could not register squad"))
                        } finally {
                          setRegisteringId(null)
                        }
                      }}
                      className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
                    >
                      {registeringId === s.id ? "…" : "Register"}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            {teamsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !Array.isArray(leagueSquads) || leagueSquads.length === 0 ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No teams in this league yet.</p>
            ) : (
              <ul className="divide-y divide-border">
                {(leagueSquads as { id: string; name?: string; memberCount?: number }[]).map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate("squad-detail", s.id)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{s.name || s.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.memberCount != null ? `${s.memberCount} members` : "Team"}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tab === "standings" && (
        <div className="space-y-3">
          {isOrganizer && (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-muted-foreground">
                As organizer, you can replace the full standings table. This overwrites what everyone sees.
              </p>
              <div className="flex gap-2">
                {standingsEdit ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setStandingsEdit(false)
                        setDraftStandings((standings as Record<string, unknown>[]).map(rowFromApi))
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="button" size="sm" onClick={() => setConfirmStandingsOpen(true)}>
                      Save standings
                    </Button>
                  </>
                ) : (
                  <Button type="button" variant="secondary" size="sm" onClick={() => setStandingsEdit(true)}>
                    Edit standings
                  </Button>
                )}
              </div>
            </div>
          )}
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            {standLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : standErr ? (
              <div className="p-4">
                <ErrorState title="Standings" message={standErr.message} onRetry={() => mutStand()} />
              </div>
            ) : standings.length === 0 && !standingsEdit ? (
              <p className="p-6 text-center text-sm text-muted-foreground">No standings yet.</p>
            ) : standingsEdit && isOrganizer ? (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-2 py-2 font-semibold">#</th>
                    <th className="px-2 py-2 font-semibold">Team</th>
                    <th className="px-2 py-2 font-semibold">P</th>
                    <th className="px-2 py-2 font-semibold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {draftStandings.map((row, i) => (
                    <tr key={row.teamId || `row-${i}`} className="border-b border-border/60">
                      <td className="px-2 py-1">
                        <Input
                          className="h-8 w-14 text-xs"
                          value={row.position}
                          onChange={(e) => {
                            const v = e.target.value
                            setDraftStandings((prev) =>
                              prev.map((r, j) => (j === i ? { ...r, position: v } : r))
                            )
                          }}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          className="h-8 min-w-[8rem] text-xs"
                          value={row.teamName}
                          onChange={(e) => {
                            const v = e.target.value
                            setDraftStandings((prev) =>
                              prev.map((r, j) => (j === i ? { ...r, teamName: v } : r))
                            )
                          }}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          className="h-8 w-14 text-xs"
                          value={row.played}
                          onChange={(e) => {
                            const v = e.target.value
                            setDraftStandings((prev) =>
                              prev.map((r, j) => (j === i ? { ...r, played: v } : r))
                            )
                          }}
                        />
                      </td>
                      <td className="px-2 py-1">
                        <Input
                          className="h-8 w-14 text-xs"
                          value={row.totalPoints}
                          onChange={(e) => {
                            const v = e.target.value
                            setDraftStandings((prev) =>
                              prev.map((r, j) => (j === i ? { ...r, totalPoints: v } : r))
                            )
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">#</th>
                    <th className="px-4 py-3 font-semibold">Team</th>
                    <th className="px-4 py-3 font-semibold">P</th>
                    <th className="px-4 py-3 font-semibold">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {(standings as Record<string, unknown>[]).map((row, i) => (
                    <tr key={String(row.teamId ?? i)} className="border-b border-border/60">
                      <td className="px-4 py-2">{row.position != null ? String(row.position) : i + 1}</td>
                      <td className="px-4 py-2 font-medium text-foreground">{String(row.teamName ?? row.teamId ?? "")}</td>
                      <td className="px-4 py-2">{row.played != null ? String(row.played) : "—"}</td>
                      <td className="px-4 py-2">{row.totalPoints != null ? String(row.totalPoints) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <AlertDialog open={confirmStandingsOpen} onOpenChange={setConfirmStandingsOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Replace standings?</AlertDialogTitle>
                <AlertDialogDescription>
                  This replaces the entire standings table for this league. Everyone will see the new order and
                  points. This cannot be undone automatically.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  disabled={savingStandings}
                  onClick={async (e) => {
                    e.preventDefault()
                    setSavingStandings(true)
                    try {
                      await leagueService.replaceStandings(leagueId, draftToPayload(draftStandings))
                      toast.success("Standings updated")
                      setConfirmStandingsOpen(false)
                      setStandingsEdit(false)
                      await mutStand()
                    } catch (err: unknown) {
                      toast.error(getApiErrorMessage(err, "Could not save standings"))
                    } finally {
                      setSavingStandings(false)
                    }
                  }}
                >
                  {savingStandings ? "Saving…" : "Replace standings"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  )
}

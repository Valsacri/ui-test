"use client"

import useSWR from "swr"
import { Trophy, ChevronRight, Loader2 } from "lucide-react"
import type { PageRoute } from "@/lib/navigation"
import { leagueService } from "@/lib/services/league"
import { ErrorState } from "@/components/sporgates/ux/error-state"

interface LeaguesListPageProps {
  onNavigate: (page: PageRoute, id?: string) => void
}

export function LeaguesListPage({ onNavigate }: LeaguesListPageProps) {
  const { data: leagues, error, isLoading, mutate } = useSWR("leagues", () => leagueService.getAll(), {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  })

  const list = Array.isArray(leagues) ? leagues : (leagues as { content?: unknown[] })?.content ?? []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">Leagues</h1>
        <ErrorState title="Couldn't load leagues" message={error.message} onRetry={() => mutate()} />
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leagues</h1>
          <p className="text-sm text-muted-foreground">Active competitions and seasons</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("my-leagues")}
          className="text-sm font-semibold text-primary"
        >
          My leagues
        </button>
      </div>

      {list.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No active leagues yet. Organizers can create one from My leagues.
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((item: Record<string, unknown>) => (
            <button
              key={String(item.id)}
              type="button"
              onClick={() => onNavigate("league-detail", String(item.id))}
              className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:bg-muted/50"
            >
              <div className="gradient-secondary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{String(item.name ?? "")}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {String(item.status ?? "")}
                  {item.totalTeams != null ? ` · ${String(item.totalTeams)} teams` : ""}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

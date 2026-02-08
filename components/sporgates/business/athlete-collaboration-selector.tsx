"use client"

import { useMemo } from "react"
import { Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface Deliverable {
  id: string
  label: string
}

const deliverables: Record<"pre" | "during" | "post", Deliverable[]> = {
  pre: [
    { id: "announcement", label: "Announcement Post" },
    { id: "teaser", label: "Teaser Content" },
    { id: "stories", label: "Stories" },
    { id: "giveaway", label: "Ticket Giveaway" },
  ],
  during: [
    { id: "live", label: "Live Appearance" },
    { id: "social", label: "Real-time Posts" },
    { id: "bts", label: "Behind-the-scenes" },
  ],
  post: [
    { id: "recap", label: "Recap Video" },
    { id: "thankyou", label: "Thank You Post" },
    { id: "highlights", label: "Highlights" },
  ],
}

interface AthleteCollaborationSelectorProps {
  phase: "pre" | "during" | "post"
  athletes: Array<{
    id: string
    name: string
    sport: string
    followers: number
    ranking?: string
    avatar: string
    verified?: boolean
  }>
  selectedAthlete?: string
  onSelectAthlete: (id?: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedDeliverables: string[]
  onDeliverablesChange: (deliverables: string[]) => void
}

export function AthleteCollaborationSelector({
  phase,
  athletes,
  selectedAthlete,
  onSelectAthlete,
  searchQuery,
  onSearchChange,
  selectedDeliverables,
  onDeliverablesChange,
}: AthleteCollaborationSelectorProps) {
  const filteredAthletes = useMemo(() => {
    if (!searchQuery) return athletes
    const q = searchQuery.toLowerCase()
    return athletes.filter((athlete) =>
      [athlete.name, athlete.sport].some((value) => value.toLowerCase().includes(q))
    )
  }, [athletes, searchQuery])

  const toggleDeliverable = (id: string) => {
    onDeliverablesChange(
      selectedDeliverables.includes(id)
        ? selectedDeliverables.filter((item) => item !== id)
        : [...selectedDeliverables, id]
    )
  }

  const selected = athletes.find((athlete) => athlete.id === selectedAthlete)

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search athletes"
          className="h-10 w-full rounded-xl border border-border bg-muted pl-9 pr-3 text-xs outline-none focus:border-primary"
        />
      </div>

      {selected ? (
        <div className="rounded-xl border border-border bg-card p-3">
          <div className="flex items-start gap-3">
            <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">
              {selected.avatar}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                {selected.verified && <Check className="h-3 w-3 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground">{selected.sport} • {selected.followers.toLocaleString()} followers</p>
              {selected.ranking && (
                <p className="text-[10px] text-secondary">{selected.ranking}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onSelectAthlete(undefined)}
              className="text-[10px] font-semibold text-primary"
            >
              Clear
            </button>
          </div>

          <div className="mt-3">
            <p className="text-xs font-semibold text-muted-foreground">Deliverables</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {deliverables[phase].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleDeliverable(item.id)}
                  className={cn(
                    "rounded-full px-3 py-1 text-[10px] font-semibold",
                    selectedDeliverables.includes(item.id)
                      ? "bg-secondary text-white"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-h-56 space-y-2 overflow-y-auto">
          {filteredAthletes.map((athlete) => (
            <button
              key={athlete.id}
              type="button"
              onClick={() => onSelectAthlete(athlete.id)}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-all hover:shadow-md"
            >
              <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white">
                {athlete.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{athlete.name}</p>
                <p className="text-xs text-muted-foreground">{athlete.sport} • {athlete.followers.toLocaleString()} followers</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

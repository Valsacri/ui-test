"use client"

import { Zap, Trophy, TrendingUp, Target } from "lucide-react"

interface QuickStatsProps {
    totalActivities: number
    hoursPlayed: number
    sportsPlayed: number
    avgRating: number
}

const STAT_CONFIG = [
    { key: "totalActivities", label: "Activities Joined", icon: Zap, color: "text-secondary", bg: "bg-secondary/10" },
    { key: "hoursPlayed", label: "Hours Played", icon: Trophy, color: "text-primary", bg: "bg-primary/10" },
    { key: "sportsPlayed", label: "Sports Played", icon: TrendingUp, color: "text-secondary", bg: "bg-secondary/10" },
    { key: "avgRating", label: "Avg Rating", icon: Target, color: "text-primary", bg: "bg-primary/10" },
] as const

/** Grid of user stats (activities, hours, sports, rating). */
export function QuickStats(stats: QuickStatsProps) {
    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {STAT_CONFIG.map((cfg) => (
                <div
                    key={cfg.key}
                    className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                    <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${cfg.bg}`}>
                        <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                    </div>
                    <p className="text-xl font-bold text-foreground">{stats[cfg.key]}</p>
                    <p className="text-[11px] text-muted-foreground">{cfg.label}</p>
                </div>
            ))}
        </div>
    )
}

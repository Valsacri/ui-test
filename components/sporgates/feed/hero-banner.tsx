"use client"

import { ArrowRight, Calendar } from "lucide-react"
import { useAppRouter } from "@/lib/route-map"

interface HeroBannerProps {
    userName: string
    activityCount: number
}

/** Personalized welcome banner at the top of the home page. */
export function HeroBanner({ userName, activityCount }: HeroBannerProps) {
    const { navigate } = useAppRouter()

    return (
        <div className="gradient-hero relative overflow-hidden rounded-2xl p-6 text-white shadow-lg md:p-8">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-12 -right-12 h-56 w-56 rounded-full bg-white/5" />
            <div className="relative max-w-lg">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/80">
                    Welcome back
                </p>
                <h1 className="mb-2 text-2xl font-bold text-balance md:text-3xl">
                    Hey, {userName}!
                </h1>
                <p className="mb-4 text-sm leading-relaxed text-white/80">
                    {activityCount > 0
                        ? `You have ${activityCount} activities to explore. Keep up the momentum!`
                        : "Discover activities and join the community today!"}
                </p>
                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("explore")}
                        className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#003C66] transition-opacity hover:opacity-90"
                    >
                        Explore Now
                        <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("activities")}
                        className="flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                        <Calendar className="h-4 w-4" />
                        My Schedule
                    </button>
                </div>
            </div>
        </div>
    )
}

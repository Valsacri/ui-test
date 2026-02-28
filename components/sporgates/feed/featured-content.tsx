"use client"

import { ArrowRight } from "lucide-react"
import { ActivityCard } from "@/components/sporgates/cards/activity-card"
import { FacilityCard } from "@/components/sporgates/cards/facility-card"
import { ServiceCard } from "@/components/sporgates/cards/service-card"
import type { FacilityCardData, ServiceCardData } from "@/lib/types/explore"
import { useAppRouter } from "@/lib/route-map"

interface ActivityCardItem {
    id: string
    title: string
    sport: string
    date: string
    time: string
    location: string
    price: number
    currency: string
    spots: number
    totalSpots: number
    image: string
    rating: number
    reviews: number
    organizer: string
    organizerAvatar: string
    tags: string[]
}

interface FeaturedContentProps {
    activities: ActivityCardItem[]
    services: ServiceCardData[]
    facilities: FacilityCardData[]
}

/** Section header with a "See All" link. */
function SectionHeader({
    title,
    onSeeAll,
}: {
    title: string
    onSeeAll: () => void
}) {
    return (
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
            <button
                type="button"
                onClick={onSeeAll}
                className="flex items-center gap-1 text-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
            >
                See All <ArrowRight className="h-3 w-3" />
            </button>
        </div>
    )
}

/** Featured activities, services, and facilities below the feed. */
export function FeaturedContent({
    activities,
    services,
    facilities,
}: FeaturedContentProps) {
    const { navigate } = useAppRouter()

    return (
        <>
            {activities.length > 0 && (
                <div>
                    <SectionHeader title="Featured Activities" onSeeAll={() => navigate("activities")} />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activities.slice(0, 3).map((a) => (
                            <ActivityCard key={a.id} activity={a} onClick={() => navigate("activity-detail", a.id)} />
                        ))}
                    </div>
                </div>
            )}

            {services.length > 0 && (
                <div>
                    <SectionHeader title="Popular Services" onSeeAll={() => navigate("services")} />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {services.slice(0, 3).map((s) => (
                            <ServiceCard key={s.id} service={s} onClick={() => navigate("service-detail", s.id)} />
                        ))}
                    </div>
                </div>
            )}

            {facilities.length > 0 && (
                <div>
                    <SectionHeader title="Top Facilities" onSeeAll={() => navigate("facilities")} />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {facilities.slice(0, 2).map((f) => (
                            <FacilityCard key={f.id} facility={f} onClick={() => navigate("facility-detail", f.id)} />
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

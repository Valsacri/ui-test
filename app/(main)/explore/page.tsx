"use client"

import { ExplorePage } from "@/components/sporgates/pages/explore-page"
import { useAppRouter } from "@/lib/route-map"

export default function ExploreRoute() {
    const { navigate } = useAppRouter()
    return <ExplorePage onNavigate={navigate} />
}

"use client"

import { useParams } from "next/navigation"
import { ActivityDetailPage } from "@/components/sporgates/pages/activity-detail-page"
import { useAppRouter } from "@/lib/route-map"

export default function ActivityDetailRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    return <ActivityDetailPage activityId={id} onNavigate={navigate} />
}

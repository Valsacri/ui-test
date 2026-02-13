"use client"

import { ActivitiesPage } from "@/components/sporgates/pages/activities-page"
import { useAppRouter } from "@/lib/route-map"

export default function ActivitiesRoute() {
    const { navigate } = useAppRouter()
    return <ActivitiesPage onNavigate={navigate} />
}

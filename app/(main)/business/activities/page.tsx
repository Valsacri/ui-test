"use client"

import { BusinessActivitiesPage } from "@/components/sporgates/pages/business-pages"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessActivitiesRoute() {
    const { navigate } = useAppRouter()
    return <BusinessActivitiesPage onNavigate={navigate} />
}

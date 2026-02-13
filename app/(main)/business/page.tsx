"use client"

import { BusinessDashboardPage } from "@/components/sporgates/pages/business-dashboard-page"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessDashboardRoute() {
    const { navigate } = useAppRouter()
    return <BusinessDashboardPage onNavigate={navigate} />
}

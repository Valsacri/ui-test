"use client"

import { SquadDashboardPage } from "@/components/sporgates/pages/squad-dashboard-page"
import { useAppRouter } from "@/lib/route-map"

export default function SquadDashboardRoute() {
    const { navigate } = useAppRouter()
    return <SquadDashboardPage onNavigate={navigate} />
}

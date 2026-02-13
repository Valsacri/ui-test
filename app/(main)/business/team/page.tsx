"use client"

import { BusinessTeamPage } from "@/components/sporgates/pages/business-pages"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessTeamRoute() {
    const { navigate } = useAppRouter()
    return <BusinessTeamPage onNavigate={navigate} />
}

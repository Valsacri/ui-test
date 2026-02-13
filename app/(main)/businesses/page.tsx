"use client"

import { BusinessesPage } from "@/components/sporgates/pages/businesses-page"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessesRoute() {
    const { navigate } = useAppRouter()
    return <BusinessesPage onNavigate={navigate} />
}

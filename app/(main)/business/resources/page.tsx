"use client"

import { BusinessResourcesPage } from "@/components/sporgates/pages/business-pages"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessResourcesRoute() {
    const { navigate } = useAppRouter()
    return <BusinessResourcesPage onNavigate={navigate} />
}

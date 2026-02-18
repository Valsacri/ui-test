"use client"

import { BusinessResourcesPage } from "@/components/sporgates/pages/business-pages"
import { useAppRouter } from "@/lib/route-map"
import { useSearchParams } from "next/navigation"

export default function BusinessResourcesRoute() {
    const { navigate } = useAppRouter()
    const searchParams = useSearchParams()
    const tab = searchParams.get("tab") as "facility" | "product" | "service" | null
    return <BusinessResourcesPage onNavigate={navigate} initialTab={tab || undefined} />
}

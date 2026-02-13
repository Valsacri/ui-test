"use client"

import { useParams } from "next/navigation"
import { BusinessDetailPage } from "@/components/sporgates/pages/business-detail-page"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessDetailRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    return <BusinessDetailPage businessId={id} onNavigate={navigate} />
}

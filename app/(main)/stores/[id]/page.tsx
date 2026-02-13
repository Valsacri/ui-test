"use client"

import { useParams } from "next/navigation"
import { StoreDetailPage } from "@/components/sporgates/pages/store-detail-page"
import { useAppRouter } from "@/lib/route-map"

export default function StoreDetailRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    return <StoreDetailPage businessId={id} onNavigate={navigate} />
}

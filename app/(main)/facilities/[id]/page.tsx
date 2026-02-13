"use client"

import { useParams } from "next/navigation"
import { FacilityDetailPage } from "@/components/sporgates/pages/facility-detail-page"
import { useAppRouter } from "@/lib/route-map"

export default function FacilityDetailRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    return <FacilityDetailPage facilityId={id} onNavigate={navigate} />
}

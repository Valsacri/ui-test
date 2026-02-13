"use client"

import { useParams } from "next/navigation"
import { ServiceDetailPage } from "@/components/sporgates/pages/service-detail-page"
import { useAppRouter } from "@/lib/route-map"

export default function ServiceDetailRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    return <ServiceDetailPage serviceId={id} onNavigate={navigate} />
}

"use client"

import { useParams } from "next/navigation"
import { BusinessJobDetailPage } from "@/components/sporgates/pages/business-job-detail-page"
import { useAppRouter } from "@/lib/route-map"
import { useBusinessContext } from "@/lib/business-context"

export default function BusinessJobDetailRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    const { activeBusinessId } = useBusinessContext()
    return <BusinessJobDetailPage jobId={id} onNavigate={navigate} activeBusinessId={activeBusinessId} />
}

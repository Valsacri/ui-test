"use client"

import { useParams } from "next/navigation"
import { JobDetailPage } from "@/components/sporgates/pages/job-detail-page"
import { useAppRouter } from "@/lib/route-map"

export default function JobDetailRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    return <JobDetailPage jobId={id} onNavigate={navigate} />
}

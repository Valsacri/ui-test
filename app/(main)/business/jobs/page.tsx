"use client"

import { JobsPage } from "@/components/sporgates/pages/jobs-page"
import { useAppRouter } from "@/lib/route-map"
import { useBusinessContext } from "@/lib/business-context"

export default function BusinessJobsRoute() {
    const { navigate } = useAppRouter()
    const { activeBusinessId } = useBusinessContext()
    return <JobsPage onNavigate={navigate} isBusinessMode={true} activeBusinessId={activeBusinessId} />
}

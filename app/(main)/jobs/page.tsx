"use client"

import { JobsPage } from "@/components/sporgates/pages/jobs-page"
import { useAppRouter } from "@/lib/route-map"

export default function JobsRoute() {
    const { navigate } = useAppRouter()
    return <JobsPage onNavigate={navigate} />
}

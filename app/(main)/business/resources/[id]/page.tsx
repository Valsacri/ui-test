"use client"

import { BusinessResourceDetailPage } from "@/components/sporgates/pages/business-resource-detail-page"
import { useAppRouter } from "@/lib/route-map"
import { useParams } from "next/navigation"

export default function BusinessResourceDetailRoute() {
    const { navigate } = useAppRouter()
    const params = useParams()
    const raw = decodeURIComponent((params?.id as string) || "")
    const sepIdx = raw.indexOf("--")
    const resourceType = (sepIdx > 0 ? raw.slice(0, sepIdx) : "facility") as "facility" | "product" | "service"
    const resourceId = sepIdx > 0 ? raw.slice(sepIdx + 2) : raw

    return (
        <BusinessResourceDetailPage
            resourceId={resourceId}
            resourceType={resourceType}
            onNavigate={navigate}
        />
    )
}

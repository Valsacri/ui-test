"use client"

import { AddResourcePage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"
import { useParams } from "next/navigation"

export default function EditResourceRoute() {
    const { navigate } = useAppRouter()
    const params = useParams()
    const raw = decodeURIComponent((params?.id as string) || "")
    const sepIdx = raw.indexOf("--")
    const editResourceType = (sepIdx > 0 ? raw.slice(0, sepIdx) : "facility") as "facility" | "product" | "service"
    const resourceId = sepIdx > 0 ? raw.slice(sepIdx + 2) : raw

    return (
        <AddResourcePage
            onNavigate={navigate}
            resourceId={resourceId}
            editResourceType={editResourceType}
        />
    )
}

"use client"

import { ManageResourcesPage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function ManageResourcesRoute() {
    const { navigate } = useAppRouter()
    return <ManageResourcesPage onNavigate={navigate} />
}

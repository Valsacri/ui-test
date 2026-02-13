"use client"

import { TeamManagementPage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function TeamManagementRoute() {
    const { navigate } = useAppRouter()
    return <TeamManagementPage onNavigate={navigate} />
}

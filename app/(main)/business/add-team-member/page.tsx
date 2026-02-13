"use client"

import { AddTeamMemberPage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function AddTeamMemberRoute() {
    const { navigate } = useAppRouter()
    return <AddTeamMemberPage onNavigate={navigate} />
}

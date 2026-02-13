"use client"

import { AddCollaborationPage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function AddCollaborationRoute() {
    const { navigate } = useAppRouter()
    return <AddCollaborationPage onNavigate={navigate} />
}

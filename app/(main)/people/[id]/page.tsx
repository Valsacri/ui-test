"use client"

import { useParams } from "next/navigation"
import { PersonDetailPage } from "@/components/sporgates/pages/person-detail-page"
import { useAppRouter } from "@/lib/route-map"

export default function PersonDetailRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    return <PersonDetailPage personId={id} onNavigate={navigate} />
}

"use client"

import { useParams } from "next/navigation"
import { SquadDetailPage } from "@/components/sporgates/pages/squad-detail-page"
import { useAppRouter } from "@/lib/route-map"

export default function SquadDetailRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    return <SquadDetailPage squadId={id} onNavigate={navigate} />
}

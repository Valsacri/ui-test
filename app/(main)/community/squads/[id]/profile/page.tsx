"use client"

import { useParams } from "next/navigation"
import { SquadProfilePage } from "@/components/sporgates/pages/squad-profile-page"
import { useAppRouter } from "@/lib/route-map"

export default function SquadProfileRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    return <SquadProfilePage squadId={id} onNavigate={navigate} />
}

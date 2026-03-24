"use client"

import { useParams } from "next/navigation"
import { OrganizerPortfolio } from "@/components/sporgates/business/organizer-portfolio"
import { useAppRouter } from "@/lib/route-map"

export default function PortfolioRoute() {
    const { id } = useParams<{ id: string }>()
    const { navigate } = useAppRouter()
    return <OrganizerPortfolio businessId={id} canManage={false} onClose={() => navigate("business-detail", id)} />
}

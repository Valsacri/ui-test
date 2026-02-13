"use client"

import { CommunityPage } from "@/components/sporgates/pages/community-page"
import { useAppRouter } from "@/lib/route-map"

export default function CommunityRoute() {
    const { navigate } = useAppRouter()
    return <CommunityPage onNavigate={navigate} />
}

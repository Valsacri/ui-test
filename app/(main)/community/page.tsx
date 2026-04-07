"use client"

import { Suspense } from "react"
import { CommunityPage } from "@/components/sporgates/pages/community-page"
import { useAppRouter } from "@/lib/route-map"

function CommunityRouteInner() {
    const { navigate } = useAppRouter()
    return <CommunityPage onNavigate={navigate} />
}

export default function CommunityRoute() {
    return (
        <Suspense fallback={<div className="mx-auto max-w-6xl p-6 text-sm text-muted-foreground">Loading community…</div>}>
            <CommunityRouteInner />
        </Suspense>
    )
}

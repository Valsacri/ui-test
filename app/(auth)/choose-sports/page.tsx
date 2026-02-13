"use client"

import { AuthPages } from "@/components/sporgates/pages/auth-pages"
import { useAppRouter } from "@/lib/route-map"

export default function ChooseSportsRoute() {
    const { navigate } = useAppRouter()
    return <AuthPages page="choose-sports" onNavigate={navigate} />
}

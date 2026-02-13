"use client"

import { AuthPages } from "@/components/sporgates/pages/auth-pages"
import { useAppRouter } from "@/lib/route-map"

export default function SetGoalsRoute() {
    const { navigate } = useAppRouter()
    return <AuthPages page="set-goals" onNavigate={navigate} />
}

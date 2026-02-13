"use client"

import { HomePage } from "@/components/sporgates/pages/home-page"
import { useAppRouter } from "@/lib/route-map"

export default function HomeRoute() {
    const { navigate } = useAppRouter()
    return <HomePage onNavigate={navigate} />
}

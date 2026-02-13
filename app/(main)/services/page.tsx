"use client"

import { ServicesPage } from "@/components/sporgates/pages/services-page"
import { useAppRouter } from "@/lib/route-map"

export default function ServicesRoute() {
    const { navigate } = useAppRouter()
    return <ServicesPage onNavigate={navigate} />
}

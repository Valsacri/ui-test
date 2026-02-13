"use client"

import { FacilitiesPage } from "@/components/sporgates/pages/facilities-page"
import { useAppRouter } from "@/lib/route-map"

export default function FacilitiesRoute() {
    const { navigate } = useAppRouter()
    return <FacilitiesPage onNavigate={navigate} />
}

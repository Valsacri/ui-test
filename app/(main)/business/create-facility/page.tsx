"use client"

import { CreateFacilityPage } from "@/components/sporgates/pages/create-facility-page"
import { useAppRouter } from "@/lib/route-map"

export default function CreateFacilityRoute() {
    const { navigate } = useAppRouter()
    return <CreateFacilityPage onNavigate={navigate} />
}

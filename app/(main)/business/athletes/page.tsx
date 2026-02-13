"use client"

import { BusinessAthletesPage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessAthletesRoute() {
    const { navigate } = useAppRouter()
    return <BusinessAthletesPage onNavigate={navigate} />
}

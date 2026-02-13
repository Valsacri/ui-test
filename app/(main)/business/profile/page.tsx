"use client"

import { BusinessProfilePage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessProfileRoute() {
    const { navigate } = useAppRouter()
    return <BusinessProfilePage onNavigate={navigate} />
}

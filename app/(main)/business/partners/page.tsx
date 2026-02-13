"use client"

import { BusinessPartnersPage } from "@/components/sporgates/pages/business-pages"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessPartnersRoute() {
    const { navigate } = useAppRouter()
    return <BusinessPartnersPage onNavigate={navigate} />
}

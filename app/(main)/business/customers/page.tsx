"use client"

import { BusinessCustomersPage } from "@/components/sporgates/pages/business-pages"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessCustomersRoute() {
    const { navigate } = useAppRouter()
    return <BusinessCustomersPage onNavigate={navigate} />
}

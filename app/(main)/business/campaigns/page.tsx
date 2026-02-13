"use client"

import { BusinessCampaignsPage } from "@/components/sporgates/pages/business-pages"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessCampaignsRoute() {
    const { navigate } = useAppRouter()
    return <BusinessCampaignsPage onNavigate={navigate} />
}

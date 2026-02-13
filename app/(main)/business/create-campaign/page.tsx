"use client"

import { CreateCampaignPage } from "@/components/sporgates/pages/business-forms"
import { useAppRouter } from "@/lib/route-map"

export default function CreateCampaignRoute() {
    const { navigate } = useAppRouter()
    return <CreateCampaignPage onNavigate={navigate} />
}

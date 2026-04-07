"use client"

import { CampaignPlacementPage } from "@/components/sporgates/pages/campaign-placement-page"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessCampaignPlacementRoute() {
  const { navigate } = useAppRouter()
  return <CampaignPlacementPage onNavigate={navigate} />
}

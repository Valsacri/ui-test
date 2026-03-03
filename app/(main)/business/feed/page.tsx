"use client"

import { BusinessFeedPage } from "@/components/sporgates/pages/business-feed-page"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessFeedRoute() {
  const { navigate } = useAppRouter()
  return <BusinessFeedPage onNavigate={navigate} />
}

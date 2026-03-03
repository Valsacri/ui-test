"use client"

import { BusinessAnalyticsPage } from "@/components/sporgates/pages/business-pages"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessDashboardRoute() {
  const { navigate } = useAppRouter()
  return <BusinessAnalyticsPage onNavigate={navigate} />
}

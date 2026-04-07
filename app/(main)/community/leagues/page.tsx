"use client"

import { LeaguesListPage } from "@/components/sporgates/pages/leagues-list-page"
import { useAppRouter } from "@/lib/route-map"

export default function LeaguesListRoute() {
  const { navigate } = useAppRouter()
  return <LeaguesListPage onNavigate={navigate} />
}

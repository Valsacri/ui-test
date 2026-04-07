"use client"

import { useParams } from "next/navigation"
import { LeagueDetailPage } from "@/components/sporgates/pages/league-detail-page"
import { useAppRouter } from "@/lib/route-map"

export default function LeagueDetailRoute() {
  const params = useParams()
  const id = typeof params.id === "string" ? params.id : ""
  const { navigate } = useAppRouter()
  return <LeagueDetailPage leagueId={id} onNavigate={navigate} />
}

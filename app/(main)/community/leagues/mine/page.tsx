"use client"

import { MyLeaguesPage } from "@/components/sporgates/pages/my-leagues-page"
import { useAppRouter } from "@/lib/route-map"

export default function MyLeaguesRoute() {
  const { navigate } = useAppRouter()
  return <MyLeaguesPage onNavigate={navigate} />
}

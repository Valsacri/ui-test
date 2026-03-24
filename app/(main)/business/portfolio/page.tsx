"use client"

import { OrganizerPortfolio } from "@/components/sporgates/business/organizer-portfolio"
import { useBusinessContext } from "@/lib/business-context"
import { useAppRouter } from "@/lib/route-map"

export default function BusinessPortfolioPage() {
  const { activeBusinessId } = useBusinessContext()
  const { navigate } = useAppRouter()

  if (!activeBusinessId) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
        Select a business profile first to manage organizer portfolio.
      </div>
    )
  }

  return (
    <OrganizerPortfolio
      businessId={activeBusinessId}
      canManage={true}
      onClose={() => navigate("business-dashboard")}
    />
  )
}

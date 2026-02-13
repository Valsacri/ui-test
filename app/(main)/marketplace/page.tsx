"use client"

import { MarketplacePage } from "@/components/sporgates/pages/marketplace-page"
import { useAppRouter } from "@/lib/route-map"
import { useBusinessContext } from "@/lib/business-context"

export default function MarketplaceRoute() {
    const { navigate } = useAppRouter()
    const { isBusinessMode } = useBusinessContext()
    return <MarketplacePage onNavigate={navigate} isBusinessMode={isBusinessMode} />
}

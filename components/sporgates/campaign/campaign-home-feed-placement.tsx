"use client"

import { useEffect, useRef } from "react"
import { Megaphone } from "lucide-react"
import { recordCampaignDeliveryEventAction } from "@/actions/campaign-delivery"
import type { RecordCampaignDeliveryResult } from "@/actions/campaign-delivery"
import { Button } from "@/components/ui/button"
import { authService } from "@/lib/services"
import { useAppRouter } from "@/lib/route-map"
import { cn } from "@/lib/utils"
import type { ServedCampaignPlacement } from "@/lib/types/campaign-delivery"

type Props = {
  /** Loaded in the parent Server Component (no client fetch). */
  served: ServedCampaignPlacement | null
  className?: string
}

/**
 * Renders a served campaign for HOME_FEED; records impression/click via server actions
 * (cookies forwarded server-side — no localStorage JWT).
 */
export function CampaignHomeFeedPlacement({ served, className }: Props) {
  const { navigate } = useAppRouter()
  const userId = authService.getCurrentUser()?.id
  const adRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!served || !userId) return
    if (typeof window === "undefined") return
    const dayKey = new Date().toISOString().slice(0, 10) // UTC date key for stable daily dedupe
    const sessionKey = `spg_camp_imp_${served.placement}_${served.campaignId}_${served.creativeId}_${dayKey}`
    if (window.sessionStorage.getItem(sessionKey)) return

    const el = adRef.current
    if (!el) return

    let impressionRecorded = false
    let timeoutId: number | null = null

    const recordImpression = () => {
      if (impressionRecorded) return
      impressionRecorded = true
      window.sessionStorage.setItem(sessionKey, "1")
      void recordCampaignDeliveryEventAction({
        placement: "HOME_FEED",
        eventKey: `impression:${served.placement}:${served.campaignId}:${served.creativeId}:${dayKey}`,
        campaignId: served.campaignId,
        creativeId: served.creativeId,
        type: "IMPRESSION",
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return

        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.5

        if (visible) {
          if (timeoutId == null) {
            timeoutId = window.setTimeout(() => {
              timeoutId = null
              recordImpression()
            }, 1000) // 1s sustained visibility
          }
        } else {
          if (timeoutId != null) {
            window.clearTimeout(timeoutId)
            timeoutId = null
          }
        }
      },
      { threshold: [0, 0.5, 1] }
    )

    observer.observe(el)

    return () => {
      if (timeoutId != null) window.clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [served, userId])

  if (!userId || !served) {
    return null
  }

  const handleCta = async () => {
    const eventKey =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `click_${Date.now()}_${Math.random()}`

    // Reliability: try to persist click before navigation, but don't block forever.
    const timeoutMs = 1500
    const timeoutPromise: Promise<RecordCampaignDeliveryResult> = new Promise((resolve) =>
      window.setTimeout(() => resolve({ ok: false, error: "timeout" }), timeoutMs)
    )

    const result: RecordCampaignDeliveryResult = await Promise.race([
      recordCampaignDeliveryEventAction({
        placement: "HOME_FEED",
        eventKey: `click:${served.placement}:${served.campaignId}:${served.creativeId}:${eventKey}`,
        campaignId: served.campaignId,
        creativeId: served.creativeId,
        type: "CLICK",
      }),
      timeoutPromise,
    ])

    // Even if click measurement times out, we still navigate.
    if (!result.ok) {
      // no-op
    }
    navigate("business-detail", served.businessId)
  }

  return (
    <div
      ref={adRef}
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-sm",
        className
      )}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary">
        <Megaphone className="h-4 w-4" aria-hidden />
        Sponsored
      </div>
      <p className="text-sm font-semibold text-foreground">{served.headline}</p>
      <p className="mt-1 text-xs text-muted-foreground">{served.primaryText}</p>
      <Button
        type="button"
        size="sm"
        className="mt-3 font-semibold"
        onClick={handleCta}
      >
        {served.cta || "Learn more"}
      </Button>
    </div>
  )
}

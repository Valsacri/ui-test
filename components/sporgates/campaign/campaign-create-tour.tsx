"use client"

import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { ChevronLeft, ChevronRight, HelpCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const CAMPAIGN_CREATE_TOUR_STORAGE_KEY = "sporgates.campaignCreateTour.v1"

export type CampaignCreateTourStep = {
  /** `data-campaign-tour` value on the target element */
  target: string
  title: string
  body: string
}

/** Default copy for the create-campaign guided tour */
export const CAMPAIGN_CREATE_TOUR_STEPS: CampaignCreateTourStep[] = [
  {
    target: "header",
    title: "Create a marketing campaign",
    body: "This screen walks you through launching a campaign: name it, pick a goal, set budget and dates, choose who sees it, and plan how you communicate before, during, and after your event.",
  },
  {
    target: "details",
    title: "Campaign details",
    body: "Give your campaign a clear name and description so your team knows what it is. Choose a goal—awareness, bookings, or engagement—so later reporting matches what you are trying to achieve.",
  },
  {
    target: "budget",
    title: "Budget & schedule",
    body: "Set how much you want to spend and when the campaign runs. The estimate helps you think about reach; you can adjust budget and dates before you go live.",
  },
  {
    target: "audience",
    title: "Target audience",
    body: "Narrow who should see your campaign—everyone, athletes, beginners, or people near you. This helps focus spend on people most likely to care about your activities.",
  },
  {
    target: "communication",
    title: "Communication plan",
    body: "Plan messaging for before, during, and after your event—print, athlete collaboration, and deliverables. Switch tabs to configure each phase so promotion stays consistent end to end.",
  },
  {
    target: "actions",
    title: "Save or launch",
    body: "Cancel returns you to campaigns without saving this draft. Launch Campaign confirms you are ready—use it when details, budget, audience, and comms look right.",
  },
]

type Rect = { top: number; left: number; width: number; height: number }

const PADDING = 10
/** Used for tooltip placement when flipping above/below the highlight */
const ESTIMATED_PANEL_HEIGHT = 220

function getTargetRect(el: Element | null): Rect | null {
  if (!el || !(el instanceof HTMLElement)) return null
  const r = el.getBoundingClientRect()
  if (r.width < 2 && r.height < 2) return null
  return {
    top: r.top - PADDING,
    left: r.left - PADDING,
    width: r.width + PADDING * 2,
    height: r.height + PADDING * 2,
  }
}

function placeTooltip(
  hole: Rect,
  panelW: number,
  panelH: number
): { top: number; left: number } {
  const margin = 12
  const vw = typeof window !== "undefined" ? window.innerWidth : 800
  const vh = typeof window !== "undefined" ? window.innerHeight : 600
  const cx = hole.left + hole.width / 2
  let top = hole.top + hole.height + margin
  let left = cx - panelW / 2
  if (top + panelH > vh - margin) {
    top = hole.top - panelH - margin
  }
  left = Math.max(margin, Math.min(left, vw - panelW - margin))
  top = Math.max(margin, Math.min(top, vh - panelH - margin))
  return { top, left }
}

type CampaignCreateTourProps = {
  steps: CampaignCreateTourStep[]
  /** When false, tour UI is not shown (e.g. after complete/skip). */
  active: boolean
  onClose: () => void
  /** Optional class for the floating panel */
  className?: string
}

/**
 * Spotlight + floating card for the create-campaign flow.
 * Targets elements with `data-campaign-tour="<target>"`.
 */
export function CampaignCreateTour({ steps, active, onClose, className }: CampaignCreateTourProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [hole, setHole] = useState<Rect | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ top: 120, left: 16 })
  const panelW = 320
  const panelH = ESTIMATED_PANEL_HEIGHT

  const current = steps[stepIndex]
  const isLast = stepIndex >= steps.length - 1

  const updateGeometry = useCallback(() => {
    if (!active || !current) return
    const el = document.querySelector(`[data-campaign-tour="${current.target}"]`)
    const rect = getTargetRect(el)
    if (!rect) {
      setHole(null)
      return
    }
    setHole(rect)
    el instanceof HTMLElement && el.scrollIntoView({ block: "center", behavior: "smooth" })
    requestAnimationFrame(() => {
      const again = getTargetRect(document.querySelector(`[data-campaign-tour="${current.target}"]`))
      if (!again) return
      setHole(again)
      setTooltipPos(placeTooltip(again, panelW, panelH))
    })
  }, [active, current, panelW, panelH])

  useLayoutEffect(() => {
    updateGeometry()
  }, [updateGeometry, stepIndex])

  useEffect(() => {
    if (!active) return
    const onWin = () => updateGeometry()
    window.addEventListener("resize", onWin)
    window.addEventListener("scroll", onWin, true)
    return () => {
      window.removeEventListener("resize", onWin)
      window.removeEventListener("scroll", onWin, true)
    }
  }, [active, updateGeometry])

  useEffect(() => {
    if (active) setStepIndex(0)
  }, [active])

  const finish = useCallback(() => {
    try {
      localStorage.setItem(CAMPAIGN_CREATE_TOUR_STORAGE_KEY, "1")
    } catch {
      /* ignore */
    }
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [active, finish])

  const goNext = () => {
    if (isLast) finish()
    else setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1))

  if (!active || !current || steps.length === 0) return null

  const { top: t, left: l, width: w, height: h } = hole ?? {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  }
  const vw = typeof window !== "undefined" ? window.innerWidth : 0
  const vh = typeof window !== "undefined" ? window.innerHeight : 0
  const hasHole = hole && w > 0 && h > 0

  return (
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-labelledby="campaign-tour-title">
      {hasHole ? (
        <>
          <div className="fixed z-[201] bg-black/50" style={{ top: 0, left: 0, width: vw, height: Math.max(0, t) }} />
          <div className="fixed z-[201] bg-black/50" style={{ top: t + h, left: 0, width: vw, height: Math.max(0, vh - t - h) }} />
          <div className="fixed z-[201] bg-black/50" style={{ top: t, left: 0, width: Math.max(0, l), height: h }} />
          <div className="fixed z-[201] bg-black/50" style={{ top: t, left: l + w, width: Math.max(0, vw - l - w), height: h }} />
          <div
            className="fixed z-[202] rounded-xl ring-2 ring-primary/80 ring-offset-2 ring-offset-transparent shadow-[0_0_0_1px_rgba(255,255,255,0.15)]"
            style={{ top: t, left: l, width: w, height: h, pointerEvents: "none" }}
            aria-hidden
          />
        </>
      ) : (
        <div className="fixed inset-0 z-[201] bg-black/50" />
      )}

      <div
        className={cn(
          "fixed z-[203] w-[min(100vw-2rem,20rem)] rounded-2xl border border-border bg-card p-4 shadow-xl",
          className
        )}
        style={{ top: tooltipPos.top, left: tooltipPos.left, maxWidth: panelW }}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Step {stepIndex + 1} of {steps.length}
            </p>
            <h2 id="campaign-tour-title" className="text-sm font-bold text-foreground">
              {current.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={finish}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Skip tour"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">{current.body}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
          <Button type="button" variant="ghost" size="sm" className="text-xs" onClick={finish}>
            Skip tour
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={goBack} disabled={stepIndex === 0} className="text-xs">
              <ChevronLeft className="h-3.5 w-3.5" />
              Back
            </Button>
            <Button type="button" size="sm" onClick={goNext} className="text-xs">
              {isLast ? "Done" : "Next"}
              {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function useCampaignCreateTour() {
  const [tourActive, setTourActive] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
    try {
      if (localStorage.getItem(CAMPAIGN_CREATE_TOUR_STORAGE_KEY) !== "1") {
        setTourActive(true)
      }
    } catch {
      setTourActive(true)
    }
  }, [])

  const startTour = useCallback(() => {
    try {
      localStorage.removeItem(CAMPAIGN_CREATE_TOUR_STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setTourActive(true)
  }, [])

  const endTour = useCallback(() => {
    setTourActive(false)
  }, [])

  return { tourActive, hydrated, startTour, endTour }
}

export function CampaignTourHelpButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <Button type="button" variant="outline" size="sm" className={cn("gap-1.5 text-xs", className)} onClick={onClick}>
      <HelpCircle className="h-3.5 w-3.5" />
      Tour
    </Button>
  )
}

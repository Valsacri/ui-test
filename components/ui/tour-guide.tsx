"use client"

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, HelpCircle, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type TourStep = {
  /** Value of the target attribute on the element. Example: data-tour="header" -> target: "header" */
  target: string
  title: string
  body: string
}

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

function placeTooltip(hole: Rect, panelW: number, panelH: number): { top: number; left: number } {
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

export type TourGuideProps = {
  /** Steps for the tour. */
  steps: TourStep[]
  /** When false, tour UI is not shown. */
  active: boolean
  /** Called after the tour is closed (skip/done/esc). */
  onClose: () => void
  /** localStorage key used to persist completion (value "1"). */
  storageKey: string
  /** Attribute name used for targets. Defaults to "data-tour". */
  targetAttribute?: string
  /** Width used for tooltip placement calculations. */
  panelWidth?: number
  className?: string
}

export function TourGuide({
  steps,
  active,
  onClose,
  storageKey,
  targetAttribute = "data-tour",
  panelWidth = 320,
  className,
}: TourGuideProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [hole, setHole] = useState<Rect | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ top: 120, left: 16 })
  const panelW = panelWidth
  const panelH = ESTIMATED_PANEL_HEIGHT

  const current = steps[stepIndex]
  const isLast = stepIndex >= steps.length - 1

  const selector = useMemo(() => {
    const escaped = CSS?.escape ? CSS.escape(current?.target ?? "") : (current?.target ?? "")
    return `[${targetAttribute}="${escaped}"]`
  }, [current?.target, targetAttribute])

  const finish = useCallback(() => {
    try {
      localStorage.setItem(storageKey, "1")
    } catch {
      /* ignore */
    }
    onClose()
  }, [onClose, storageKey])

  const updateGeometry = useCallback(() => {
    if (!active || !current) return
    const el = document.querySelector(selector)
    const rect = getTargetRect(el)
    if (!rect) {
      setHole(null)
      return
    }
    setHole(rect)
    el instanceof HTMLElement && el.scrollIntoView({ block: "center", behavior: "smooth" })
    requestAnimationFrame(() => {
      const again = getTargetRect(document.querySelector(selector))
      if (!again) return
      setHole(again)
      setTooltipPos(placeTooltip(again, panelW, panelH))
    })
  }, [active, current, panelW, panelH, selector])

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

  const { top: t, left: l, width: w, height: h } = hole ?? { top: 0, left: 0, width: 0, height: 0 }
  const vw = typeof window !== "undefined" ? window.innerWidth : 0
  const vh = typeof window !== "undefined" ? window.innerHeight : 0
  const hasHole = hole && w > 0 && h > 0

  return (
    <div className="fixed inset-0 z-[200]" role="dialog" aria-modal="true" aria-labelledby="tour-title">
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
            <h2 id="tour-title" className="text-sm font-bold text-foreground">
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

export function useTour(storageKey: string) {
  const [tourActive, setTourActive] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
    try {
      if (localStorage.getItem(storageKey) !== "1") setTourActive(true)
    } catch {
      setTourActive(true)
    }
  }, [storageKey])

  const startTour = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
    } catch {
      /* ignore */
    }
    setTourActive(true)
  }, [storageKey])

  const endTour = useCallback(() => setTourActive(false), [])

  return { tourActive, hydrated, startTour, endTour }
}

export function TourHelpButton({ onClick, className, label = "Tour" }: { onClick: () => void; className?: string; label?: string }) {
  return (
    <Button type="button" variant="outline" size="sm" className={cn("gap-1.5 text-xs", className)} onClick={onClick}>
      <HelpCircle className="h-3.5 w-3.5" />
      {label}
    </Button>
  )
}


"use client"

import { useEffect, useRef, useState } from "react"
import { RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

interface PullToRefreshProps {
  children: React.ReactNode
  onRefresh: () => Promise<void>
  threshold?: number
  disabled?: boolean
}

export function PullToRefresh({ children, onRefresh, threshold = 80, disabled = false }: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const [pull, setPull] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container || disabled) return

    const handleTouchStart = (event: TouchEvent) => {
      if (window.scrollY === 0) {
        startY.current = event.touches[0].clientY
        setIsPulling(true)
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (!isPulling || isRefreshing || window.scrollY > 0) return
      const currentY = event.touches[0].clientY
      const diff = currentY - startY.current
      if (diff > 0) {
        event.preventDefault()
        const resistance = Math.min(diff * 0.5, threshold * 1.5)
        setPull(resistance)
      }
    }

    const handleTouchEnd = async () => {
      if (!isPulling || isRefreshing) return
      setIsPulling(false)

      if (pull >= threshold) {
        setIsRefreshing(true)
        setPull(threshold)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
          setPull(0)
        }
      } else {
        setPull(0)
      }
    }

    container.addEventListener("touchstart", handleTouchStart, { passive: true })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd)

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [disabled, isPulling, isRefreshing, onRefresh, pull, threshold])

  return (
    <div ref={containerRef} className="relative">
      <div
        className="absolute left-0 right-0 top-0 flex items-center justify-center"
        style={{ height: pull, opacity: pull > 0 ? 1 : 0 }}
      >
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground",
            isRefreshing && "animate-spin"
          )}
          style={{ transform: `rotate(${(pull / threshold) * 360}deg)` }}
        >
          <RefreshCw className="h-4 w-4" />
        </div>
      </div>
      <div style={{ transform: `translateY(${pull}px)` }}>{children}</div>
    </div>
  )
}

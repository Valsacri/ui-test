"use client"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SwipeAction {
  icon: React.ElementType
  label: string
  color: string
  bgColor: string
  onAction: () => void
}

interface SwipeableCardProps {
  children: React.ReactNode
  leftAction?: SwipeAction
  rightAction?: SwipeAction
  threshold?: number
  disabled?: boolean
}

export function SwipeableCard({
  children,
  leftAction,
  rightAction,
  threshold = 100,
  disabled = false,
}: SwipeableCardProps) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef(0)

  if (disabled) {
    return <>{children}</>
  }

  const handleStart = (clientX: number) => {
    startX.current = clientX
    setDragging(true)
  }

  const handleMove = (clientX: number) => {
    if (!dragging) return
    const delta = clientX - startX.current
    setOffset(Math.max(Math.min(delta, threshold * 1.2), -threshold * 1.2))
  }

  const handleEnd = () => {
    if (!dragging) return
    setDragging(false)
    if (offset > threshold && leftAction) {
      leftAction.onAction()
    } else if (offset < -threshold && rightAction) {
      rightAction.onAction()
    }
    setOffset(0)
  }

  return (
    <div className="relative overflow-hidden">
      {leftAction && (
        <div className={cn("absolute inset-y-0 left-0 flex items-center px-6", leftAction.bgColor)}>
          <div className="flex items-center gap-2">
            <leftAction.icon className={cn("h-5 w-5", leftAction.color)} />
            <span className={cn("text-sm font-semibold", leftAction.color)}>{leftAction.label}</span>
          </div>
        </div>
      )}
      {rightAction && (
        <div className={cn("absolute inset-y-0 right-0 flex items-center px-6", rightAction.bgColor)}>
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-semibold", rightAction.color)}>{rightAction.label}</span>
            <rightAction.icon className={cn("h-5 w-5", rightAction.color)} />
          </div>
        </div>
      )}

      <div
        className={cn("relative transition-transform", dragging ? "cursor-grabbing" : "cursor-grab")}
        style={{ transform: `translateX(${offset}px)` }}
        onMouseDown={(event) => handleStart(event.clientX)}
        onMouseMove={(event) => dragging && handleMove(event.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(event) => handleStart(event.touches[0].clientX)}
        onTouchMove={(event) => handleMove(event.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {children}
      </div>
    </div>
  )
}

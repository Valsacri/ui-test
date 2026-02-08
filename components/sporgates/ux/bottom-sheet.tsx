"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  height?: "auto" | "half" | "full"
}

const heightClasses = {
  auto: "max-h-[85vh]",
  half: "h-[50vh]",
  full: "h-[95vh]",
}

export function BottomSheet({ isOpen, onClose, title, children, footer, height = "auto" }: BottomSheetProps) {
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur"
        aria-label="Close"
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 flex max-h-[95vh] flex-col rounded-t-2xl border border-border bg-card shadow-2xl",
          "animate-slide-in-up",
          heightClasses[height]
        )}
      >
        <div className="flex justify-center pt-2">
          <div className="h-1 w-12 rounded-full bg-muted" />
        </div>
        {title && (
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 transition-colors hover:bg-muted"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer && <div className="border-t border-border bg-muted/40 p-4">{footer}</div>}
      </div>
    </div>
  )
}

interface MobileFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  onApply: () => void
  onClear?: () => void
  children: React.ReactNode
}

export function MobileFilterSheet({ isOpen, onClose, onApply, onClear, children }: MobileFilterSheetProps) {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Filters"
      footer={
        <div className="flex gap-2">
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Clear All
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              onApply()
              onClose()
            }}
            className="gradient-primary flex-1 rounded-xl py-2 text-xs font-semibold text-white"
          >
            Apply Filters
          </button>
        </div>
      }
    >
      {children}
    </BottomSheet>
  )
}

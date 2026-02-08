"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { BottomSheet } from "@/components/sporgates/ux/bottom-sheet"
import { cn } from "@/lib/utils"

interface FilterButtonProps {
  label: string
  value?: string
  icon?: React.ReactNode
  children: React.ReactNode
  onClear?: () => void
  applyLabel?: string
}

export function FilterButton({ label, value, icon, children, onClear, applyLabel = "Apply" }: FilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const hasValue = value && value !== "all" && value !== ""

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
      >
        {icon && <span className="text-muted-foreground">{icon}</span>}
        <span>{label}</span>
        {hasValue ? (
          <Badge className="ml-1 h-5 rounded-full bg-secondary px-2 text-[10px] text-white">
            {value}
          </Badge>
        ) : (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>

      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={label}
        footer={
          <div className="flex gap-2">
            {onClear && hasValue && (
              <button
                type="button"
                onClick={() => {
                  onClear()
                  setIsOpen(false)
                }}
                className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex-1 rounded-xl py-2 text-xs font-semibold text-white",
                onClear ? "gradient-primary" : "bg-primary"
              )}
            >
              {applyLabel}
            </button>
          </div>
        }
      >
        {children}
      </BottomSheet>
    </>
  )
}

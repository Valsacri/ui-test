"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateAction {
  label: string
  onClick: () => void
  variant?: "primary" | "secondary"
}

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: EmptyStateAction
  secondaryAction?: EmptyStateAction
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "py-8",
  md: "py-12",
  lg: "py-16",
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center", sizeClasses[size], className)}>
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {(action || secondaryAction) && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                action.variant === "secondary"
                  ? "border border-border text-foreground hover:bg-muted"
                  : "gradient-primary text-white"
              )}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

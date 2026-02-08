"use client"

import { ArrowLeft, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  backText?: string
  actions?: React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
  filterControls?: React.ReactNode
  variant?: "card" | "simple"
  className?: string
  showSearch?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  showFilter?: boolean
  onFilterClick?: () => void
}

export function PageHeader({
  title,
  subtitle,
  onBack,
  backText = "Back",
  actions,
  icon,
  children,
  filterControls,
  variant = "card",
  className,
  showSearch = false,
  searchPlaceholder = "Search...",
  searchValue = "",
  onSearchChange,
  showFilter = false,
  onFilterClick,
}: PageHeaderProps) {
  const content = (
    <>
      <div className="flex flex-wrap items-start gap-4">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mt-1">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">{backText}</span>
          </Button>
        )}

        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-3">
            {icon && <div className="shrink-0">{icon}</div>}
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {subtitle && !filterControls && (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {filterControls && <div className="flex items-center gap-2">{filterControls}</div>}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {subtitle && filterControls && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
      {children && <div className="mt-4">{children}</div>}

      {(showSearch || showFilter) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {showSearch && (
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchValue}
                onChange={(event) => onSearchChange?.(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 rounded-full pl-9"
              />
            </div>
          )}
          {showFilter && (
            <Button variant="outline" size="icon" onClick={onFilterClick}>
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </>
  )

  if (variant === "simple") {
    return <div className={cn(className)}>{content}</div>
  }

  return <div className={cn("rounded-2xl border border-border bg-card p-5", className)}>{content}</div>
}

"use client"

import { useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MobileFilterSheet } from "@/components/sporgates/ux/bottom-sheet"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export interface FilterOption {
  label: string
  value: string
}

export interface FilterConfig {
  id: string
  label: string
  options: FilterOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

interface FilterBarProps {
  filters?: FilterConfig[]
  search?: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
  defaultExpanded?: boolean
  actions?: React.ReactNode
  onClear?: () => void
  showToggle?: boolean
  showFilters?: boolean
  onToggleFilters?: (show: boolean) => void
  inline?: boolean
}

export function FilterBar({
  filters = [],
  search,
  defaultExpanded = false,
  actions,
  onClear,
  showToggle = true,
  showFilters: controlledShowFilters,
  onToggleFilters,
  inline = false,
}: FilterBarProps) {
  const isMobile = useIsMobile()
  const [internalShowFilters, setInternalShowFilters] = useState(defaultExpanded)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const showFilters = controlledShowFilters ?? internalShowFilters
  const activeFilterCount = filters.filter((filter) => filter.value && filter.value !== "all").length
  const hasActiveFilters = activeFilterCount > 0 || (search?.value?.length ?? 0) > 0

  const handleToggleFilters = (value: boolean) => {
    if (onToggleFilters) {
      onToggleFilters(value)
    } else {
      setInternalShowFilters(value)
    }
  }

  const handleClearAll = () => {
    filters.forEach((filter) => filter.onChange("all"))
    if (search?.onChange) {
      search.onChange("")
    }
    onClear?.()
  }

  const filterControls = (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
      {filters.map((filter) => (
        <div key={filter.id} className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">{filter.label}</p>
          <Select value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className="h-10 rounded-xl bg-muted/40 text-xs">
              <SelectValue placeholder={filter.placeholder || `Select ${filter.label}`} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  )

  return (
    <div className={cn("space-y-4", inline && "space-y-3")}>
      <div className={cn("flex flex-wrap items-center gap-3", inline && "flex-nowrap")}>
        {search && (
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search.value}
              onChange={(event) => search.onChange(event.target.value)}
              placeholder={search.placeholder || "Search..."}
              className="h-10 rounded-full pl-9"
            />
            {search.value && (
              <button
                type="button"
                onClick={() => search.onChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {!inline && <div className="flex-1" />}

        {showToggle && filters.length > 0 && (
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => (isMobile ? setShowMobileFilters(true) : handleToggleFilters(!showFilters))}
            className="gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className="ml-1 h-5 rounded-full bg-secondary px-2 text-[10px] text-white">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}

        {actions}
      </div>

      {showFilters && !isMobile && filters.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          {filterControls}
          {hasActiveFilters && (
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-semibold text-primary"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {isMobile && filters.length > 0 && (
        <MobileFilterSheet
          isOpen={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          onApply={() => undefined}
          onClear={hasActiveFilters ? handleClearAll : undefined}
        >
          {filterControls}
        </MobileFilterSheet>
      )}
    </div>
  )
}

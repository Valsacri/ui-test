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
    <div className={cn("space-y-4", inline && "space-y-3")}>\n      <div className={cn("flex flex-wrap items-center gap-3", inline && "flex-nowrap")}>\n        {search && (\n          <div className="relative flex-1 min-w-[180px]">\n            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />\n            <Input\n              value={search.value}\n              onChange={(event) => search.onChange(event.target.value)}\n              placeholder={search.placeholder || "Search..."}\n              className="h-10 rounded-full pl-9"\n            />\n            {search.value && (\n              <button\n                type="button"\n                onClick={() => search.onChange("")}\n                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"\n              >\n                <X className="h-4 w-4" />\n              </button>\n            )}\n          </div>\n        )}\n\n        {!inline && <div className="flex-1" />}\n\n        {showToggle && filters.length > 0 && (\n          <Button\n            variant={showFilters ? "default" : "outline"}\n            size="sm"\n            onClick={() => (isMobile ? setShowMobileFilters(true) : handleToggleFilters(!showFilters))}\n            className="gap-2"\n          >\n            <SlidersHorizontal className="h-4 w-4" />\n            Filters\n            {activeFilterCount > 0 && (\n              <Badge className="ml-1 h-5 rounded-full bg-secondary px-2 text-[10px] text-white">\n                {activeFilterCount}\n              </Badge>\n            )}\n          </Button>\n        )}\n\n        {actions}\n      </div>\n\n      {showFilters && !isMobile && filters.length > 0 && (\n        <div className="rounded-2xl border border-border bg-card p-4">\n          {filterControls}\n          {hasActiveFilters && (\n            <div className="mt-4 flex justify-end">\n              <button\n                type="button"\n                onClick={handleClearAll}\n                className="text-xs font-semibold text-primary"\n              >\n                Clear all\n              </button>\n            </div>\n          )}\n        </div>\n      )}\n\n      {isMobile && filters.length > 0 && (\n        <MobileFilterSheet\n          isOpen={showMobileFilters}\n          onClose={() => setShowMobileFilters(false)}\n          onApply={() => undefined}\n          onClear={hasActiveFilters ? handleClearAll : undefined}\n        >\n          {filterControls}\n        </MobileFilterSheet>\n      )}\n    </div>
  )
}

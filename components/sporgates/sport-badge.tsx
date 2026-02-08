"use client"

import {
  Dumbbell,
  Waves,
  Footprints,
  Target,
  Swords,
  Bike,
  Circle,
} from "lucide-react"
import type React from "react"
import { cn } from "@/lib/utils"

const sportIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  basketball: Target,
  soccer: Circle,
  tennis: Target,
  swimming: Waves,
  running: Footprints,
  volleyball: Circle,
  boxing: Swords,
  yoga: Dumbbell,
  cycling: Bike,
  golf: Target,
}

interface SportBadgeProps {
  name: string
  selected?: boolean
  onClick?: () => void
  size?: "sm" | "md" | "lg"
}

export function SportBadge({ name, selected, onClick, size = "md" }: SportBadgeProps) {
  const Icon = sportIcons[name.toLowerCase()] || Dumbbell

  const sizeClasses = {
    sm: "h-8 gap-1.5 px-2.5 text-[10px]",
    md: "h-9 gap-2 px-3 text-xs",
    lg: "h-10 gap-2.5 px-4 text-sm",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center rounded-full font-semibold transition-all",
        sizeClasses[size],
        selected
          ? "gradient-primary text-white shadow-md"
          : "border border-border bg-card text-foreground hover:bg-muted"
      )}
    >
      <Icon className={iconSizes[size]} />
      {name}
    </button>
  )
}

interface SportSelectorProps {
  sports: string[]
  selected: string[]
  onToggle: (sport: string) => void
  size?: "sm" | "md" | "lg"
}

export function SportSelector({ sports, selected, onToggle, size = "md" }: SportSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sports.map((sport) => (
        <SportBadge
          key={sport}
          name={sport}
          selected={selected.includes(sport)}
          onClick={() => onToggle(sport)}
          size={size}
        />
      ))}
    </div>
  )
}

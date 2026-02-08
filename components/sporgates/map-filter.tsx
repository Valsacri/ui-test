"use client"

import { useState } from "react"
import { MapPin, LocateFixed } from "lucide-react"

interface MapFilterProps {
  onChange?: (distance: number) => void
}

export function MapFilter({ onChange }: MapFilterProps) {
  const [distance, setDistance] = useState(10)

  const handleChange = (value: number) => {
    setDistance(value)
    onChange?.(value)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          Map Radius
        </div>
        <button
          type="button"
          className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-[11px] font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <LocateFixed className="h-3.5 w-3.5" />
          Use my location
        </button>
      </div>
      <input
        type="range"
        min={1}
        max={30}
        value={distance}
        onChange={(event) => handleChange(Number(event.target.value))}
        className="w-full accent-primary"
      />
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>1 mi</span>
        <span>{distance} mi</span>
        <span>30 mi</span>
      </div>
    </div>
  )
}

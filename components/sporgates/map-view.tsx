"use client"

import { MapPin } from "lucide-react"

interface MapViewProps {
  center: [number, number]
  markerLabel?: string
  height?: string
}

export function MapView({ center, markerLabel, height = "240px" }: MapViewProps) {
  const [lat, lng] = center
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card" style={{ height }}>
      <iframe
        title="Location map"
        src={mapUrl}
        className="h-full w-full border-0"
      />
      {markerLabel && (
        <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-card/90 px-3 py-2 text-xs shadow-md backdrop-blur">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-secondary" />
            <span className="font-medium text-foreground">{markerLabel}</span>
          </div>
        </div>
      )}
    </div>
  )
}

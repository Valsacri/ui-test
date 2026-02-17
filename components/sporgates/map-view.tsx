"use client"

import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import { useDebounce } from "@/lib/hooks/use-debounce"
import dynamic from "next/dynamic"

// Dynamically import Leaflet map to avoid SSR issues
const LeafletMap = dynamic(() => import("./leaflet-map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center text-xs text-muted-foreground">Loading map...</div>
})

interface MapViewProps {
  center: [number, number]
  markerLabel?: string
  height?: string
  addressQuery?: string // New prop for auto-geocoding
  skipGeocode?: boolean // New prop to skip geocoding (e.g. on manual selection)
  onLocationSelect?: (lat: number, lng: number) => void // Callback to update parent
  onAddressFound?: (address: any, source?: 'map' | 'search') => void
}

export function MapView({ center, markerLabel, height = "240px", addressQuery, skipGeocode = false, onLocationSelect, onAddressFound }: MapViewProps) {
  const [coords, setCoords] = useState(center)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedQuery = useDebounce(addressQuery, 800) // Debounce 800ms

  // Effect to geocode address when query changes
  useEffect(() => {
    if (!debouncedQuery || skipGeocode) return

    const controller = new AbortController()

    const geocode = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal }
        )
        const data = await response.json()
        if (data && data.length > 0) {
          const { lat, lon } = data[0]
          const newLat = parseFloat(lat)
          const newLng = parseFloat(lon)
          setCoords([newLat, newLng])
          onLocationSelect?.(newLat, newLng)
          onAddressFound?.(data[0], 'search') // Pass source: search
        } else {
          // Attempt fallback to city (last part of query)
          const parts = debouncedQuery.split(',')
          if (parts.length > 1) {
            const city = parts[parts.length - 1].trim()
            const fallbackResponse = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`,
              { signal: controller.signal }
            )
            const fallbackData = await fallbackResponse.json()

            if (fallbackData && fallbackData.length > 0) {
              const { lat, lon } = fallbackData[0]
              const newLat = parseFloat(lat)
              const newLng = parseFloat(lon)
              setCoords([newLat, newLng])
              onLocationSelect?.(newLat, newLng)
              onAddressFound?.(fallbackData[0], 'search') // Pass source: search
              setError("Address not found, using city")
            } else {
              setError("Location not found")
            }
          } else {
            setError("Location not found")
          }
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error("Geocoding failed:", error)
          setError("Geocoding failed")
        }
      } finally {
        setLoading(false)
      }
    }
    geocode()

    return () => controller.abort()
  }, [debouncedQuery])

  // Sync with prop updates - check values to avoid effect loops from array recreation
  useEffect(() => {
    if (center[0] !== coords[0] || center[1] !== coords[1]) {
      setCoords(center)
    }
  }, [center[0], center[1]])


  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm" style={{ height }}>
      <LeafletMap
        center={coords}
        onLocationSelect={(lat, lng) => {
          setCoords([lat, lng])
          onLocationSelect?.(lat, lng)
        }}
        onAddressFound={(addr) => onAddressFound?.(addr, 'map')}
      />

      {loading && (
        <div className="absolute top-2 right-2 rounded-full bg-background/80 px-3 py-1 text-xs font-semibold backdrop-blur shadow-sm z-[1000]">
          Locating...
        </div>
      )}
      {error && !loading && (
        <div className={`absolute top-2 right-2 rounded-full px-3 py-1 text-xs font-semibold shadow-sm backdrop-blur z-[1000] ${error.includes("using city") ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"
          }`}>
          {error}
        </div>
      )}
      {markerLabel && (
        <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-card/90 px-3 py-2 text-xs shadow-md backdrop-blur z-[1000]">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-secondary" />
            <span className="font-medium text-foreground truncate">{markerLabel}</span>
          </div>
        </div>
      )}
    </div>
  )
}

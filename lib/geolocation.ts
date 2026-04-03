/**
 * Browser geolocation + reverse geocoding for onboarding (no server required).
 * Uses BigDataCloud client reverse-geocode (CORS-friendly); falls back to OpenStreetMap Nominatim.
 */

export type DetectedPlace = {
  city: string
  country: string
}

function pickCity(addr: Record<string, unknown>): string {
  const keys = ["city", "town", "village", "municipality", "county", "state_district", "state"]
  for (const k of keys) {
    const v = addr[k]
    if (typeof v === "string" && v.trim()) return v.trim()
  }
  return ""
}

/** BigDataCloud client API — works from the browser without an API key. */
async function reverseGeocodeBigDataCloud(lat: number, lon: number): Promise<DetectedPlace> {
  const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client")
  url.searchParams.set("latitude", String(lat))
  url.searchParams.set("longitude", String(lon))
  url.searchParams.set("localityLanguage", "en")
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error("geocode_http")
  const data = (await res.json()) as Record<string, unknown>
  const city =
    (typeof data.city === "string" && data.city) ||
    (typeof data.locality === "string" && data.locality) ||
    (typeof data.principalSubdivision === "string" && data.principalSubdivision) ||
    ""
  const country = typeof data.countryName === "string" ? data.countryName : ""
  if (!String(city).trim() && !String(country).trim()) throw new Error("geocode_empty")
  return { city: String(city).trim(), country: String(country).trim() }
}

/** Nominatim — backup; requires identifiable User-Agent per usage policy. */
async function reverseGeocodeNominatim(lat: number, lon: number): Promise<DetectedPlace> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse")
  url.searchParams.set("lat", String(lat))
  url.searchParams.set("lon", String(lon))
  url.searchParams.set("format", "json")
  url.searchParams.set("addressdetails", "1")
  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Accept-Language": "en",
      "User-Agent": "SporgatesApp/1.0 (onboarding; contact: app support)",
    },
  })
  if (!res.ok) throw new Error("geocode_http")
  const data = (await res.json()) as { address?: Record<string, unknown> }
  const addr = data.address || {}
  const city = pickCity(addr)
  const country = typeof addr.country === "string" ? addr.country : ""
  if (!city && !country) throw new Error("geocode_empty")
  return { city, country }
}

export async function reverseGeocode(lat: number, lon: number): Promise<DetectedPlace> {
  try {
    return await reverseGeocodeBigDataCloud(lat, lon)
  } catch {
    return reverseGeocodeNominatim(lat, lon)
  }
}

export function getBrowserIanaTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || ""
  } catch {
    return ""
  }
}

export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("not_supported"))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 300_000,
    })
  })
}

export function geolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "Location access was denied. You can enter your city and country below."
    case 2:
      return "Your position could not be determined. Enter your city and country below."
    case 3:
      return "Location request timed out. Try again or enter your details below."
    default:
      return "Could not use your location. Enter your city and country below."
  }
}

"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Globe, MapPin, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { userService } from "@/lib/services/user"
import { authService } from "@/lib/services/auth"
import { toast } from "sonner"

interface SettingsLanguagePageProps {
  onBack: () => void
}

const languages = [
  { code: "en", name: "English", native: "English", flag: "US" },
  { code: "es", name: "Spanish", native: "Espanol", flag: "ES" },
  { code: "fr", name: "French", native: "Francais", flag: "FR" },
  { code: "pt", name: "Portuguese", native: "Portugues", flag: "PT" },
  { code: "de", name: "German", native: "Deutsch", flag: "DE" },
  { code: "ar", name: "Arabic", native: "Arabic", flag: "SA" },
  { code: "zh", name: "Chinese", native: "Chinese", flag: "CN" },
  { code: "ja", name: "Japanese", native: "Japanese", flag: "JP" },
]

const regions = [
  { id: "us", name: "United States", timezone: "EST (UTC-5)" },
  { id: "uk", name: "United Kingdom", timezone: "GMT (UTC+0)" },
  { id: "eu", name: "Europe (Central)", timezone: "CET (UTC+1)" },
  { id: "asia", name: "Asia Pacific", timezone: "JST (UTC+9)" },
]

const dateFormats = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]
const distanceUnits = ["Miles", "Kilometers"]

export function SettingsLanguagePage({ onBack }: SettingsLanguagePageProps) {
  const [selectedLang, setSelectedLang] = useState("en")
  const [selectedRegion, setSelectedRegion] = useState("us")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
  const [distanceUnit, setDistanceUnit] = useState("Miles")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Load user's current language preference
  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user?.id) {
      userService.getUserById(user.id).then((data: any) => {
        if (data?.languagePreference) setSelectedLang(data.languagePreference)
      }).catch(() => { })
    }
  }, [])

  const handleSave = async () => {
    const user = authService.getCurrentUser()
    if (!user?.id) return
    setSaving(true)
    setSaved(false)
    try {
      await userService.updateLanguagePreference(user.id, selectedLang)
      setSaved(true)
      toast.success("Language preferences saved")
      setTimeout(() => setSaved(false), 2000)
    } catch {
      toast.error("Failed to save preferences. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Settings
      </button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Language & Region</h1>
        <p className="text-sm text-muted-foreground">Set your language and regional preferences</p>
      </div>

      {/* Language */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-sm font-bold text-foreground">Language</h2>
        </div>
        <div className="grid grid-cols-1 gap-2 p-4 md:grid-cols-2">
          {languages.map((lang) => (
            <button
              type="button"
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={cn(
                "flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all",
                selectedLang === lang.code
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{lang.name}</p>
                <p className="text-xs text-muted-foreground">{lang.native}</p>
              </div>
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2",
                  selectedLang === lang.code ? "border-primary bg-primary" : "border-border"
                )}
              >
                {selectedLang === lang.code && (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Region */}
      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <MapPin className="h-5 w-5 text-secondary" />
          <h2 className="text-sm font-bold text-foreground">Region</h2>
        </div>
        <div className="space-y-2 p-4">
          {regions.map((region) => (
            <button
              type="button"
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition-all",
                selectedRegion === region.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{region.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {region.timezone}
                </div>
              </div>
              <div
                className={cn(
                  "h-4 w-4 rounded-full border-2",
                  selectedRegion === region.id ? "border-primary bg-primary" : "border-border"
                )}
              >
                {selectedRegion === region.id && (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Format Preferences */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-bold text-foreground">Format Preferences</h2>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Date Format</p>
            <div className="flex flex-wrap gap-2">
              {dateFormats.map((fmt) => (
                <button
                  type="button"
                  key={fmt}
                  onClick={() => setDateFormat(fmt)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-medium transition-all",
                    dateFormat === fmt
                      ? "gradient-primary text-white shadow-md"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  )}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Distance Unit</p>
            <div className="flex gap-2">
              {distanceUnits.map((unit) => (
                <button
                  type="button"
                  key={unit}
                  onClick={() => setDistanceUnit(unit)}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-medium transition-all",
                    distanceUnit === unit
                      ? "gradient-primary text-white shadow-md"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  )}
                >
                  {unit}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="gradient-primary w-full rounded-xl py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save Preferences"}
      </button>
    </div>
  )
}

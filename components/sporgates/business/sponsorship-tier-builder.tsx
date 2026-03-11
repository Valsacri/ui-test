"use client"

import { useState } from "react"
import { Plus, Trash2, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SponsorshipTier {
  id: string
  name: string
  price: number
  benefits: string[]
  logoPositions: string[]
}

interface SponsorshipTierBuilderProps {
  tiers: SponsorshipTier[]
  onChange: (tiers: SponsorshipTier[]) => void
  eventPoster?: string
  onPosterUpload: (fileOrUrl: File | string) => void
}

const logoPositions = [
  "Jersey Front",
  "Jersey Back",
  "Sleeve",
  "Poster Top",
  "Poster Bottom",
  "Social Media",
]

export function SponsorshipTierBuilder({ tiers, onChange, eventPoster, onPosterUpload }: SponsorshipTierBuilderProps) {
  const [editingTier, setEditingTier] = useState<SponsorshipTier | null>(null)

  const handleAddTier = () => {
    // Clear existing tiers — only one allowed
    setEditingTier({
      id: `tier-${Date.now()}`,
      name: "",
      price: 0,
      benefits: [""],
      logoPositions: [],
    })
  }

  const saveTier = () => {
    if (!editingTier || !editingTier.name) return
    // Only one tier allowed — replace entire array
    onChange([editingTier])
    setEditingTier(null)
  }

  const deleteTier = (id: string) => {
    onChange(tiers.filter((tier) => tier.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm font-semibold text-foreground">Event Poster</p>
        <div className="mt-3 rounded-xl border border-dashed border-border bg-muted/40 p-4 text-center">
          {eventPoster ? (
            <div className="space-y-3">
              <img src={eventPoster} alt="Poster" className="mx-auto h-40 rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => onPosterUpload("")}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted"
              >
                <X className="mr-1 inline h-3 w-3" />
                Remove Poster
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <input
                type="file"
                id="poster-upload"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    onPosterUpload(file)
                  }
                }}
              />
              <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Upload a poster to preview placements</p>
              <button
                type="button"
                onClick={() => document.getElementById("poster-upload")?.click()}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Upload Poster
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">Sponsorship Tiers</p>
          <div className="flex gap-2">
            <div className="flex gap-1 mr-2 border-r border-border pr-2">
              {[
                { name: "Gold", price: 5000, color: "bg-yellow-500/10 text-yellow-600 border-yellow-200", selectedColor: "ring-2 ring-yellow-400 bg-yellow-500/20" },
                { name: "Silver", price: 2500, color: "bg-slate-200 text-slate-600 border-slate-200", selectedColor: "ring-2 ring-slate-400 bg-slate-300" },
                { name: "Bronze", price: 1000, color: "bg-orange-500/10 text-orange-600 border-orange-200", selectedColor: "ring-2 ring-orange-400 bg-orange-500/20" }
              ].map(preset => {
                const isSelected = tiers.some(t => t.name.toLowerCase().includes(preset.name.toLowerCase()))
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        // Deselect
                        onChange([])
                        return
                      }
                      const newTier = {
                        id: `tier-${Date.now()}-${preset.name}`,
                        name: `${preset.name} Sponsor`,
                        price: preset.price,
                        benefits: [`${preset.name} Tier Benefits`],
                        logoPositions: []
                      }
                      onChange([newTier])
                    }}
                    className={cn("text-[10px] px-2 py-1 rounded-full border font-medium transition-colors hover:opacity-80",
                      isSelected ? preset.selectedColor : preset.color)}
                  >
                    {isSelected ? `✓ ${preset.name}` : preset.name}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              onClick={handleAddTier}
              className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <Plus className="h-3 w-3" />
              Add Custom
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {tiers.map((tier) => (
            <div key={tier.id} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{tier.name}</p>
                  <p className="text-xs text-muted-foreground">${tier.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTier(tier)}
                    className="text-xs font-semibold text-primary"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTier(tier.id)}
                    className="rounded-full p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Remove tier"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {tier.logoPositions.map((pos) => (
                  <span key={pos} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {pos}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {editingTier && (
          <div className="mt-4 rounded-xl border border-border bg-muted/40 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Tier Name</label>
                <input
                  value={editingTier.name}
                  onChange={(event) => setEditingTier({ ...editingTier, name: event.target.value })}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Price</label>
                <input
                  type="number"
                  value={editingTier.price}
                  onChange={(event) => setEditingTier({ ...editingTier, price: Number(event.target.value) || 0 })}
                  className="mt-1 h-10 w-full rounded-lg border border-border bg-card px-3 text-sm outline-none"
                />
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground">Logo Positions</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {logoPositions.map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => {
                      const hasPos = editingTier.logoPositions.includes(pos)
                      const updated = hasPos
                        ? editingTier.logoPositions.filter((item) => item !== pos)
                        : [...editingTier.logoPositions, pos]
                      setEditingTier({ ...editingTier, logoPositions: updated })
                    }}
                    className={cn(
                      "rounded-full px-3 py-1 text-[10px] font-semibold transition-all",
                      editingTier.logoPositions.includes(pos)
                        ? "bg-secondary text-white"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground">Benefits</p>
              <div className="mt-2 space-y-2">
                {editingTier.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      value={benefit}
                      onChange={(event) => {
                        const updated = [...editingTier.benefits]
                        updated[index] = event.target.value
                        setEditingTier({ ...editingTier, benefits: updated })
                      }}
                      className="h-9 flex-1 rounded-lg border border-border bg-card px-3 text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = editingTier.benefits.filter((_, i) => i !== index)
                        setEditingTier({ ...editingTier, benefits: updated })
                      }}
                      className="rounded-full border border-border p-2 text-muted-foreground hover:text-foreground"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setEditingTier({ ...editingTier, benefits: [...editingTier.benefits, ""] })}
                  className="text-xs font-semibold text-primary"
                >
                  + Add Benefit
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => deleteTier(editingTier.id)}
                className="rounded-xl border border-destructive/30 px-3 py-2 text-xs font-semibold text-destructive hover:bg-destructive/5"
              >
                Delete Tier
              </button>
              <button
                type="button"
                onClick={() => setEditingTier(null)}
                className="rounded-xl border border-border px-3 py-2 text-xs font-semibold text-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveTier}
                className="gradient-primary rounded-xl px-3 py-2 text-xs font-semibold text-white"
              >
                Save Tier
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

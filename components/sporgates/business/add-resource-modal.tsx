"use client"

import { useState, useEffect } from "react"
import { Building2, Package, Wrench } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export type ResourceType = "facility" | "product" | "service"

export interface CreateResourcePayload {
  name: string
  resourceType: ResourceType
  description: string
  image: string
  // Facility fields
  pricePerHour?: number
  capacity?: number
  address?: string
  city?: string
  sport?: string
  // Product fields
  price?: number
  brand?: string
  category?: string
  originalPrice?: number
  // Service fields
  duration?: string
}

interface AddResourceModalProps {
  isOpen: boolean
  onClose: () => void
  defaultResourceType?: ResourceType
  onCreate: (resource: CreateResourcePayload) => void
}

const resourceTabs: { key: ResourceType; label: string; icon: typeof Building2 }[] = [
  { key: "facility", label: "Facility", icon: Building2 },
  { key: "product", label: "Product", icon: Package },
  { key: "service", label: "Service", icon: Wrench },
]

const sportOptions = ["Football", "Basketball", "Tennis", "Swimming", "Boxing", "Yoga", "Cricket", "Badminton", "Volleyball", "Other"]
const productCategories = ["Equipment", "Apparel", "Footwear", "Accessories", "Nutrition", "Recovery", "Other"]
const serviceCategories = ["Training", "Coaching", "Therapy", "Fitness", "Nutrition", "Rehabilitation", "Other"]
const durationOptions = ["30 min", "45 min", "1 hour", "1.5 hours", "2 hours", "3 hours"]

export function AddResourceModal({ isOpen, onClose, onCreate, defaultResourceType }: AddResourceModalProps) {
  const [resourceType, setResourceType] = useState<ResourceType>(defaultResourceType || "facility")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  // Facility
  const [pricePerHour, setPricePerHour] = useState(0)
  const [capacity, setCapacity] = useState(0)
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [sport, setSport] = useState("")
  // Product
  const [price, setPrice] = useState(0)
  const [brand, setBrand] = useState("")
  const [category, setCategory] = useState("")
  const [originalPrice, setOriginalPrice] = useState(0)
  // Service
  const [duration, setDuration] = useState("")
  const [serviceCategory, setServiceCategory] = useState("")
  const [servicePrice, setServicePrice] = useState(0)

  useEffect(() => {
    if (defaultResourceType) setResourceType(defaultResourceType)
  }, [defaultResourceType])

  const resetForm = () => {
    setName(""); setDescription(""); setImage("")
    setPricePerHour(0); setCapacity(0); setAddress(""); setCity(""); setSport("")
    setPrice(0); setBrand(""); setCategory(""); setOriginalPrice(0)
    setDuration(""); setServiceCategory(""); setServicePrice(0)
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    const payload: CreateResourcePayload = {
      name: name.trim(),
      resourceType,
      description: description.trim(),
      image: image.trim(),
    }
    if (resourceType === "facility") {
      payload.pricePerHour = pricePerHour
      payload.capacity = capacity
      payload.address = address.trim()
      payload.city = city.trim()
      payload.sport = sport
      payload.category = sport
    } else if (resourceType === "product") {
      payload.price = price
      payload.brand = brand.trim()
      payload.category = category
      payload.originalPrice = originalPrice || undefined
    } else {
      payload.price = servicePrice
      payload.category = serviceCategory
      payload.duration = duration
    }
    onCreate(payload)
    resetForm()
    onClose()
  }

  const inputClass = "mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
  const selectClass = "mt-1 h-11 w-full rounded-xl border border-border bg-muted px-3 text-sm outline-none focus:border-primary appearance-none cursor-pointer"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">Add Resource</DialogTitle>
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sticky top-0 bg-card z-10">
          <div>
            <p className="text-sm font-semibold text-foreground">Add Resource</p>
            <p className="text-xs text-muted-foreground">Create a facility, product, or service</p>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          {!defaultResourceType && (
            <div className="flex flex-wrap gap-2">
              {resourceTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setResourceType(tab.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all",
                    resourceType === tab.key
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-foreground hover:bg-muted"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Common fields */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Name *</label>
            <input
              type="text"
              placeholder={`e.g., ${resourceType === "facility" ? "Basketball Court A" : resourceType === "product" ? "Professional Tennis Racket" : "Personal Training Session"}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Description</label>
            <textarea
              rows={2}
              placeholder="Short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-muted p-3 text-sm outline-none focus:border-primary resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground">Image URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* ── Facility-specific ── */}
          {resourceType === "facility" && (
            <>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-bold text-foreground mb-3">Facility Details</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Sport</label>
                <select value={sport} onChange={(e) => setSport(e.target.value)} className={selectClass}>
                  <option value="">Select sport...</option>
                  {sportOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Price per Hour ($)</label>
                  <input type="number" min={0} value={pricePerHour} onChange={(e) => setPricePerHour(Number(e.target.value) || 0)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Capacity</label>
                  <input type="number" min={0} value={capacity} onChange={(e) => setCapacity(Number(e.target.value) || 0)} className={inputClass} />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Address</label>
                  <input type="text" placeholder="123 Main St" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">City</label>
                  <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
                </div>
              </div>
            </>
          )}

          {/* ── Product-specific ── */}
          {resourceType === "product" && (
            <>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-bold text-foreground mb-3">Product Details</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                  <option value="">Select category...</option>
                  {productCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Price ($) *</label>
                  <input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Original Price ($)</label>
                  <input type="number" min={0} step={0.01} value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)} placeholder="Optional" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Brand</label>
                <input type="text" placeholder="e.g., Nike, Adidas..." value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass} />
              </div>
            </>
          )}

          {/* ── Service-specific ── */}
          {resourceType === "service" && (
            <>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-bold text-foreground mb-3">Service Details</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Category *</label>
                <select value={serviceCategory} onChange={(e) => setServiceCategory(e.target.value)} className={selectClass}>
                  <option value="">Select category...</option>
                  {serviceCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Price ($) *</label>
                  <input type="number" min={0} step={0.01} value={servicePrice} onChange={(e) => setServicePrice(Number(e.target.value) || 0)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Duration</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} className={selectClass}>
                    <option value="">Select duration...</option>
                    {durationOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Submit buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => { resetForm(); onClose() }}
              className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="gradient-primary flex-1 rounded-xl py-2.5 text-xs font-semibold text-white disabled:opacity-50"
            >
              Add {resourceType === "facility" ? "Facility" : resourceType === "product" ? "Product" : "Service"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Building2, Package, Wrench, Upload, Plus, X, Loader2, ImageIcon } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import apiClient from "@/lib/api"

export type ResourceType = "facility" | "product" | "service"

export interface CreateResourcePayload {
  name: string
  resourceType: ResourceType
  description: string
  image: string
  features: string[]
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

const resourceTypes: {
  key: ResourceType
  label: string
  sub: string
  icon: typeof Building2
  activeColor: string
  activeBg: string
}[] = [
  { key: "facility", label: "Facility", sub: "Gyms, courts, studios", icon: Building2, activeColor: "text-primary", activeBg: "border-primary bg-primary/5" },
  { key: "product", label: "Product", sub: "Equipment, gear, apparel", icon: Package, activeColor: "text-secondary", activeBg: "border-secondary bg-secondary/5" },
  { key: "service", label: "Service", sub: "Training, coaching, therapy", icon: Wrench, activeColor: "text-green-600", activeBg: "border-green-600 bg-green-600/5" },
]

const sportOptions = ["Football", "Basketball", "Tennis", "Swimming", "Boxing", "Yoga", "Cricket", "Badminton", "Volleyball", "Other"]
const productCategories = ["Equipment", "Apparel", "Footwear", "Accessories", "Nutrition", "Recovery", "Other"]
const serviceCategories = ["Training", "Coaching", "Therapy", "Fitness", "Nutrition", "Rehabilitation", "Other"]
const durationOptions = ["30 min", "45 min", "1 hour", "1.5 hours", "2 hours", "3 hours"]

async function uploadResourceImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  const res = await apiClient.post<{ url: string }>("/v1/upload/resource/image", formData, {
    headers: { "Content-Type": null as unknown as string },
  })
  return res.data.url
}

export function AddResourceModal({ isOpen, onClose, onCreate, defaultResourceType }: AddResourceModalProps) {
  const [resourceType, setResourceType] = useState<ResourceType>(defaultResourceType || "facility")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [features, setFeatures] = useState<string[]>([])
  const [currentFeature, setCurrentFeature] = useState("")
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

  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    if (defaultResourceType) setResourceType(defaultResourceType)
  }, [defaultResourceType])

  const resetForm = () => {
    setName(""); setDescription(""); setImage(""); setImageFile(null); setImagePreview(null)
    setFeatures([]); setCurrentFeature("")
    setPricePerHour(0); setCapacity(0); setAddress(""); setCity(""); setSport("")
    setPrice(0); setBrand(""); setCategory(""); setOriginalPrice(0)
    setDuration(""); setServiceCategory(""); setServicePrice(0)
  }

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [handleFileSelect])

  const addFeature = () => {
    const val = currentFeature.trim()
    if (val && !features.includes(val)) {
      setFeatures(prev => [...prev, val])
      setCurrentFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!name.trim()) return
    setSubmitting(true)

    let imageUrl = image
    if (imageFile) {
      try {
        setUploading(true)
        imageUrl = await uploadResourceImage(imageFile)
        setUploading(false)
      } catch {
        setUploading(false)
        setSubmitting(false)
        return
      }
    }

    const payload: CreateResourcePayload = {
      name: name.trim(),
      resourceType,
      description: description.trim(),
      image: imageUrl,
      features,
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
    setSubmitting(false)
    onClose()
  }

  const inputClass = "mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary transition-colors"
  const selectClass = "mt-1 h-11 w-full rounded-xl border border-border bg-muted px-3 text-sm outline-none focus:border-primary appearance-none cursor-pointer transition-colors"
  const featuresLabel = resourceType === "facility" ? "Amenities" : resourceType === "product" ? "Features" : "Offerings"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">Add Resource</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sticky top-0 bg-card z-10">
          <div>
            <p className="text-sm font-semibold text-foreground">Add New Resource</p>
            <p className="text-xs text-muted-foreground">Create a facility, product, or service</p>
          </div>
        </div>

        <div className="space-y-5 px-5 py-5">

          {/* ── Resource Type Selection ── */}
          {!defaultResourceType && (
            <div className="grid grid-cols-3 gap-3">
              {resourceTypes.map((rt) => {
                const active = resourceType === rt.key
                return (
                  <button
                    key={rt.key}
                    type="button"
                    onClick={() => setResourceType(rt.key)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 transition-all",
                      active ? rt.activeBg : "border-border hover:border-muted-foreground/30"
                    )}
                  >
                    <rt.icon className={cn("h-7 w-7", active ? rt.activeColor : "text-muted-foreground")} />
                    <p className={cn("text-xs font-semibold", active ? rt.activeColor : "text-foreground")}>
                      {rt.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{rt.sub}</p>
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Basic Information ── */}
          <div>
            <p className="text-xs font-bold text-foreground mb-3">Basic Information</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">
                  {resourceType === "facility" ? "Facility" : resourceType === "product" ? "Product" : "Service"} Name *
                </label>
                <input
                  type="text"
                  placeholder={`e.g., ${resourceType === "facility" ? "Basketball Court A" : resourceType === "product" ? "Professional Tennis Racket" : "Personal Training Session"}`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground">Description *</label>
                <textarea
                  rows={3}
                  placeholder="Provide a detailed description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-border bg-muted p-3 text-sm outline-none focus:border-primary resize-none transition-colors"
                />
              </div>

              {resourceType !== "service" && (
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">
                      {resourceType === "facility" ? "Price per Hour ($)" : "Price ($)"} *
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="0.00"
                      value={resourceType === "facility" ? pricePerHour || "" : price || ""}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0
                        resourceType === "facility" ? setPricePerHour(val) : setPrice(val)
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Category</label>
                    {resourceType === "product" ? (
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                        <option value="">Select category...</option>
                        {productCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    ) : (
                      <select value={sport} onChange={(e) => setSport(e.target.value)} className={selectClass}>
                        <option value="">Select sport...</option>
                        {sportOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Image Upload ── */}
          <div>
            <p className="text-xs font-bold text-foreground mb-3">Image</p>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="h-44 w-full rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); setImage("") }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                role="button"
                tabIndex={0}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => { if (e.key === "Enter") fileInputRef.current?.click() }}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer",
                  dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                )}
              >
                {uploading ? (
                  <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <p className="text-xs font-medium text-foreground">Click to upload or drag and drop</p>
                <p className="text-[10px] text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
                e.target.value = ""
              }}
            />
          </div>

          {/* ── Type-specific fields ── */}
          {resourceType === "facility" && (
            <div>
              <p className="text-xs font-bold text-foreground mb-3">Facility Details</p>
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Address</label>
                    <input type="text" placeholder="123 Main St" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">City</label>
                    <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Capacity</label>
                  <input type="number" min={0} placeholder="Max number of people" value={capacity || ""} onChange={(e) => setCapacity(Number(e.target.value) || 0)} className={inputClass} />
                </div>
              </div>
            </div>
          )}

          {resourceType === "product" && (
            <div>
              <p className="text-xs font-bold text-foreground mb-3">Product Details</p>
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Brand</label>
                    <input type="text" placeholder="e.g., Nike, Adidas..." value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Original Price ($)</label>
                    <input type="number" min={0} step={0.01} placeholder="Optional" value={originalPrice || ""} onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {resourceType === "service" && (
            <div>
              <p className="text-xs font-bold text-foreground mb-3">Service Details</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Category *</label>
                  <select value={serviceCategory} onChange={(e) => setServiceCategory(e.target.value)} className={selectClass}>
                    <option value="">Select category...</option>
                    {serviceCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Price ($) *</label>
                    <input type="number" min={0} step={0.01} placeholder="0.00" value={servicePrice || ""} onChange={(e) => setServicePrice(Number(e.target.value) || 0)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground">Duration</label>
                    <select value={duration} onChange={(e) => setDuration(e.target.value)} className={selectClass}>
                      <option value="">Select duration...</option>
                      {durationOptions.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Features / Amenities ── */}
          <div>
            <p className="text-xs font-bold text-foreground mb-3">{featuresLabel}</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={`Add ${featuresLabel.toLowerCase().slice(0, -1)}...`}
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature() } }}
                className={inputClass}
              />
              <button
                type="button"
                onClick={addFeature}
                className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-muted transition-colors hover:bg-primary/10 hover:border-primary"
              >
                <Plus className="h-4 w-4 text-foreground" />
              </button>
            </div>
            {features.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <span
                    key={index}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-muted px-3 py-1.5 text-[11px] font-medium text-foreground"
                  >
                    {feature}
                    <button type="button" onClick={() => removeFeature(index)} className="text-muted-foreground hover:text-destructive transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Actions ── */}
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
              disabled={!name.trim() || submitting}
              className="gradient-primary flex-1 rounded-xl py-2.5 text-xs font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Add {resourceType === "facility" ? "Facility" : resourceType === "product" ? "Product" : "Service"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

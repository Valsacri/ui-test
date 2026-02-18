"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Upload, Plus, X, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import apiClient from "@/lib/api"

type ResourceType = "facility" | "product" | "service"

export interface EditableResource {
  id: string
  name: string
  type: string
  description?: string
  image?: string
  features?: string[]
  // Facility
  pricePerHour?: number
  capacity?: number
  address?: string
  city?: string
  sport?: string
  // Product
  price?: number
  brand?: string
  category?: string
  originalPrice?: number
  // Service
  duration?: string
}

interface EditResourceModalProps {
  isOpen: boolean
  onClose: () => void
  resource: EditableResource
  resourceType: ResourceType
  onDelete?: () => void
  onSave: (resource: EditableResource) => void
}

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

export function EditResourceModal({ isOpen, onClose, resource, resourceType, onDelete, onSave }: EditResourceModalProps) {
  const [name, setName] = useState(resource.name)
  const [description, setDescription] = useState(resource.description || "")
  const [image, setImage] = useState(resource.image || "")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(resource.image || null)
  const [uploading, setUploading] = useState(false)
  const [features, setFeatures] = useState<string[]>(resource.features || [])
  const [currentFeature, setCurrentFeature] = useState("")
  // Facility
  const [pricePerHour, setPricePerHour] = useState(resource.pricePerHour || 0)
  const [capacity, setCapacity] = useState(resource.capacity || 0)
  const [address, setAddress] = useState(resource.address || "")
  const [city, setCity] = useState(resource.city || "")
  const [sport, setSport] = useState(resource.sport || "")
  // Product
  const [price, setPrice] = useState(resource.price || 0)
  const [brand, setBrand] = useState(resource.brand || "")
  const [category, setCategory] = useState(resource.category || "")
  const [originalPrice, setOriginalPrice] = useState(resource.originalPrice || 0)
  // Service
  const [duration, setDuration] = useState(resource.duration || "")

  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    setName(resource.name)
    setDescription(resource.description || "")
    setImage(resource.image || "")
    setImagePreview(resource.image || null)
    setImageFile(null)
    setFeatures(resource.features || [])
    setPricePerHour(resource.pricePerHour || 0)
    setCapacity(resource.capacity || 0)
    setAddress(resource.address || "")
    setCity(resource.city || "")
    setSport(resource.sport || "")
    setPrice(resource.price || 0)
    setBrand(resource.brand || "")
    setCategory(resource.category || "")
    setOriginalPrice(resource.originalPrice || 0)
    setDuration(resource.duration || "")
  }, [resource])

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

  const handleSave = async () => {
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

    const updated: EditableResource = {
      ...resource,
      name: name.trim() || resource.name,
      description: description.trim(),
      image: imageUrl,
      features,
    }
    if (resourceType === "facility") {
      updated.pricePerHour = pricePerHour
      updated.capacity = capacity
      updated.address = address.trim()
      updated.city = city.trim()
      updated.sport = sport
    } else if (resourceType === "product") {
      updated.price = price
      updated.brand = brand.trim()
      updated.category = category
      updated.originalPrice = originalPrice || undefined
    } else {
      updated.price = price
      updated.category = category
      updated.duration = duration
    }
    onSave(updated)
    setSubmitting(false)
    onClose()
  }

  const inputClass = "mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary transition-colors"
  const selectClass = "mt-1 h-11 w-full rounded-xl border border-border bg-muted px-3 text-sm outline-none focus:border-primary appearance-none cursor-pointer transition-colors"
  const featuresLabel = resourceType === "facility" ? "Amenities" : resourceType === "product" ? "Features" : "Offerings"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">Edit Resource</DialogTitle>

        <div className="flex items-center justify-between border-b border-border px-5 py-4 sticky top-0 bg-card z-10">
          <p className="text-sm font-semibold text-foreground">Edit {resource.type}</p>
        </div>

        <div className="space-y-5 px-5 py-5">
          {/* Common */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-muted p-3 text-sm outline-none focus:border-primary resize-none transition-colors" />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Image</label>
            {imagePreview ? (
              <div className="relative mt-1">
                <img src={imagePreview} alt={name} className="h-40 w-full rounded-xl object-cover" crossOrigin="anonymous" />
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
                  "mt-1 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors cursor-pointer",
                  dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                )}
              >
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
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

          {/* Facility */}
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
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Price per Hour ($)</label>
                  <input type="number" min={0} value={pricePerHour || ""} onChange={(e) => setPricePerHour(Number(e.target.value) || 0)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Capacity</label>
                  <input type="number" min={0} value={capacity || ""} onChange={(e) => setCapacity(Number(e.target.value) || 0)} className={inputClass} />
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">City</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} />
                </div>
              </div>
            </>
          )}

          {/* Product */}
          {resourceType === "product" && (
            <>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-bold text-foreground mb-3">Product Details</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                  <option value="">Select category...</option>
                  {productCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Price ($)</label>
                  <input type="number" min={0} step={0.01} value={price || ""} onChange={(e) => setPrice(Number(e.target.value) || 0)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Original Price ($)</label>
                  <input type="number" min={0} step={0.01} value={originalPrice || ""} onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Brand</label>
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass} />
              </div>
            </>
          )}

          {/* Service */}
          {resourceType === "service" && (
            <>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-bold text-foreground mb-3">Service Details</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                  <option value="">Select category...</option>
                  {serviceCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Price ($)</label>
                  <input type="number" min={0} step={0.01} value={price || ""} onChange={(e) => setPrice(Number(e.target.value) || 0)} className={inputClass} />
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

          {/* Features / Amenities */}
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

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border border-destructive/30 px-4 py-2.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/5"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={submitting}
              className="gradient-primary flex-1 rounded-xl py-2.5 text-xs font-semibold text-white disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Changes
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

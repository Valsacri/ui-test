"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

type ResourceType = "facility" | "product" | "service"

interface EditableResource {
  id: string
  name: string
  type: string
  description?: string
  image?: string
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

export function EditResourceModal({ isOpen, onClose, resource, resourceType, onDelete, onSave }: EditResourceModalProps) {
  const [name, setName] = useState(resource.name)
  const [description, setDescription] = useState(resource.description || "")
  const [image, setImage] = useState(resource.image || "")
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

  useEffect(() => {
    setName(resource.name)
    setDescription(resource.description || "")
    setImage(resource.image || "")
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

  const handleSave = () => {
    const updated: EditableResource = {
      ...resource,
      name: name.trim() || resource.name,
      description: description.trim(),
      image: image.trim(),
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
    onClose()
  }

  const inputClass = "mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
  const selectClass = "mt-1 h-11 w-full rounded-xl border border-border bg-muted px-3 text-sm outline-none focus:border-primary appearance-none cursor-pointer"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        <DialogTitle className="sr-only">Edit Resource</DialogTitle>
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sticky top-0 bg-card z-10">
          <p className="text-sm font-semibold text-foreground">Edit {resource.type}</p>
        </div>

        <div className="space-y-4 px-5 py-5">
          {/* Common */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Description</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-xl border border-border bg-muted p-3 text-sm outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Image URL</label>
            <input type="url" value={image} onChange={(e) => setImage(e.target.value)} className={inputClass} />
          </div>

          {image && <img src={image} alt={name} className="h-32 w-full rounded-xl object-cover" crossOrigin="anonymous" />}

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
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Price ($)</label>
                  <input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Original Price ($)</label>
                  <input type="number" min={0} step={0.01} value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value) || 0)} className={inputClass} />
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
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Price ($)</label>
                  <input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)} className={inputClass} />
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

          {/* Action buttons */}
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
              className="gradient-primary flex-1 rounded-xl py-2.5 text-xs font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

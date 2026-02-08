"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"

interface EditResourceModalProps {
  isOpen: boolean
  onClose: () => void
  resource: {
    id: string
    name: string
    type: string
    price?: number
    pricePerHour?: number
    image?: string
  }
  resourceType: "facility" | "product" | "service"
  onDelete?: () => void
  onSave: (resource: {
    id: string
    name: string
    type: string
    price?: number
    pricePerHour?: number
    image?: string
  }) => void
}

export function EditResourceModal({ isOpen, onClose, resource, resourceType, onDelete, onSave }: EditResourceModalProps) {
  const [name, setName] = useState(resource.name)
  const [price, setPrice] = useState(resource.price || resource.pricePerHour || 0)
  const [image, setImage] = useState(resource.image || "")

  useEffect(() => {
    setName(resource.name)
    setPrice(resource.price || resource.pricePerHour || 0)
    setImage(resource.image || "")
  }, [resource])

  const handleSave = () => {
    const updated = {
      ...resource,
      name: name.trim() || resource.name,
      image: image.trim(),
      price: resourceType === "facility" ? undefined : price,
      pricePerHour: resourceType === "facility" ? price : undefined,
    }
    onSave(updated)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0">
        <DialogTitle className="sr-only">Edit Resource</DialogTitle>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <p className="text-sm font-semibold text-foreground">Edit {resource.type}</p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">
              {resourceType === "facility" ? "Price per Hour" : "Price"}
            </label>
            <input
              type="number"
              value={price}
              onChange={(event) => setPrice(Number(event.target.value) || 0)}
              className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(event) => setImage(event.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
            />
          </div>

          {image && (
            <img src={image} alt={name} className="h-32 w-full rounded-xl object-cover" />
          )}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border border-destructive/30 px-4 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/5"
            >
              Delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="gradient-primary flex-1 rounded-xl py-2 text-xs font-semibold text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

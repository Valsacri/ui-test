"use client"

import { useState } from "react"
import { Building2, Package, Wrench } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface AddResourceModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (resource: {
    name: string
    resourceType: ResourceType
    price: number
    image: string
    description: string
  }) => void
}

type ResourceType = "facility" | "product" | "service"

const resourceTabs: { key: ResourceType; label: string; icon: typeof Building2 }[] = [
  { key: "facility", label: "Facility", icon: Building2 },
  { key: "product", label: "Product", icon: Package },
  { key: "service", label: "Service", icon: Wrench },
]

export function AddResourceModal({ isOpen, onClose, onCreate }: AddResourceModalProps) {
  const [resourceType, setResourceType] = useState<ResourceType>("facility")
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = () => {
    onCreate({
      name: name.trim(),
      resourceType,
      price,
      image: image.trim(),
      description: description.trim(),
    })
    setName("")
    setPrice(0)
    setImage("")
    setDescription("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <DialogTitle className="sr-only">Add Resource</DialogTitle>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Add Resource</p>
            <p className="text-xs text-muted-foreground">Create a facility, product, or service</p>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
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

          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Name</label>
              <input
                type="text"
                placeholder={`New ${resourceType}`}
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
                placeholder="0"
                value={price}
                onChange={(event) => setPrice(Number(event.target.value) || 0)}
                className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Image URL</label>
              <input
                type="url"
                placeholder="https://"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-border bg-muted px-4 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Description</label>
              <textarea
                rows={3}
                placeholder="Short description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-muted p-3 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="gradient-primary flex-1 rounded-xl py-2 text-xs font-semibold text-white"
            >
              Add {resourceType}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

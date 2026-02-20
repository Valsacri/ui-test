"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Folder, Plus, Edit, Trash2, Package, X } from "lucide-react"
import { marketplaceService } from "@/lib/services/marketplace"

interface CollectionsModalProps {
  open: boolean
  onClose: () => void
}

interface Collection {
  id: string
  name: string
  description: string
  productIds: string[]
  createdAt: string
}

export function CollectionsModal({ open, onClose }: CollectionsModalProps) {
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      marketplaceService.getAll().then((data: any) => {
        setProducts(Array.isArray(data) ? data : [])
      }).catch(() => { })
    }
  }, [open])

  const [collections, setCollections] = useState<Collection[]>([
    {
      id: "col-1",
      name: "Summer Collection",
      description: "Essential gear for summer sports",
      productIds: ["1", "2"],
      createdAt: "2024-01-15",
    },
    {
      id: "col-2",
      name: "Beginner Bundle",
      description: "Perfect starter pack for new athletes",
      productIds: ["1"],
      createdAt: "2024-02-10",
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [draftCollection, setDraftCollection] = useState({
    name: "",
    description: "",
    productIds: [] as string[],
  })

  const handleCreateCollection = () => {
    if (!draftCollection.name.trim()) return
    const collection: Collection = {
      id: `col-${Date.now()}`,
      name: draftCollection.name.trim(),
      description: draftCollection.description.trim(),
      productIds: draftCollection.productIds,
      createdAt: new Date().toISOString().split("T")[0],
    }
    setCollections((prev) => [...prev, collection])
    setDraftCollection({ name: "", description: "", productIds: [] })
    setIsCreating(false)
  }

  const handleUpdateCollection = () => {
    if (!editingCollection) return
    setCollections((prev) => prev.map((col) => (col.id === editingCollection.id ? editingCollection : col)))
    setEditingCollection(null)
  }

  const handleDeleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((col) => col.id !== id))
  }

  const toggleProduct = (productId: string, isEditing: boolean) => {
    if (isEditing && editingCollection) {
      const productIds = editingCollection.productIds.includes(productId)
        ? editingCollection.productIds.filter((id) => id !== productId)
        : [...editingCollection.productIds, productId]
      setEditingCollection({ ...editingCollection, productIds })
      return
    }

    const productIds = draftCollection.productIds.includes(productId)
      ? draftCollection.productIds.filter((id) => id !== productId)
      : [...draftCollection.productIds, productId]
    setDraftCollection({ ...draftCollection, productIds })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Product Collections
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {(isCreating || editingCollection) && (
            <Card className="border border-primary/40">
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    {editingCollection ? "Edit Collection" : "Create New Collection"}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsCreating(false)
                      setEditingCollection(null)
                      setDraftCollection({ name: "", description: "", productIds: [] })
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="collection-name">Collection Name</Label>
                    <Input
                      id="collection-name"
                      placeholder="e.g., Summer Collection"
                      value={editingCollection ? editingCollection.name : draftCollection.name}
                      onChange={(event) =>
                        editingCollection
                          ? setEditingCollection({ ...editingCollection, name: event.target.value })
                          : setDraftCollection({ ...draftCollection, name: event.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="collection-description">Description</Label>
                    <Textarea
                      id="collection-description"
                      placeholder="Describe this collection..."
                      value={editingCollection ? editingCollection.description : draftCollection.description}
                      onChange={(event) =>
                        editingCollection
                          ? setEditingCollection({ ...editingCollection, description: event.target.value })
                          : setDraftCollection({ ...draftCollection, description: event.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Select Products</Label>
                    <div className="mt-2 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto rounded-xl border border-border p-2 md:grid-cols-3">
                      {products.map((product) => {
                        const isSelected = editingCollection
                          ? editingCollection.productIds.includes(product.id)
                          : draftCollection.productIds.includes(product.id)
                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => toggleProduct(product.id, !!editingCollection)}
                            className={
                              "rounded-xl border px-2 py-2 text-left transition-all " +
                              (isSelected ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground")
                            }
                          >
                            <div className="flex items-center gap-2">
                              <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                              <div className="min-w-0">
                                <p className="truncate text-xs font-semibold text-foreground">{product.name}</p>
                                <p className="text-[10px] text-muted-foreground">${product.price}</p>
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={editingCollection ? handleUpdateCollection : handleCreateCollection}>
                      {editingCollection ? "Update Collection" : "Create Collection"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false)
                        setEditingCollection(null)
                        setDraftCollection({ name: "", description: "", productIds: [] })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!isCreating && !editingCollection && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Your Collections</h3>
                <Button variant="secondary" onClick={() => setIsCreating(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  New Collection
                </Button>
              </div>

              {collections.length > 0 ? (
                <div className="space-y-3">
                  {collections.map((collection) => (
                    <Card key={collection.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Folder className="h-5 w-5 text-primary" />
                              <h4 className="text-sm font-semibold text-foreground">{collection.name}</h4>
                              <Badge variant="secondary" className="text-[10px]">
                                {collection.productIds.length} products
                              </Badge>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">{collection.description}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {collection.productIds.slice(0, 4).map((productId) => {
                                const product = products.find((item) => item.id === productId)
                                return product ? (
                                  <div key={productId} className="flex items-center gap-2 rounded-full bg-muted px-2 py-1 text-[10px]">
                                    <Package className="h-3 w-3 text-muted-foreground" />
                                    {product.name}
                                  </div>
                                ) : null
                              })}
                              {collection.productIds.length > 4 && (
                                <div className="flex items-center px-2 py-1 text-[10px] text-muted-foreground">
                                  +{collection.productIds.length - 4} more
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => setEditingCollection(collection)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteCollection(collection.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border py-12 text-center">
                  <Folder className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No collections yet</p>
                  <Button variant="secondary" className="mt-4" onClick={() => setIsCreating(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Collection
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

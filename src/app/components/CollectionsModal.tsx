import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Plus, Edit, Trash2, Folder, Package, X } from 'lucide-react';
import { MOCK_BUSINESS_PRODUCTS } from '@/app/data/mockData';

interface CollectionsModalProps {
  open: boolean;
  onClose: () => void;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  productIds: string[];
  createdAt: string;
}

export function CollectionsModal({ open, onClose }: CollectionsModalProps) {
  const [collections, setCollections] = useState<Collection[]>([
    {
      id: 'col-1',
      name: 'Summer Collection',
      description: 'Essential gear for summer sports',
      productIds: ['prod-1', 'prod-2'],
      createdAt: '2024-01-15',
    },
    {
      id: 'col-2',
      name: 'Beginner Bundle',
      description: 'Perfect starter pack for new athletes',
      productIds: ['prod-1'],
      createdAt: '2024-02-10',
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: '',
    productIds: [] as string[],
  });

  const products = MOCK_BUSINESS_PRODUCTS;

  const handleCreateCollection = () => {
    if (!newCollection.name) return;

    const collection: Collection = {
      id: `col-${Date.now()}`,
      name: newCollection.name,
      description: newCollection.description,
      productIds: newCollection.productIds,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCollections([...collections, collection]);
    setNewCollection({ name: '', description: '', productIds: [] });
    setIsCreating(false);
  };

  const handleUpdateCollection = () => {
    if (!editingCollection) return;

    setCollections(
      collections.map((col) =>
        col.id === editingCollection.id ? editingCollection : col
      )
    );
    setEditingCollection(null);
  };

  const handleDeleteCollection = (id: string) => {
    setCollections(collections.filter((col) => col.id !== id));
  };

  const toggleProductInCollection = (productId: string, isEditing: boolean = false) => {
    if (isEditing && editingCollection) {
      const productIds = editingCollection.productIds.includes(productId)
        ? editingCollection.productIds.filter((id) => id !== productId)
        : [...editingCollection.productIds, productId];
      setEditingCollection({ ...editingCollection, productIds });
    } else {
      const productIds = newCollection.productIds.includes(productId)
        ? newCollection.productIds.filter((id) => id !== productId)
        : [...newCollection.productIds, productId];
      setNewCollection({ ...newCollection, productIds });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Product Collections
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create/Edit Form */}
          {(isCreating || editingCollection) && (
            <Card className="border-2 border-[#003C66]">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">
                    {editingCollection ? 'Edit Collection' : 'Create New Collection'}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingCollection(null);
                      setNewCollection({ name: '', description: '', productIds: [] });
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="collection-name">Collection Name</Label>
                    <Input
                      id="collection-name"
                      placeholder="e.g., Summer Collection"
                      value={editingCollection ? editingCollection.name : newCollection.name}
                      onChange={(e) => {
                        if (editingCollection) {
                          setEditingCollection({ ...editingCollection, name: e.target.value });
                        } else {
                          setNewCollection({ ...newCollection, name: e.target.value });
                        }
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="collection-description">Description</Label>
                    <Textarea
                      id="collection-description"
                      placeholder="Describe this collection..."
                      value={editingCollection ? editingCollection.description : newCollection.description}
                      onChange={(e) => {
                        if (editingCollection) {
                          setEditingCollection({ ...editingCollection, description: e.target.value });
                        } else {
                          setNewCollection({ ...newCollection, description: e.target.value });
                        }
                      }}
                    />
                  </div>

                  <div>
                    <Label>Select Products</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-64 overflow-y-auto p-2 border rounded-lg">
                      {products.map((product) => {
                        const isSelected = editingCollection
                          ? editingCollection.productIds.includes(product.id)
                          : newCollection.productIds.includes(product.id);

                        return (
                          <button
                            key={product.id}
                            onClick={() => toggleProductInCollection(product.id, !!editingCollection)}
                            className={`p-2 border rounded-lg text-left transition-all ${
                              isSelected
                                ? 'border-[#003C66] bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{product.name}</p>
                                <p className="text-xs text-gray-500">${product.price}</p>
                              </div>
                              {isSelected && (
                                <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={editingCollection ? handleUpdateCollection : handleCreateCollection}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {editingCollection ? 'Update Collection' : 'Create Collection'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingCollection(null);
                        setNewCollection({ name: '', description: '', productIds: [] });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Collections List */}
          {!isCreating && !editingCollection && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Your Collections</h3>
                <Button
                  onClick={() => setIsCreating(true)}
                  className="bg-[#FC8936] hover:bg-[#E67A2F] gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Collection
                </Button>
              </div>

              {collections.length > 0 ? (
                <div className="space-y-3">
                  {collections.map((collection) => (
                    <Card key={collection.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Folder className="w-5 h-5 text-[#003C66]" />
                              <h4 className="font-semibold">{collection.name}</h4>
                              <Badge variant="secondary">
                                {collection.productIds.length} products
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">{collection.description}</p>
                            
                            {/* Product Preview */}
                            <div className="flex gap-2 flex-wrap">
                              {collection.productIds.slice(0, 4).map((productId) => {
                                const product = products.find((p) => p.id === productId);
                                return product ? (
                                  <div
                                    key={productId}
                                    className="flex items-center gap-2 bg-gray-50 rounded px-2 py-1"
                                  >
                                    <Package className="w-3 h-3 text-gray-400" />
                                    <span className="text-xs">{product.name}</span>
                                  </div>
                                ) : null;
                              })}
                              {collection.productIds.length > 4 && (
                                <div className="flex items-center px-2 py-1 text-xs text-gray-500">
                                  +{collection.productIds.length - 4} more
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingCollection(collection)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCollection(collection.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Folder className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No collections yet</p>
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="bg-[#FC8936] hover:bg-[#E67A2F]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Collection
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

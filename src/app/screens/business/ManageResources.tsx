import { useState } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { TopBar } from '@/app/components/TopBar';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Building2,
  Package,
  Wrench,
  X,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  MOCK_BUSINESS_FACILITIES, 
  MOCK_BUSINESS_PRODUCTS,
  MOCK_BUSINESS_SERVICES 
} from '@/app/data/mockData';

interface ManageResourcesProps {
  onBack: () => void;
  onNotifications: () => void;
  onMessages: () => void;
  onProfile: () => void;
}

type ResourceType = 'facility' | 'product' | 'service';

interface Facility {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
  capacity?: number;
  amenities?: string[];
}

interface Product {
  id: string;
  name: string;
  type: string;
  price: number;
  stock?: number;
  description?: string;
}

interface Service {
  id: string;
  name: string;
  type: string;
  price: number;
  duration?: number;
  description?: string;
}

export function ManageResources({ 
  onBack, 
  onNotifications, 
  onMessages, 
  onProfile 
}: ManageResourcesProps) {
  const [activeTab, setActiveTab] = useState<ResourceType>('facility');
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Mock data - in a real app, these would come from state management
  const [facilities, setFacilities] = useState(MOCK_BUSINESS_FACILITIES);
  const [products, setProducts] = useState(MOCK_BUSINESS_PRODUCTS);
  const [services, setServices] = useState(MOCK_BUSINESS_SERVICES);

  const handleAddNew = () => {
    const newItem = {
      id: `new-${Date.now()}`,
      name: '',
      type: '',
      price: 0,
      pricePerHour: 0,
    };
    setEditingItem(newItem);
    setIsEditing(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editingItem.name || !editingItem.type) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (activeTab === 'facility') {
      const exists = facilities.find(f => f.id === editingItem.id);
      if (exists) {
        setFacilities(facilities.map(f => f.id === editingItem.id ? editingItem : f));
      } else {
        setFacilities([...facilities, editingItem]);
      }
    } else if (activeTab === 'product') {
      const exists = products.find(p => p.id === editingItem.id);
      if (exists) {
        setProducts(products.map(p => p.id === editingItem.id ? editingItem : p));
      } else {
        setProducts([...products, editingItem]);
      }
    } else {
      const exists = services.find(s => s.id === editingItem.id);
      if (exists) {
        setServices(services.map(s => s.id === editingItem.id ? editingItem : s));
      } else {
        setServices([...services, editingItem]);
      }
    }

    setIsEditing(false);
    setEditingItem(null);
    toast.success('Saved successfully');
  };

  const handleDelete = (id: string) => {
    if (activeTab === 'facility') {
      setFacilities(facilities.filter(f => f.id !== id));
    } else if (activeTab === 'product') {
      setProducts(products.filter(p => p.id !== id));
    } else {
      setServices(services.filter(s => s.id !== id));
    }
    toast.success('Deleted successfully');
  };

  const getCurrentItems = () => {
    switch (activeTab) {
      case 'facility':
        return facilities;
      case 'product':
        return products;
      case 'service':
        return services;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar
        title="Manage Resources"
        onNotifications={onNotifications}
        onMessages={onMessages}
        onProfile={onProfile}
        notificationCount={3}
        messageCount={2}
        showSearch={false}
      />

      <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Resource Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage your facilities, products, and services
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ResourceType)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="facility">
              <Building2 className="w-4 h-4 mr-2" />
              Facilities
            </TabsTrigger>
            <TabsTrigger value="product">
              <Package className="w-4 h-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="service">
              <Wrench className="w-4 h-4 mr-2" />
              Services
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {/* Add New Button */}
            <Button
              onClick={handleAddNew}
              className="w-full bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Button>

            {/* Items List */}
            <div className="space-y-3">
              {getCurrentItems().map((item: any) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.type}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Price: </span>
                            <span className="font-semibold text-[#003C66]">
                              ${activeTab === 'facility' ? item.pricePerHour : item.price}
                              {activeTab === 'facility' && '/hr'}
                            </span>
                          </div>
                          {item.capacity && (
                            <div>
                              <span className="text-muted-foreground">Capacity: </span>
                              <span className="font-semibold">{item.capacity}</span>
                            </div>
                          )}
                          {item.stock !== undefined && (
                            <div>
                              <span className="text-muted-foreground">Stock: </span>
                              <Badge variant={item.stock > 10 ? 'default' : 'destructive'}>
                                {item.stock}
                              </Badge>
                            </div>
                          )}
                          {item.duration && (
                            <div>
                              <span className="text-muted-foreground">Duration: </span>
                              <span className="font-semibold">{item.duration}min</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {getCurrentItems().length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No {activeTab}s added yet</p>
                  <p className="text-sm mt-1">Click the button above to add your first one</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Modal */}
      {isEditing && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {getCurrentItems().find(i => i.id === editingItem.id) ? 'Edit' : 'Add'} {activeTab}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingItem(null);
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  placeholder={`e.g., ${activeTab === 'facility' ? 'Basketball Court' : activeTab === 'product' ? 'Running Shoes' : 'Personal Training'}`}
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label>Type *</Label>
                <Input
                  placeholder={`e.g., ${activeTab === 'facility' ? 'Sports Court' : activeTab === 'product' ? 'Footwear' : 'Coaching'}`}
                  value={editingItem.type}
                  onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value })}
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label>Price {activeTab === 'facility' && 'per Hour'} ($) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={activeTab === 'facility' ? editingItem.pricePerHour : editingItem.price}
                  onChange={(e) => setEditingItem({ 
                    ...editingItem, 
                    [activeTab === 'facility' ? 'pricePerHour' : 'price']: Number(e.target.value) 
                  })}
                />
              </div>

              {/* Facility-specific fields */}
              {activeTab === 'facility' && (
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="Maximum number of people"
                    value={editingItem.capacity || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, capacity: Number(e.target.value) })}
                  />
                </div>
              )}

              {/* Product-specific fields */}
              {activeTab === 'product' && (
                <>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Available quantity"
                      value={editingItem.stock || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, stock: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Product description..."
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* Service-specific fields */}
              {activeTab === 'service' && (
                <>
                  <div className="space-y-2">
                    <Label>Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="15"
                      step="15"
                      placeholder="e.g., 60"
                      value={editingItem.duration || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, duration: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Service description..."
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingItem(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleSave}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

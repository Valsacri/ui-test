import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Plus, X, Search, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';

interface ResourceItem {
  id: string;
  name: string;
  type: 'facility' | 'product' | 'service';
  price: number;
  category?: string;
  description?: string;
  image?: string;
  businessName?: string;
}

interface ResourceSelectorProps {
  resources: ResourceItem[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onDeselect: (id: string) => void;
  onAddExternal: (name: string, type: 'facility' | 'product' | 'service', details: any) => void;
  multiSelect?: boolean;
  categoryFilter?: string;
}

export function ResourceSelector({
  resources,
  selectedIds,
  onSelect,
  onDeselect,
  onAddExternal,
  multiSelect = true,
  categoryFilter,
}: ResourceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddExternalOpen, setIsAddExternalOpen] = useState(false);
  const [externalForm, setExternalForm] = useState({
    name: '',
    type: 'service' as 'facility' | 'product' | 'service',
    price: 0,
    description: '',
  });

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.businessName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || r.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const groupedByType = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<string, ResourceItem[]>);

  const handleAddExternal = () => {
    if (externalForm.name.trim()) {
      onAddExternal(externalForm.name, externalForm.type, {
        price: externalForm.price,
        description: externalForm.description,
      });
      setExternalForm({ name: '', type: 'service', price: 0, description: '' });
      setIsAddExternalOpen(false);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      facility: 'Facilities',
      product: 'Products',
      service: 'Services',
    };
    return labels[type] || type;
  };

  const getPriceDisplay = (resource: ResourceItem) => {
    if ('pricePerHour' in resource) return `$${resource.pricePerHour}/hr`;
    if ('pricePerUnit' in resource) return `$${resource.pricePerUnit}/unit`;
    return `$${resource.price}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search resources, partners, facilities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isAddExternalOpen} onOpenChange={setIsAddExternalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add External
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add External Provider</DialogTitle>
              <DialogDescription>
                Add a provider or resource not listed in the system
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="external-name">Name</Label>
                <Input
                  id="external-name"
                  placeholder="e.g., Local Catering Company"
                  value={externalForm.name}
                  onChange={(e) => setExternalForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="external-type">Type</Label>
                <select
                  id="external-type"
                  className="w-full px-3 py-2 border rounded-md"
                  value={externalForm.type}
                  onChange={(e) => setExternalForm(prev => ({ 
                    ...prev, 
                    type: e.target.value as 'facility' | 'product' | 'service' 
                  }))}
                >
                  <option value="service">Service</option>
                  <option value="product">Product</option>
                  <option value="facility">Facility</option>
                </select>
              </div>
              <div>
                <Label htmlFor="external-price">Price</Label>
                <Input
                  id="external-price"
                  type="number"
                  placeholder="0.00"
                  value={externalForm.price}
                  onChange={(e) => setExternalForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="external-desc">Description</Label>
                <textarea
                  id="external-desc"
                  placeholder="Add details about this provider..."
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                  value={externalForm.description}
                  onChange={(e) => setExternalForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <Button onClick={handleAddExternal} className="w-full">
                Add Provider
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="facility">Facilities</TabsTrigger>
          <TabsTrigger value="product">Products</TabsTrigger>
          <TabsTrigger value="service">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {Object.entries(groupedByType).map(([type, items]) => (
            <div key={type} className="space-y-3">
              <h3 className="text-sm font-semibold">{getTypeLabel(type)}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map(resource => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    isSelected={selectedIds.includes(resource.id)}
                    onSelect={() => onSelect(resource.id)}
                    onDeselect={() => onDeselect(resource.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {['facility', 'product', 'service'].map(type => (
          <TabsContent key={type} value={type} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groupedByType[type]?.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  isSelected={selectedIds.includes(resource.id)}
                  onSelect={() => onSelect(resource.id)}
                  onDeselect={() => onDeselect(resource.id)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface ResourceCardProps {
  resource: ResourceItem;
  isSelected: boolean;
  onSelect: () => void;
  onDeselect: () => void;
}

function ResourceCard({
  resource,
  isSelected,
  onSelect,
  onDeselect,
}: ResourceCardProps) {
  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
          : 'border-border hover:border-primary/50'
      }`}
      onClick={() => isSelected ? onDeselect() : onSelect()}
    >
      {resource.image && (
        <img
          src={resource.image}
          alt={resource.name}
          className="w-full h-32 object-cover rounded mb-3"
        />
      )}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{resource.name}</h4>
            {resource.businessName && (
              <p className="text-xs text-muted-foreground">{resource.businessName}</p>
            )}
          </div>
          <div className="ml-2">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
              isSelected ? 'bg-primary border-primary' : 'border-border'
            }`}>
              {isSelected && <span className="text-white text-xs">✓</span>}
            </div>
          </div>
        </div>
        {resource.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{resource.description}</p>
        )}
        <div className="flex items-center justify-between pt-2 border-t">
          <Badge variant="outline" className="text-xs">
            {resource.category || resource.type}
          </Badge>
          <span className="text-sm font-semibold">${resource.price}</span>
        </div>
      </div>
    </div>
  );
}

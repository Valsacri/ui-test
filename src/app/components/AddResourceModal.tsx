import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { X, Building2, Package, Wrench } from 'lucide-react';

interface AddResourceModalProps {
  onClose: () => void;
}

export function AddResourceModal({ onClose }: AddResourceModalProps) {
  const [resourceType, setResourceType] = useState<'facility' | 'product' | 'service'>('facility');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Adding new resource');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Add New Resource</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={resourceType} onValueChange={(value) => setResourceType(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="facility" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Facility
              </TabsTrigger>
              <TabsTrigger value="product" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Product
              </TabsTrigger>
              <TabsTrigger value="service" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Service
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <TabsContent value="facility" className="space-y-4 mt-0">
                <div>
                  <Label htmlFor="facility-name">Facility Name</Label>
                  <Input id="facility-name" placeholder="e.g., Main Gym Floor" required />
                </div>
                <div>
                  <Label htmlFor="facility-description">Description</Label>
                  <textarea
                    id="facility-description"
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Describe your facility..."
                  />
                </div>
                <div>
                  <Label htmlFor="facility-price">Price per Hour ($)</Label>
                  <Input id="facility-price" type="number" placeholder="150" required />
                </div>
                <div>
                  <Label htmlFor="facility-image">Image URL</Label>
                  <Input id="facility-image" type="url" placeholder="https://..." />
                </div>
              </TabsContent>

              <TabsContent value="product" className="space-y-4 mt-0">
                <div>
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input id="product-name" placeholder="e.g., Protein Shake" required />
                </div>
                <div>
                  <Label htmlFor="product-description">Description</Label>
                  <textarea
                    id="product-description"
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Describe your product..."
                  />
                </div>
                <div>
                  <Label htmlFor="product-price">Price ($)</Label>
                  <Input id="product-price" type="number" placeholder="8" required />
                </div>
                <div>
                  <Label htmlFor="product-image">Image URL</Label>
                  <Input id="product-image" type="url" placeholder="https://..." />
                </div>
              </TabsContent>

              <TabsContent value="service" className="space-y-4 mt-0">
                <div>
                  <Label htmlFor="service-name">Service Name</Label>
                  <Input id="service-name" placeholder="e.g., Personal Training Session" required />
                </div>
                <div>
                  <Label htmlFor="service-description">Description</Label>
                  <textarea
                    id="service-description"
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Describe your service..."
                  />
                </div>
                <div>
                  <Label htmlFor="service-price">Price ($)</Label>
                  <Input id="service-price" type="number" placeholder="80" required />
                </div>
                <div>
                  <Label htmlFor="service-duration">Duration (minutes)</Label>
                  <Input id="service-duration" type="number" placeholder="60" />
                </div>
                <div>
                  <Label htmlFor="service-image">Image URL</Label>
                  <Input id="service-image" type="url" placeholder="https://..." />
                </div>
              </TabsContent>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-primary hover:bg-[#002A4A]">
                  Add {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
                </Button>
              </div>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

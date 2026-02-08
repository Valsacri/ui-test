import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { X } from 'lucide-react';

interface EditResourceModalProps {
  resource: {
    id: string;
    name: string;
    type: string;
    price?: number;
    pricePerHour?: number;
    image?: string;
  };
  resourceType: 'facility' | 'product' | 'service';
  onClose: () => void;
  onDelete?: () => void;
}

export function EditResourceModal({ resource, resourceType, onClose, onDelete }: EditResourceModalProps) {
  const [name, setName] = useState(resource.name);
  const [price, setPrice] = useState(resource.price || resource.pricePerHour || 0);
  const [image, setImage] = useState(resource.image || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Updating resource', { name, price, image });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${resource.name}"?`)) {
      onDelete?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Edit {resource.type}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="resource-name">Name</Label>
              <Input 
                id="resource-name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
            <div>
              <Label htmlFor="resource-price">
                {resourceType === 'facility' ? 'Price per Hour ($)' : 'Price ($)'}
              </Label>
              <Input 
                id="resource-price" 
                type="number" 
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required 
              />
            </div>
            <div>
              <Label htmlFor="resource-image">Image URL</Label>
              <Input 
                id="resource-image" 
                type="url" 
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>

            {image && (
              <div className="border rounded-lg overflow-hidden">
                <img src={image} alt={name} className="w-full h-32 object-cover" />
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleDelete}
              >
                Delete
              </Button>
              <div className="flex-1 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-[#003C66] hover:bg-[#002A4A]">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

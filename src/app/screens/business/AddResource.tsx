import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { ArrowLeft, Building2, Package, Wrench, Upload, Plus, X } from 'lucide-react';

interface AddResourceProps {
  onBack: () => void;
  onSubmit?: (resourceData: any) => void;
}

type ResourceType = 'facility' | 'product' | 'service';

export function AddResource({ onBack, onSubmit }: AddResourceProps) {
  const [resourceType, setResourceType] = useState<ResourceType>('facility');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    location: '',
    capacity: '',
    category: '',
    features: [] as string[],
    images: [] as string[],
  });
  const [currentFeature, setCurrentFeature] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    if (onSubmit) {
      onSubmit({
        type: resourceType,
        ...formData,
      });
    }
    onBack();
  };

  const addFeature = () => {
    if (currentFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, currentFeature.trim()],
      });
      setCurrentFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Resource</h1>
              <p className="text-gray-600 mt-1">Create a new facility, product, or service</p>
            </div>
          </div>

          {/* Resource Type Selection */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => setResourceType('facility')}
              className={`p-4 rounded-xl border-2 transition-all ${
                resourceType === 'facility'
                  ? 'border-[#003C66] bg-[#003C66]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building2 className={`w-8 h-8 mx-auto mb-2 ${
                resourceType === 'facility' ? 'text-[#003C66]' : 'text-gray-400'
              }`} />
              <p className={`font-semibold ${
                resourceType === 'facility' ? 'text-[#003C66]' : 'text-gray-700'
              }`}>
                Facility
              </p>
              <p className="text-xs text-gray-500 mt-1">Gyms, courts, studios</p>
            </button>

            <button
              onClick={() => setResourceType('product')}
              className={`p-4 rounded-xl border-2 transition-all ${
                resourceType === 'product'
                  ? 'border-[#FC8936] bg-[#FC8936]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Package className={`w-8 h-8 mx-auto mb-2 ${
                resourceType === 'product' ? 'text-[#FC8936]' : 'text-gray-400'
              }`} />
              <p className={`font-semibold ${
                resourceType === 'product' ? 'text-[#FC8936]' : 'text-gray-700'
              }`}>
                Product
              </p>
              <p className="text-xs text-gray-500 mt-1">Equipment, gear, apparel</p>
            </button>

            <button
              onClick={() => setResourceType('service')}
              className={`p-4 rounded-xl border-2 transition-all ${
                resourceType === 'service'
                  ? 'border-green-600 bg-green-600/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Wrench className={`w-8 h-8 mx-auto mb-2 ${
                resourceType === 'service' ? 'text-green-600' : 'text-gray-400'
              }`} />
              <p className={`font-semibold ${
                resourceType === 'service' ? 'text-green-600' : 'text-gray-700'
              }`}>
                Service
              </p>
              <p className="text-xs text-gray-500 mt-1">Training, coaching, therapy</p>
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit}>
          <Card className="p-8">
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {resourceType === 'facility' ? 'Facility Name' : resourceType === 'product' ? 'Product Name' : 'Service Name'} *
                    </label>
                    <Input
                      required
                      placeholder={`Enter ${resourceType} name`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <Textarea
                      required
                      placeholder="Provide a detailed description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {resourceType === 'facility' ? 'Price per Hour' : 'Price'} *
                      </label>
                      <Input
                        required
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <Input
                        placeholder={resourceType === 'facility' ? 'e.g., Basketball Court' : resourceType === 'product' ? 'e.g., Running Shoes' : 'e.g., Personal Training'}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      />
                    </div>
                  </div>

                  {resourceType === 'facility' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <Input
                          placeholder="Enter location"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capacity
                        </label>
                        <Input
                          type="number"
                          placeholder="Max number of people"
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features/Amenities */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {resourceType === 'facility' ? 'Amenities' : resourceType === 'product' ? 'Features' : 'Offerings'}
                </h2>
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder={`Add ${resourceType === 'facility' ? 'amenity' : resourceType === 'product' ? 'feature' : 'offering'}`}
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {formData.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-3 py-1 bg-gray-50 text-gray-700 border-gray-300 flex items-center gap-2"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Images */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Images</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#FC8936] transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white"
              >
                Create {resourceType === 'facility' ? 'Facility' : resourceType === 'product' ? 'Product' : 'Service'}
              </Button>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
}

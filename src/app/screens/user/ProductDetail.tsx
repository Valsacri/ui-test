import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { ArrowLeft, Star, Share2, Bookmark, ShoppingCart, Minus, Plus } from 'lucide-react';
import { PRODUCTS } from '@/app/data/exploreData';
import { toast } from 'sonner';

interface ProductDetailProps {
  productId: string;
  onBack: () => void;
}

export function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  
  const product = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    toast.success(`Added ${quantity}x ${product.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-20">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white"
          onClick={onBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/90 hover:bg-white"
            onClick={() => toast('Share feature coming soon!')}
          >
            <Share2 className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/90 hover:bg-white"
            onClick={() => toast('Saved to wishlist!')}
          >
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4">{/* removed -mt-8 */}
        <Card className="mb-4">
          <CardContent className="p-6">
            {/* Product Image */}
            <div className="mb-6 -mx-6 -mt-6">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Title & Price */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-2xl font-bold flex-1">{product.name}</h1>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">${product.price}</p>
                  {product.originalPrice && (
                    <p className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} reviews)</span>
                </div>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Product Description</h3>
              <p className="text-muted-foreground">
                High-quality {product.name.toLowerCase()} designed for optimal performance. 
                Made with premium materials and built to last. Perfect for {product.category.toLowerCase()} 
                enthusiasts of all levels.
              </p>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Key Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Premium quality materials</li>
                <li>• Durable construction</li>
                <li>• Professional grade</li>
                <li>• Suitable for all skill levels</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Reviews */}
        <Card className="mb-4">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <span className="font-medium text-sm">Customer {i}</span>
                    <span className="text-xs text-muted-foreground">{i} week ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Excellent product! Exactly as described and great quality.
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
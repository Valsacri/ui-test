import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { spacing, elevation, iconSize } from '@/lib/design-system';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  brand: string;
  business?: string;
  inStock: boolean;
  discount?: number;
  onClick: () => void;
  userType?: 'user' | 'business' | 'squad';
}

export function ProductCard({
  name,
  category,
  image,
  price,
  rating,
  reviews,
  brand,
  business,
  inStock,
  discount,
  onClick,
  userType,
}: ProductCardProps) {
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card 
        className={`overflow-hidden cursor-pointer ${elevation.low} hover:shadow-lg transition-shadow duration-200`}
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-orange-50">
          <motion.img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          {discount && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-md text-sm font-bold px-2 py-1">
              -{discount}%
            </Badge>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <CardContent className={`p-4 ${spacing.sm}`}>
          {/* Brand & Name */}
          <div className="mb-3">
            <Badge variant="outline" className="text-[#FC8936] border-[#FC8936] mb-2 text-xs">
              {brand}
            </Badge>
            <h3 className="font-semibold text-base leading-tight line-clamp-2 text-gray-900 mb-1">{name}</h3>
            {business && <p className="text-xs text-[#FC8936] font-medium">{business}</p>}
            {!business && <p className="text-xs text-gray-500">{category}</p>}
          </div>

          {/* Rating */}
          <div className={`flex items-center ${spacing.xs} mb-3`}>
            <div className={`flex items-center ${spacing.xs}`}>
              <Star className={`${iconSize.sm} fill-yellow-400 text-yellow-400`} />
              <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500">({reviews.toLocaleString()} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-3 pb-3 border-t border-gray-100 pt-3">
            {discount ? (
              <div className={`flex items-baseline ${spacing.xs}`}>
                <span className="font-bold text-xl text-[#003C66]">${discountedPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-400 line-through">
                  ${price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="font-bold text-xl text-[#003C66]">${price.toFixed(2)}</span>
            )}
          </div>

          {/* Action Button */}
          {userType && (
            <div className={`flex ${spacing.xs}`}>
              {userType === 'user' || userType === 'squad' ? (
                <>
                  <Button
                    className="flex-1 bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white shadow-sm"
                    size="default"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (inStock) {
                        toast.success('Added to cart!');
                      }
                    }}
                    disabled={!inStock}
                  >
                    <ShoppingCart className={`${iconSize.sm} mr-2`} />
                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-[#003C66] text-[#003C66] hover:bg-[#003C66] hover:text-white transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Eye className={`${iconSize.sm} mr-2`} />
                  View Product
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
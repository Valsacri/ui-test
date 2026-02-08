import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  brand: string;
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
  inStock,
  discount,
  onClick,
  userType,
}: ProductCardProps) {
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 border-gray-200" 
        onClick={onClick}
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-green-50">
          <motion.img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          {discount && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg text-sm font-bold">
              -{discount}%
            </Badge>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Brand & Name */}
          <div>
            <p className="text-xs text-[#FC8936] font-medium mb-1">{brand}</p>
            <h3 className="font-semibold text-base leading-tight line-clamp-2">{name}</h3>
            <p className="text-xs text-gray-500 mt-1">{category}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500">({reviews.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="pt-1">
            <div className="mb-3">
              {discount ? (
                <div className="flex items-baseline gap-2">
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
              <div className="flex gap-2">
                {userType === 'user' || userType === 'squad' ? (
                  <>
                    <Button
                      className="flex-1 bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (inStock) {
                          toast.success('Added to cart!');
                        }
                      }}
                      disabled={!inStock}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {inStock ? 'Add to Cart' : 'Out of Stock'}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full border-[#003C66] text-[#003C66] hover:bg-[#003C66] hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Product
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
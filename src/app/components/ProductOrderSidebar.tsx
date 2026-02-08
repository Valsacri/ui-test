import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';
import { Minus, Plus, ShoppingCart, Package, Truck, Shield } from 'lucide-react';

interface ProductOrderSidebarProps {
  productName: string;
  productImage: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  onAddToCart: (quantity: number) => void;
}

export function ProductOrderSidebar({
  productName,
  productImage,
  price,
  originalPrice,
  rating,
  reviews,
  inStock,
  onAddToCart
}: ProductOrderSidebarProps) {
  const [quantity, setQuantity] = useState(1);

  const calculateTotal = () => {
    return price * quantity;
  };

  const shippingFee = calculateTotal() > 100 ? 0 : 9.99;
  const totalPrice = calculateTotal() + shippingFee;

  const handleAddToCart = () => {
    onAddToCart(quantity);
  };

  return (
    <Card className="sticky top-24 border-2">
      <CardContent className="p-6 space-y-4">
        {/* Product Preview */}
        <div className="flex gap-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{productName}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="text-yellow-500">★</span>
              <span>{rating}</span>
              <span>({reviews})</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Price */}
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">${price}</span>
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ${originalPrice}
              </span>
            )}
          </div>
          {originalPrice && (
            <p className="text-sm text-green-600 font-medium mt-1">
              Save ${(originalPrice - price).toFixed(2)} ({Math.round(((originalPrice - price) / originalPrice) * 100)}% off)
            </p>
          )}
        </div>

        <Separator />

        {/* Stock Status */}
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-green-600" />
          <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Quantity Selector */}
        <div>
          <label className="text-sm font-medium mb-2 block">Quantity</label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="font-medium w-12 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              disabled={!inStock}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              ${price} × {quantity}
            </span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
              {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
            </span>
          </div>
          {shippingFee > 0 && (
            <p className="text-xs text-muted-foreground">
              Free shipping on orders over $100
            </p>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          size="lg"
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>

        {/* Features */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="w-4 h-4" />
            <span>Fast delivery in 2-3 days</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>30-day return policy</span>
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground pt-2">
          Secure checkout with buyer protection
        </p>
      </CardContent>
    </Card>
  );
}

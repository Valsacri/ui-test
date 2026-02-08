import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Search, SlidersHorizontal, Star, Heart, TrendingUp, ShoppingBag, Zap, X, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { MarketplaceFilterSidebar, FilterState } from '@/app/components/MarketplaceFilterSidebar';
import { PRODUCTS as IMPORTED_PRODUCTS } from '@/app/data/exploreData';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';

interface MarketplaceProps {
  onProductDetail: (productId: string) => void;
  onStoreDetail: (storeId: string) => void;
  onNotifications: () => void;
  onMessages: () => void;
  onProfile: () => void;
  onSwitchProfile: (type: 'user' | 'business') => void;
  onNavigate?: (destination: string) => void;
  setRightSidebar?: (content: React.ReactNode | null) => void;
}

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  sport?: string;
  inStock: boolean;
  isFeatured?: boolean;
}

interface StoreData {
  id: string;
  name: string;
  logo: string;
  description: string;
  productCount: number;
  rating: number;
}

const STORES: StoreData[] = [
  {
    id: 'decathlon',
    name: 'Decathlon',
    logo: '🏃',
    description: 'Sports equipment for all',
    productCount: 245,
    rating: 4.6
  },
  {
    id: 'nike',
    name: 'Nike',
    logo: '✓',
    description: 'Just Do It',
    productCount: 189,
    rating: 4.8
  },
  {
    id: 'adidas',
    name: 'Adidas',
    logo: '⚡',
    description: 'Impossible is Nothing',
    productCount: 203,
    rating: 4.7
  },
  {
    id: 'underarmour',
    name: 'Under Armour',
    logo: '🎯',
    description: 'Performance gear',
    productCount: 156,
    rating: 4.5
  }
];

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Air Zoom Pegasus 40',
    brand: 'Nike',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.8,
    reviewCount: 1234,
    image: 'nike running shoes',
    category: 'footwear',
    inStock: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Ultraboost Light',
    brand: 'Adidas',
    price: 189.99,
    rating: 4.7,
    reviewCount: 892,
    image: 'adidas running shoes',
    category: 'footwear',
    inStock: true,
    isFeatured: true
  },
  {
    id: '3',
    name: 'Yoga Mat Pro',
    brand: 'Decathlon',
    price: 34.99,
    originalPrice: 49.99,
    rating: 4.5,
    reviewCount: 567,
    image: 'yoga mat purple',
    category: 'equipment',
    inStock: true
  },
  {
    id: '4',
    name: 'HeatGear Compression Shirt',
    brand: 'Under Armour',
    price: 39.99,
    rating: 4.6,
    reviewCount: 432,
    image: 'compression shirt sports',
    category: 'apparel',
    inStock: true
  },
  {
    id: '5',
    name: 'Dri-FIT Training Top',
    brand: 'Nike',
    price: 44.99,
    rating: 4.7,
    reviewCount: 678,
    image: 'nike training shirt',
    category: 'apparel',
    inStock: true
  },
  {
    id: '6',
    name: 'Pro Resistance Bands Set',
    brand: 'Decathlon',
    price: 24.99,
    rating: 4.4,
    reviewCount: 345,
    image: 'resistance bands colorful',
    category: 'equipment',
    inStock: true
  },
  {
    id: '7',
    name: 'Performance Duffle Bag',
    brand: 'Adidas',
    price: 59.99,
    originalPrice: 79.99,
    rating: 4.6,
    reviewCount: 289,
    image: 'sports duffle bag',
    category: 'accessories',
    inStock: true
  },
  {
    id: '8',
    name: 'Smart Fitness Tracker',
    brand: 'Under Armour',
    price: 149.99,
    rating: 4.5,
    reviewCount: 512,
    image: 'fitness tracker watch',
    category: 'accessories',
    inStock: false
  }
];

export function Marketplace({ 
  onProductDetail, 
  onStoreDetail,
  onNotifications,
  onMessages,
  onProfile,
  onSwitchProfile,
  onNavigate,
  setRightSidebar
}: MarketplaceProps) {
  const [activeTab, setActiveTab] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeProductType, setActiveProductType] = useState('all');
  const [activeSubcategory, setActiveSubcategory] = useState('all');
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 500],
    brands: [],
    ratings: [],
    inStock: false,
    onSale: false
  });

  // Show filter sidebar on mount
  useEffect(() => {
    if (setRightSidebar) {
      setRightSidebar(
        <MarketplaceFilterSidebar
          onApplyFilters={(newFilters) => {
            setFilters(newFilters);
          }}
          activeProductType={activeProductType}
          onProductTypeChange={(type) => {
            setActiveProductType(type);
            setActiveSubcategory('all'); // Reset subcategory when type changes
          }}
        />
      );
    }

    // Cleanup: remove sidebar when component unmounts
    return () => {
      if (setRightSidebar) {
        setRightSidebar(null);
      }
    };
  }, [setRightSidebar, activeProductType]);

  // Product type hierarchy
  const productTypes = {
    all: { label: 'All', subcategories: [] },
    clothes: { 
      label: 'Clothes', 
      subcategories: ['Shoes', 'Jackets', 'Trousers', 'Shirts', 'Shorts', 'Socks']
    },
    equipment: { 
      label: 'Equipment', 
      subcategories: ['Fitness', 'Training', 'Sports Gear', 'Mats', 'Weights']
    },
    accessories: { 
      label: 'Accessories', 
      subcategories: ['Bags', 'Watches', 'Bottles', 'Towels', 'Bands']
    },
    nutrition: { 
      label: 'Nutrition', 
      subcategories: ['Protein', 'Supplements', 'Drinks', 'Snacks']
    },
  };

  // Convert imported products to marketplace format
  const MARKETPLACE_PRODUCTS: Product[] = IMPORTED_PRODUCTS.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    price: p.price,
    originalPrice: p.originalPrice,
    rating: p.rating,
    reviewCount: p.reviews || 0,
    image: p.image,
    category: p.category.toLowerCase().replace(/ /g, '-'),
    inStock: p.inStock,
    isFeatured: false
  }));

  const filteredProducts = MARKETPLACE_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by product type and subcategory
    let matchesType = true;
    if (activeProductType !== 'all') {
      // Map product categories to types
      const typeMapping: { [key: string]: string } = {
        'footwear': 'clothes',
        'apparel': 'clothes',
        'equipment': 'equipment',
        'accessories': 'accessories',
        'running-shoes': 'clothes',
        'yoga-equipment': 'equipment',
        'fitness-tracker': 'accessories',
        'hydration': 'accessories',
      };
      matchesType = typeMapping[product.category] === activeProductType;
    }
    
    // Apply filters
    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
    const matchesBrand = filters.brands.length === 0 || filters.brands.includes(product.brand);
    const matchesRating = filters.ratings.length === 0 || filters.ratings.some(rating => product.rating >= rating);
    const matchesStock = !filters.inStock || product.inStock;
    const matchesSale = !filters.onSale || product.originalPrice !== undefined;
    
    return matchesSearch && matchesType && matchesPrice && matchesBrand && matchesRating && matchesStock && matchesSale;
  });

  const featuredProducts = MARKETPLACE_PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Banner */}
        <Card className="bg-gradient-to-r from-[#003C66] to-[#005A99] text-white overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Sports Marketplace</h1>
                <p className="text-white/80 mb-4">
                  Discover gear from top brands
                </p>
                <Button className="bg-[#FC8936] hover:bg-[#E67A2E] text-white">
                  <Zap className="w-4 h-4 mr-2" />
                  Flash Deals
                </Button>
              </div>
              <ShoppingBag className="w-24 h-24 opacity-20" />
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search products, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 h-12"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Featured Stores */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-lg">Featured Stores</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {STORES.map((store) => (
              <Card 
                key={store.id}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                onClick={() => onStoreDetail(store.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-2xl mx-auto mb-2">
                    {store.logo}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{store.name}</h3>
                  <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{store.rating}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{store.productCount} products</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        {searchQuery === '' && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-[#FC8936]" />
              <h2 className="font-bold text-lg">Trending Now</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featuredProducts.map((product) => (
                <Card 
                  key={product.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => onProductDetail(product.id)}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {product.originalPrice && (
                        <Badge className="absolute top-2 right-2 bg-[#FC8936]">
                          Sale
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 left-2 bg-white/90 hover:bg-white"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                      <div className="flex items-center gap-1 mb-2 text-xs">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-muted-foreground">({product.reviewCount})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#003C66]">${product.price}</span>
                        {product.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle add to cart
                        }}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div>
          <h2 className="font-bold text-lg mb-3">Shop by Category</h2>
          <Tabs value={activeProductType}>
            {/* Subcategories - shown when a product type is selected */}
            {activeProductType !== 'all' && productTypes[activeProductType as keyof typeof productTypes].subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  key="all-sub"
                  variant={activeSubcategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveSubcategory('all')}
                  className={activeSubcategory === 'all' ? 'bg-primary' : ''}
                >
                  All {productTypes[activeProductType as keyof typeof productTypes].label}
                </Button>
                {productTypes[activeProductType as keyof typeof productTypes].subcategories.map((subcat) => (
                  <Button
                    key={subcat}
                    variant={activeSubcategory === subcat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveSubcategory(subcat)}
                    className={activeSubcategory === subcat ? 'bg-primary' : ''}
                  >
                    {subcat}
                  </Button>
                ))}
              </div>
            )}

            <TabsContent value={activeProductType} className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => onProductDetail(product.id)}
                  >
                    <CardContent className="p-0">
                      <div className="relative">
                        <div className="aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <Badge variant="secondary">Out of Stock</Badge>
                          </div>
                        )}
                        {product.originalPrice && product.inStock && (
                          <Badge className="absolute top-2 right-2 bg-[#FC8936]">
                            Sale
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 left-2 bg-white/90 hover:bg-white"
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                        <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                        <div className="flex items-center gap-1 mb-2 text-xs">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{product.rating}</span>
                          <span className="text-muted-foreground">({product.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-[#003C66]">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-[#FC8936] to-[#E67A2E] hover:from-[#E67A2E] hover:to-[#D66B25] text-white"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle add to cart
                          }}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No products found</p>
                  <p className="text-sm mt-1">Try a different search or category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
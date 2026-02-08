import { PRODUCTS } from '@/app/data/exploreData';
import { ProductCard } from '@/app/components/ProductCard';
import { ShoppingBag, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';

interface ProductsProps {
  onProductClick: (productId: string) => void;
}

export function Products({ onProductClick }: ProductsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter products based on search and filters
  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const uniqueCategories = Array.from(new Set(PRODUCTS.map(p => p.category)));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader
          title="Products"
          subtitle="Shop sports gear and equipment"
          icon={<ShoppingBag className="w-6 h-6 text-[#FC8936]"/>}
          filterControls={
            <FilterBar
              inline
              search={{
                value: searchQuery,
                onChange: setSearchQuery,
                placeholder: 'Search products...',
              }}
              filters={[
                {
                  id: 'category',
                  label: 'Category',
                  value: categoryFilter,
                  onChange: setCategoryFilter,
                  placeholder: 'All Categories',
                  options: [
                    { label: 'All Categories', value: 'all' },
                    ...uniqueCategories.map(cat => ({ label: cat, value: cat })),
                  ],
                },
              ]}
              showFilters={showFilters}
              onToggleFilters={setShowFilters}
            />
          }
        >
          {/* Filter Panel */}
          {showFilters && (
            <FilterBar
              filters={[
                {
                  id: 'category',
                  label: 'Category',
                  value: categoryFilter,
                  onChange: setCategoryFilter,
                  placeholder: 'All Categories',
                  options: [
                    { label: 'All Categories', value: 'all' },
                    ...uniqueCategories.map(cat => ({ label: cat, value: cat })),
                  ],
                },
              ]}
              showFilters={true}
              showToggle={false}
            />
          )}

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending
            </Button>
            <Button variant="outline" size="sm">
              New Arrivals
            </Button>
            <Button variant="outline" size="sm">
              On Sale
            </Button>
          </div>
        </PageHeader>
      </div>

      {/* Products Grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onClick={() => onProductClick(product.id)}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground mb-2">No products found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
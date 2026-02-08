import { PRODUCTS } from '@/app/data/exploreData';
import { ProductCard } from '@/app/components/ProductCard';
import { ShoppingBag, TrendingUp, Sparkles, Tag } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';
import { EmptyState } from '@/app/components/EmptyState';
import { LoadingGrid, LoadingProductCard } from '@/app/components/LoadingCard';
import { spacing, responsive, touchTarget } from '@/lib/design-system';

interface ProductsProps {
  onProductClick: (productId: string) => void;
  userType?: 'user' | 'business' | 'squad';
}

export function Products({ onProductClick, userType = 'user' }: ProductsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading] = useState(false); // In real app, this would track actual loading state

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

  const hasActiveFilters = categoryFilter !== 'all' || searchQuery !== '';

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className={`${responsive.maxReading} ${responsive.containerPadding} py-6`}>
        <PageHeader
          title="Products"
          subtitle="Shop sports gear and equipment"
          icon={<ShoppingBag className="w-6 h-6 text-[#FC8936]"/>}
          filterControls={
            <FilterBar
              inline
              showToggle={false}
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
          <div className={`flex flex-wrap ${spacing.xs} mt-4`}>
            <Button variant="outline" size="sm" className={`${spacing.xs} ${touchTarget.md}`}>
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Trending</span>
            </Button>
            <Button variant="outline" size="sm" className={`${spacing.xs} ${touchTarget.md}`}>
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">New Arrivals</span>
            </Button>
            <Button variant="outline" size="sm" className={touchTarget.md}>
              <Tag className="w-4 h-4" />
              <span className="hidden sm:inline">On Sale</span>
            </Button>
          </div>
        </PageHeader>
      </div>

      {/* Products Content */}
      <div className={`${responsive.maxReading} ${responsive.containerPadding}`}>
        {!isLoading && filteredProducts.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
            </p>
          </div>
        )}

        {isLoading ? (
          <LoadingGrid count={6} CardComponent={LoadingProductCard} />
        ) : filteredProducts.length > 0 ? (
          <div className={`grid ${responsive.gridThree} ${spacing.md}`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onClick={() => onProductClick(product.id)}
                userType={userType}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ShoppingBag}
            title={hasActiveFilters ? "No products match your search" : "No products available"}
            description={
              hasActiveFilters
                ? "Try adjusting your search or filter to find what you're looking for."
                : "Check back soon for new products and gear."
            }
            action={
              hasActiveFilters
                ? {
                    label: "Clear Filters",
                    onClick: () => {
                      setSearchQuery('');
                      setCategoryFilter('all');
                    },
                    variant: "default",
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  );
}
import { SERVICES } from '@/app/data/exploreData';
import { ServiceCard } from '@/app/components/ServiceCard';
import { Wrench, TrendingUp, Award } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';

interface ServicesProps {
  onServiceClick: (serviceId: string) => void;
}

export function Services({ onServiceClick }: ServicesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter services based on search and filters
  const filteredServices = SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const uniqueCategories = Array.from(new Set(SERVICES.map(s => s.category)));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader
          title="Services"
          subtitle="Book training, coaching, and wellness services"
          icon={<Wrench className="w-6 h-6 text-[#003C66]"/>}
          filterControls={
            <FilterBar
              inline
              search={{
                value: searchQuery,
                onChange: setSearchQuery,
                placeholder: 'Search services...',
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
              Popular
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Award className="w-4 h-4" />
              Top Rated
            </Button>
          </div>
        </PageHeader>
      </div>

      {/* Services Grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                {...service}
                onClick={() => onServiceClick(service.id)}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground mb-2">No services found</p>
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
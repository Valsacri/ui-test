import { BUSINESSES } from '@/app/data/exploreData';
import { BusinessCard } from '@/app/components/BusinessCard';
import { Store, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';

interface BusinessesProps {
  onBusinessClick: (businessId: string) => void;
}

export function Businesses({ onBusinessClick }: BusinessesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter businesses based on search and filters
  const filteredBusinesses = BUSINESSES.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         business.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || business.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Get unique types for filter
  const uniqueTypes = Array.from(new Set(BUSINESSES.map(b => b.type)));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader
          title="Businesses"
          subtitle="Discover gyms, studios, and sports facilities"
          icon={<Store className="w-6 h-6 text-[#003C66]" />}
          filterControls={
            <FilterBar
              inline
              search={{
                value: searchQuery,
                onChange: setSearchQuery,
                placeholder: 'Search businesses...',
              }}
              filters={[
                {
                  id: 'type',
                  label: 'Business Type',
                  value: typeFilter,
                  onChange: setTypeFilter,
                  placeholder: 'All Types',
                  options: [
                    { label: 'All Types', value: 'all' },
                    ...uniqueTypes.map(type => ({ label: type, value: type })),
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
                  id: 'type',
                  label: 'Business Type',
                  value: typeFilter,
                  onChange: setTypeFilter,
                  placeholder: 'All Types',
                  options: [
                    { label: 'All Types', value: 'all' },
                    ...uniqueTypes.map(type => ({ label: type, value: type })),
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
              <MapPin className="w-4 h-4" />
              Near Me
            </Button>
            <Button variant="outline" size="sm">
              Top Rated
            </Button>
            <Button variant="outline" size="sm">
              Verified
            </Button>
          </div>
        </PageHeader>
      </div>

      {/* Businesses Grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredBusinesses.length} {filteredBusinesses.length === 1 ? 'business' : 'businesses'} found
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map((business) => (
              <BusinessCard
                key={business.id}
                {...business}
                onClick={() => onBusinessClick(business.id)}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground mb-2">No businesses found</p>
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
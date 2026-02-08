import { FACILITIES } from '@/app/data/exploreData';
import { FacilityCard } from '@/app/components/FacilityCard';
import { Building2, MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';
import { EmptyState } from '@/app/components/EmptyState';
import { LoadingGrid, LoadingFacilityCard } from '@/app/components/LoadingCard';
import { spacing, responsive, touchTarget } from '@/lib/design-system';

interface FacilitiesProps {
  onFacilityClick: (facilityId: string) => void;
  onSetRightSidebar?: (content: React.ReactNode) => void;
  userType?: 'user' | 'business' | 'squad';
}

export function Facilities({ onFacilityClick, onSetRightSidebar, userType }: FacilitiesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading] = useState(false); // In real app, this would track actual loading state

  // Filter facilities based on search and filters
  const filteredFacilities = FACILITIES.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         facility.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || facility.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Get unique types for filter
  const uniqueTypes = Array.from(new Set(FACILITIES.map(f => f.type)));

  const hasActiveFilters = typeFilter !== 'all' || searchQuery !== '';

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className={`${responsive.maxReading} ${responsive.containerPadding} py-6`}>
        <PageHeader
          title="Facilities"
          subtitle="Book venues and training spaces"
          icon={<Building2 className="w-6 h-6 text-[#003C66]" />}
          filterControls={
            <FilterBar
              inline
              showToggle={false}
              search={{
                value: searchQuery,
                onChange: setSearchQuery,
                placeholder: 'Search facilities...',
              }}
              filters={[
                {
                  id: 'type',
                  label: 'Facility Type',
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
                  label: 'Facility Type',
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
          <div className={`flex flex-wrap ${spacing.xs} mt-4`}>
            <Button variant="outline" size="sm" className={spacing.xs}>
              <MapPin className="w-4 h-4" />
              Near Me
            </Button>
            <Button variant="outline" size="sm" className={spacing.xs}>
              <Star className="w-4 h-4" />
              Top Rated
            </Button>
          </div>
        </PageHeader>
      </div>

      {/* Facilities Content */}
      <div className="max-w-4xl mx-auto px-4">
        {!isLoading && filteredFacilities.length > 0 && (
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {filteredFacilities.length} {filteredFacilities.length === 1 ? 'facility' : 'facilities'} found
            </p>
          </div>
        )}

        {isLoading ? (
          <LoadingGrid count={6} CardComponent={LoadingFacilityCard} />
        ) : filteredFacilities.length > 0 ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 ${spacing.md}`}>
            {filteredFacilities.map((facility) => (
              <FacilityCard
                key={facility.id}
                {...facility}
                onClick={() => onFacilityClick(facility.id)}
                userType={userType}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Building2}
            title={hasActiveFilters ? "No facilities match your criteria" : "No facilities available"}
            description={
              hasActiveFilters
                ? "Try adjusting your search or filter settings to find more facilities."
                : "Check back soon for new facilities in your area."
            }
            action={
              hasActiveFilters
                ? {
                    label: "Clear Filters",
                    onClick: () => {
                      setSearchQuery('');
                      setTypeFilter('all');
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
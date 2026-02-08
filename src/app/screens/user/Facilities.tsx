import { FACILITIES } from '@/app/data/exploreData';
import { FacilityCard } from '@/app/components/FacilityCard';
import { Building2, MapPin, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';

interface FacilitiesProps {
  onFacilityClick: (facilityId: string) => void;
  onSetRightSidebar?: (content: React.ReactNode) => void;
  userType?: 'user' | 'business' | 'squad';
}

export function Facilities({ onFacilityClick, onSetRightSidebar, userType }: FacilitiesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader
          title="Facilities"
          subtitle="Book venues and training spaces"
          icon={<Building2 className="w-6 h-6 text-[#003C66]" />}
          filterControls={
            <FilterBar
              inline
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
          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" className="gap-2">
              <MapPin className="w-4 h-4" />
              Near Me
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Star className="w-4 h-4" />
              Top Rated
            </Button>
          </div>
        </PageHeader>
      </div>

      {/* Facilities Grid */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredFacilities.length} {filteredFacilities.length === 1 ? 'facility' : 'facilities'} found
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredFacilities.length > 0 ? (
            filteredFacilities.map((facility) => (
              <FacilityCard
                key={facility.id}
                {...facility}
                onClick={() => onFacilityClick(facility.id)}
                userType={userType}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground mb-2">No facilities found</p>
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
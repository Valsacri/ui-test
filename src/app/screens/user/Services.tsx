import { SERVICES } from '@/app/data/exploreData';
import { ServiceCard } from '@/app/components/ServiceCard';
import { Wrench, TrendingUp, Award } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';

interface ServicesProps {
  onServiceClick: (serviceId: string) => void;
  userType?: 'user' | 'business' | 'squad';
}

export function Services({ onServiceClick, userType = 'user' }: ServicesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter services based on search and filters
  const filteredServices = SERVICES.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || service.category === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Get unique categories for filter
  const uniqueTypes = Array.from(new Set(SERVICES.map(s => s.category)));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-6 pt-[0px] pr-[16px] pb-[24px] pl-[16px]">
        <PageHeader
          title="Services"
          subtitle="Book training, coaching, and wellness services"
          icon={<Wrench className="w-6 h-6 text-[#003C66]"/>}
          filterControls={
            <FilterBar
              inline
              showToggle={false}
              search={{
                value: searchQuery,
                onChange: setSearchQuery,
                placeholder: 'Search services...',
              }}
              filters={[
                {
                  id: 'type',
                  label: 'Service Type',
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
                  label: 'Service Type',
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
                userType={userType}
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
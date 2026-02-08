import { JOBS } from '@/app/data/exploreData';
import { JobCard } from '@/app/components/JobCard';
import { Briefcase, MapPin, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';

interface JobsProps {
  onJobClick: (jobId: string) => void;
}

export function Jobs({ onJobClick }: JobsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter jobs based on search and filters
  const filteredJobs = JOBS.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || job.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Get unique types for filter
  const uniqueTypes = Array.from(new Set(JOBS.map(j => j.type)));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader
          title="Jobs"
          subtitle="Find opportunities in the sports industry"
          icon={<Briefcase className="w-6 h-6 text-[#FC8936]" />}
          filterControls={
            <FilterBar
              inline
              showToggle={false}
              search={{
                value: searchQuery,
                onChange: setSearchQuery,
                placeholder: 'Search jobs...',
              }}
              filters={[
                {
                  id: 'type',
                  label: 'Job Type',
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
                  label: 'Job Type',
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
              <TrendingUp className="w-4 h-4" />
              Featured
            </Button>
          </div>
        </PageHeader>
      </div>

      {/* Jobs List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </p>
        </div>

        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                onClick={() => onJobClick(job.id)}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-2">No jobs found</p>
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
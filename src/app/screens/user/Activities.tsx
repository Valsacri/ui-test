import { MOCK_ACTIVITIES } from '@/app/data/mockData';
import { useState } from 'react';
import { ActivityCard } from '@/app/components/ActivityCard';
import { Button } from '@/app/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { MapPin } from 'lucide-react';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';

interface ActivitiesProps {
  onActivityClick: (activityId: string) => void;
  onSetRightSidebar?: (content: React.ReactNode) => void;
  userType?: 'user' | 'business' | 'squad';
}

export function Activities({ onActivityClick, onSetRightSidebar, userType }: ActivitiesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter activities based on search and filters
  const filteredActivities = MOCK_ACTIVITIES.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = sportFilter === 'all' || activity.sport === sportFilter;
    const matchesLevel = levelFilter === 'all' || activity.level === levelFilter;
    
    return matchesSearch && matchesSport && matchesLevel;
  });

  // Get unique sports for filter
  const uniqueSports = Array.from(new Set(MOCK_ACTIVITIES.map(a => a.sport)));

  const handleActivityClick = (activityId: string) => {
    onActivityClick(activityId);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <PageHeader
          title="Activities"
          subtitle="Discover and join sports activities near you"
          filterControls={
            <FilterBar
              inline
              search={{
                value: searchQuery,
                onChange: setSearchQuery,
                placeholder: 'Search activities...',
              }}
              filters={[
                {
                  id: 'sport',
                  label: 'Sport',
                  value: sportFilter,
                  onChange: setSportFilter,
                  placeholder: 'All Sports',
                  options: [
                    { label: 'All Sports', value: 'all' },
                    ...uniqueSports.map(sport => ({ label: sport, value: sport })),
                  ],
                },
                {
                  id: 'level',
                  label: 'Level',
                  value: levelFilter,
                  onChange: setLevelFilter,
                  placeholder: 'All Levels',
                  options: [
                    { label: 'All Levels', value: 'all' },
                    { label: 'Beginner', value: 'Beginner' },
                    { label: 'Intermediate', value: 'Intermediate' },
                    { label: 'Advanced', value: 'Advanced' },
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
                  id: 'sport',
                  label: 'Sport',
                  value: sportFilter,
                  onChange: setSportFilter,
                  placeholder: 'All Sports',
                  options: [
                    { label: 'All Sports', value: 'all' },
                    ...uniqueSports.map(sport => ({ label: sport, value: sport })),
                  ],
                },
                {
                  id: 'level',
                  label: 'Level',
                  value: levelFilter,
                  onChange: setLevelFilter,
                  placeholder: 'All Levels',
                  options: [
                    { label: 'All Levels', value: 'all' },
                    { label: 'Beginner', value: 'Beginner' },
                    { label: 'Intermediate', value: 'Intermediate' },
                    { label: 'Advanced', value: 'Advanced' },
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
              Today
            </Button>
            <Button variant="outline" size="sm">
              This Week
            </Button>
          </div>
        </PageHeader>
      </div>

      {/* Activities Grid */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              {...activity}
              onClick={() => handleActivityClick(activity.id)}
              userType={userType}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
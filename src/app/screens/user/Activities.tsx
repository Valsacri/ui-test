import { MOCK_ACTIVITIES } from '@/app/data/mockData';
import { useState } from 'react';
import { ActivityCard } from '@/app/components/ActivityCard';
import { Button } from '@/app/components/ui/button';
import { MapPin, Calendar } from 'lucide-react';
import { PageHeader } from '@/app/components/PageHeader';
import { FilterBar } from '@/app/components/FilterBar';
import { MobileFilterBar } from '@/app/components/MobileFilterBar';
import { EmptyState } from '@/app/components/EmptyState';
import { LoadingGrid, LoadingActivityCard } from '@/app/components/LoadingCard';
import { spacing, responsive, touchTarget } from '@/lib/design-system';

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
  const [isLoading] = useState(false); // In real app, this would track actual loading state
  
  // Mobile filter states
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [activityType, setActivityType] = useState('all');
  const [participantRange, setParticipantRange] = useState<[number, number]>([1, 50]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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

  const hasActiveFilters = sportFilter !== 'all' || levelFilter !== 'all' || searchQuery !== '';

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      {/* Header */}
      <div className={`${responsive.maxReading} ${responsive.containerPadding} py-6`}>
        <PageHeader
          title="Activities"
          subtitle="Discover and join sports activities near you"
          filterControls={
            <FilterBar
              inline
              showToggle={false}
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
          <div className={`flex flex-wrap ${spacing.xs} mt-4`}>
            <Button variant="outline" size="sm" className={`${spacing.xs} ${touchTarget.md}`}>
              <MapPin className="w-4 h-4" />
              Near Me
            </Button>
            <Button variant="outline" size="sm" className={`${spacing.xs} ${touchTarget.md}`}>
              <Calendar className="w-4 h-4" />
              Today
            </Button>
            <Button variant="outline" size="sm" className={touchTarget.md}>
              This Week
            </Button>
          </div>
        </PageHeader>
      </div>

      {/* Activities Content */}
      <div className={`${responsive.maxReading} ${responsive.containerPadding}`}>
        {/* Mobile Filter Buttons */}
        <MobileFilterBar
          filters={['date', 'type', 'participants', 'time', 'category']}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          typeOptions={[
            { value: 'all', label: 'All Activities' },
            { value: 'solo', label: 'Solo Activities' },
            { value: 'squad', label: 'Squad Activities' },
          ]}
          selectedType={activityType}
          onTypeChange={setActivityType}
          typeLabel="Activity Type"
          participantRange={participantRange}
          onParticipantChange={setParticipantRange}
          participantMin={1}
          participantMax={50}
          timeSlots={[
            { time: '06:00 AM', available: true, count: 3 },
            { time: '08:00 AM', available: true, count: 5 },
            { time: '10:00 AM', available: true, count: 2 },
            { time: '12:00 PM', available: true, count: 4 },
            { time: '02:00 PM', available: false, count: 0 },
            { time: '04:00 PM', available: true, count: 6 },
            { time: '06:00 PM', available: true, count: 8 },
            { time: '08:00 PM', available: true, count: 3 },
          ]}
          selectedTimeSlot={selectedTimeSlot}
          onTimeSlotChange={setSelectedTimeSlot}
          categories={[
            { id: 'sessions', name: 'Sessions', count: 24, color: 'bg-blue-100 text-blue-700' },
            { id: 'camps', name: 'Camps', count: 8, color: 'bg-green-100 text-green-700' },
            { id: 'workshops', name: 'Workshops', count: 12, color: 'bg-purple-100 text-purple-700' },
            { id: 'events', name: 'Events', count: 15, color: 'bg-orange-100 text-orange-700' },
            { id: 'training', name: 'Training Programs', count: 10, color: 'bg-red-100 text-red-700' },
            { id: 'dropins', name: 'Drop-ins', count: 18, color: 'bg-cyan-100 text-cyan-700' },
          ]}
          selectedCategories={selectedCategories}
          onCategoryChange={setSelectedCategories}
        />

        {isLoading ? (
          <LoadingGrid count={6} CardComponent={LoadingActivityCard} />
        ) : filteredActivities.length > 0 ? (
          <div className={`grid ${responsive.gridThree} ${spacing.md}`}>
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                {...activity}
                onClick={() => handleActivityClick(activity.id)}
                userType={userType}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title={hasActiveFilters ? "No activities match your filters" : "No activities available"}
            description={
              hasActiveFilters
                ? "Try adjusting your filters or search criteria to find more activities."
                : "Check back soon for new activities in your area."
            }
            action={
              hasActiveFilters
                ? {
                    label: "Clear Filters",
                    onClick: () => {
                      setSearchQuery('');
                      setSportFilter('all');
                      setLevelFilter('all');
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
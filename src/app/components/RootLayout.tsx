import { ReactNode } from 'react';
import { TopBar } from '@/app/components/TopBar';
import { FeedSidebar } from '@/app/components/FeedSidebar';
import { ExploreSidebar } from '@/app/components/ExploreSidebar';
import { BusinessFeedSidebar } from '@/app/components/BusinessFeedSidebar';
import { BusinessExploreSidebar } from '@/app/components/BusinessExploreSidebar';
import { MOCK_GOALS, MOCK_PERSONAL_PROFILE, MOCK_BUSINESS_PROFILES, MOCK_SQUAD_PROFILES } from '@/app/data/mockData';

interface RootLayoutProps {
  children: ReactNode;
  activeScreen: string;
  onNavigate: (destination: string) => void;
  onNotifications: () => void;
  onMessages: () => void;
  onProfile: () => void;
  onSwitchProfile: (type: 'user' | 'business' | 'squad', profileId?: string) => void;
  currentProfile?: 'user' | 'business' | 'squad';
  currentProfileId?: string;
  notificationCount?: number;
  messageCount?: number;
  rightSidebarContent?: ReactNode; // Dynamic right sidebar content
}

export function RootLayout({
  children,
  activeScreen,
  onNavigate,
  onNotifications,
  onMessages,
  onProfile,
  onSwitchProfile,
  currentProfile = 'user',
  currentProfileId = 'personal-1',
  notificationCount = 3,
  messageCount = 2,
  rightSidebarContent,
}: RootLayoutProps) {
  // Get current business profile data
  const currentBusiness = currentProfile === 'business' 
    ? MOCK_BUSINESS_PROFILES.find(b => b.id === currentProfileId) || MOCK_BUSINESS_PROFILES[0]
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TopBar */}
      <TopBar
        onGoals={() => onNavigate('goals')}
        onNotifications={onNotifications}
        onMessages={onMessages}
        onProfile={onProfile}
        onSwitchProfile={onSwitchProfile}
        onNavigate={onNavigate}
        activeScreen={activeScreen}
        notificationCount={notificationCount}
        messageCount={messageCount}
        currentProfile={currentProfile}
        userName="Alex Johnson"
        userAvatar={MOCK_PERSONAL_PROFILE.avatar}
        goals={MOCK_GOALS}
        personalProfile={MOCK_PERSONAL_PROFILE}
        businessProfiles={MOCK_BUSINESS_PROFILES}
        squadProfiles={MOCK_SQUAD_PROFILES}
        currentProfileId={currentProfileId}
      />

      {/* Main Layout with Sidebars */}
      <div className="max-w-[1600px] mx-auto px-4 pb-8">
        <div className="flex gap-6 bg-transparent pt-4">
          {/* Left Sidebar - Hidden on mobile, visible on xl+ */}
          <div className="hidden xl:block w-72 flex-shrink-0">
            {currentProfile === 'user' ? (
              <ExploreSidebar onNavigate={onNavigate} currentPage={activeScreen} />
            ) : (
              <BusinessExploreSidebar onNavigate={onNavigate} currentPage={activeScreen} />
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

          {/* Right Sidebar - Hidden on mobile, visible on lg+ */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            {rightSidebarContent ? (
              rightSidebarContent
            ) : (
              currentProfile === 'user' ? (
                <FeedSidebar
                  userName={MOCK_PERSONAL_PROFILE.name}
                  userEmail={MOCK_PERSONAL_PROFILE.email}
                  userAvatar={MOCK_PERSONAL_PROFILE.avatar}
                  profileCompletion={75}
                  stats={{
                    leaguesJoined: 3,
                    activities: 12,
                    workouts: 28,
                  }}
                  goals={MOCK_GOALS}
                  onProfile={onProfile}
                  onGoals={() => onNavigate('goals')}
                />
              ) : (
                <BusinessFeedSidebar
                  businessName={currentBusiness?.name || 'Business Name'}
                  businessType={currentBusiness?.type || 'Business'}
                  businessAvatar={currentBusiness?.avatar}
                  stats={{
                    totalRevenue: 2450,
                    activeEvents: 8,
                    totalCustomers: 245,
                    avgRating: 4.8,
                  }}
                  onProfile={onProfile}
                  onCreateActivity={() => onNavigate('create-activity')}
                  onCreateCampaign={() => onNavigate('create-campaign')}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
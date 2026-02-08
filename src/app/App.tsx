import { useState, useEffect, useCallback } from 'react';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

// Onboarding
import { SignUp } from '@/app/screens/onboarding/SignUp';
import { ChooseSports } from '@/app/screens/onboarding/ChooseSports';
import { SportWithLevel } from '@/app/components/SportSelector';
import { ExperienceLevel } from '@/app/screens/onboarding/ExperienceLevel';
import { SetGoals } from '@/app/screens/onboarding/SetGoals';
import { Confirmation } from '@/app/screens/onboarding/Confirmation';

// User Screens
import { Home } from '@/app/screens/user/Home';
import { Explore } from '@/app/screens/user/Explore';
import { Activities } from '@/app/screens/user/Activities';
import { Facilities } from '@/app/screens/user/Facilities';
import { Products } from '@/app/screens/user/Products';
import { Services } from '@/app/screens/user/Services';
import { Marketplace } from '@/app/screens/user/Marketplace';
import { Businesses } from '@/app/screens/user/Businesses';
import { Jobs } from '@/app/screens/user/Jobs';
import { ActivityDetail } from '@/app/screens/user/ActivityDetail';
import { FacilityDetail } from '@/app/screens/user/FacilityDetail';
import { ServiceDetail } from '@/app/screens/user/ServiceDetail';
import { PersonDetail } from '@/app/screens/user/PersonDetail';
import { SquadDetail } from '@/app/screens/user/SquadDetail';
import { SquadProfile } from '@/app/screens/user/SquadProfile';
import { Community } from '@/app/screens/user/Community';
import { ProductDetail } from '@/app/screens/user/ProductDetail';
import { Messages } from '@/app/screens/user/Messages';
import { Conversation } from '@/app/screens/user/Conversation';
import { Notifications } from '@/app/screens/user/Notifications';
import { Profile } from '@/app/screens/user/Profile';
import { ProfileEnhanced } from '@/app/screens/user/ProfileEnhanced';
import { StoreDetail } from '@/app/screens/user/StoreDetail';
import { Settings } from '@/app/screens/user/Settings';
import { ProfileInformation } from '@/app/screens/user/ProfileInformation';
import { LanguageSettings } from '@/app/screens/user/LanguageSettings';
import { PrivacySettings } from '@/app/screens/user/PrivacySettings';
import { BlockedUsers } from '@/app/screens/user/BlockedUsers';
import { DataPermissions } from '@/app/screens/user/DataPermissions';
import { NotificationSettings } from '@/app/screens/user/NotificationSettings';
import { PaymentMethods } from '@/app/screens/user/PaymentMethods';
import { TransactionHistory } from '@/app/screens/user/TransactionHistory';
import { TermsOfService } from '@/app/screens/user/TermsOfService';
import { PrivacyPolicy } from '@/app/screens/user/PrivacyPolicy';
import { HelpSupport } from '@/app/screens/user/HelpSupport';
import { WalletBalance } from '@/app/screens/user/WalletBalance';

// Business Screens
import { BusinessDashboard } from '@/app/screens/business/BusinessDashboard';
import { BusinessActivities } from '@/app/screens/business/BusinessActivities';
import { BusinessCampaigns } from '@/app/screens/business/BusinessCampaigns';
import { BusinessCustomers } from '@/app/screens/business/BusinessCustomers';
import { BusinessResources } from '@/app/screens/business/BusinessResources';
import { BusinessAnalytics } from '@/app/screens/business/BusinessAnalytics';
import { BusinessTeam } from '@/app/screens/business/BusinessTeam';
import { BusinessAthletes } from '@/app/screens/business/BusinessAthletes';
import { BusinessPartners } from '@/app/screens/business/BusinessPartners';
import { AddCollaboration } from '@/app/screens/business/AddCollaboration';
import { AddTeamMember } from '@/app/screens/business/AddTeamMember';
import { AddResource } from '@/app/screens/business/AddResource';
import { CreateActivity } from '@/app/screens/business/CreateActivity';
import { CreateActivitySteps } from '@/app/screens/business/CreateActivitySteps';
import { ManageResources } from '@/app/screens/business/ManageResources';
import { ManageCustomers } from '@/app/screens/business/ManageCustomers';
import { TeamManagement } from '@/app/screens/business/TeamManagement';
import { CreateBusiness } from '@/app/screens/business/CreateBusiness';
import { CreateCampaign } from '@/app/screens/business/CreateCampaign';

// Squad Screens
import { SquadDashboard } from '@/app/screens/squad/SquadDashboard';

// Navigation
import { BottomNav } from '@/app/components/BottomNav';
import { RootLayout } from '@/app/components/RootLayout';
import { BookingSidebar } from '@/app/components/BookingSidebar';
import { ProductOrderSidebar } from '@/app/components/ProductOrderSidebar';
import { ServiceBookingSidebar } from '@/app/components/ServiceBookingSidebar';
import { ExpectedImpactSidebar } from '@/app/components/ExpectedImpactSidebar';
import { ActivitiesFilterSidebar } from '@/app/components/ActivitiesFilterSidebar';
import { FacilitiesFilterSidebar } from '@/app/components/FacilitiesFilterSidebar';
import { ExploreFilterSidebar } from '@/app/components/ExploreFilterSidebar';
import { ProductsFilterSidebar } from '@/app/components/ProductsFilterSidebar';
import { ServicesFilterSidebar } from '@/app/components/ServicesFilterSidebar';
import { BusinessesFilterSidebar } from '@/app/components/BusinessesFilterSidebar';
import { FACILITIES, PRODUCTS, SERVICES } from '@/app/data/exploreData';

type OnboardingStep = 'signup' | 'sports' | 'level' | 'goals' | 'confirmation';
type UserType = 'user' | 'business';
type Screen = 
  | 'home'
  | 'activities'
  | 'facilities'
  | 'products'
  | 'services'
  | 'marketplace'
  | 'businesses'
  | 'jobs'
  | 'community'
  | 'squad-profile'
  | 'explore' 
  | 'explore-activities'
  | 'explore-facilities'
  | 'explore-products'
  | 'explore-services'
  | 'explore-people'
  | 'activity-detail'
  | 'facility-detail'
  | 'product-detail'
  | 'service-detail'
  | 'person-detail'
  | 'squad-detail'
  | 'profile'
  | 'business-profile'
  | 'messages'
  | 'conversation'
  | 'notifications'
  | 'settings'
  | 'settings/profile-info'
  | 'settings/language'
  | 'settings/privacy'
  | 'settings/blocked-users'
  | 'settings/data-permissions'
  | 'settings/notifications'
  | 'settings/payment-methods'
  | 'settings/transaction-history'
  | 'settings/terms'
  | 'settings/privacy-policy'
  | 'settings/help'
  | 'settings/wallet'
  | 'business'
  | 'business-dashboard'
  | 'business-activities'
  | 'business-campaigns'
  | 'business-customers'
  | 'business-resources'
  | 'business-analytics'
  | 'business-team'
  | 'business-athletes'
  | 'business-partners'
  | 'business-athletes-add-collab'
  | 'business-partners-add-collab'
  | 'add-team-member'
  | 'add-resource'
  | 'create-activity'
  | 'create-campaign'
  | 'store-detail'
  | 'manage-resources'
  | 'manage-customers'
  | 'manage-team'
  | 'create-business'
  | 'squad'
  | 'squad-dashboard';

export default function App() {
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('signup');
  const [userType, setUserType] = useState<UserType>('user');
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('business-1');
  const [currentProfileId, setCurrentProfileId] = useState<string>('personal-1');
  const [rightSidebarContent, setRightSidebarContent] = useState<React.ReactNode | null>(null);
  const [exploreActiveTab, setExploreActiveTab] = useState<'activities' | 'facilities' | 'products' | 'services' | 'people'>('activities');
  
  // Activity creation metrics state
  const [activityMetrics, setActivityMetrics] = useState({
    preEventReach: 0,
    duringEventReach: 0,
    postEventReach: 0,
    expectedAttendance: 0,
    maxCapacity: 0,
  });

  // Onboarding state
  const [selectedSports, setSelectedSports] = useState<SportWithLevel[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [goals, setGoals] = useState<string[]>([]);

  // Onboarding handlers
  const handleSignUpComplete = () => {
    setOnboardingStep('sports');
  };

  const handleSportsComplete = (sports: SportWithLevel[]) => {
    setSelectedSports(sports);
    setOnboardingStep('goals');
  };

  const handleLevelComplete = (level: string) => {
    setExperienceLevel(level);
    setOnboardingStep('goals');
  };

  const handleGoalsComplete = (userGoals: string[]) => {
    setGoals(userGoals);
    setOnboardingStep('confirmation');
  };

  const handleOnboardingComplete = () => {
    setIsOnboarding(false);
    setCurrentScreen('home');
  };

  // Navigation handlers
  const handleActivityClick = (activityId: string) => {
    setSelectedActivityId(activityId);
    setCurrentScreen('activity-detail');
  };

  const handleGoalClick = (goalId: string) => {
    setSelectedGoalId(goalId);
    // Could navigate to goal detail screen
  };

  const handleBackFromActivityDetail = () => {
    setCurrentScreen('explore');
    setSelectedActivityId(null);
  };

  const handleTabChange = (tabId: string) => {
    setCurrentScreen(tabId as Screen);
  };

  const handleNavigate = (destination: string) => {
    if (destination.startsWith('explore-')) {
      // Handle explore sub-tabs
      const exploreTab = destination.replace('explore-', '');
      setCurrentScreen('explore');
      setExploreActiveTab(exploreTab as 'activities' | 'facilities' | 'products' | 'services' | 'people');
    } else if (destination === 'messages') {
      setCurrentScreen('messages');
    } else if (destination === 'notifications') {
      setCurrentScreen('notifications');
    } else {
      setCurrentScreen(destination as Screen);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setCurrentScreen('conversation');
  };

  const handleSwitchProfile = (type: 'user' | 'business' | 'squad', profileId?: string) => {
    if (type === 'user') {
      setUserType('user');
      setCurrentProfileId(profileId || 'personal-1');
      setCurrentScreen('profile');
    } else if (type === 'business' && profileId) {
      setUserType('business');
      setCurrentBusinessId(profileId);
      setCurrentProfileId(profileId);
      setCurrentScreen('business');
    } else if (type === 'squad' && profileId) {
      setUserType('user'); // Keep userType as user since squad uses user screens
      setCurrentProfileId(profileId);
      setCurrentScreen('squad');
    }
  };

  // Memoize the metrics callback to prevent infinite loops
  const handleMetricsChange = useCallback((metrics: {
    preEventReach: number;
    duringEventReach: number;
    postEventReach: number;
    expectedAttendance: number;
    maxCapacity: number;
  }) => {
    setActivityMetrics(metrics);
    setRightSidebarContent(
      <ExpectedImpactSidebar data={metrics} />
    );
  }, []);

  // useEffect to manage right sidebar content based on current screen and selections
  useEffect(() => {
    // Reset sidebar content by default
    setRightSidebarContent(null);

    // Set sidebar for activities page
    if (currentScreen === 'activities') {
      setRightSidebarContent(<ActivitiesFilterSidebar />);
      return;
    }

    // Set sidebar for facilities page
    if (currentScreen === 'facilities') {
      setRightSidebarContent(<FacilitiesFilterSidebar />);
      return;
    }

    // Set sidebar for products page
    if (currentScreen === 'products') {
      setRightSidebarContent(<ProductsFilterSidebar />);
      return;
    }

    // Set sidebar for services page
    if (currentScreen === 'services') {
      setRightSidebarContent(<ServicesFilterSidebar />);
      return;
    }

    // Set sidebar for businesses page
    if (currentScreen === 'businesses') {
      setRightSidebarContent(<BusinessesFilterSidebar />);
      return;
    }

    // Set sidebar for facility detail
    if (currentScreen === 'facility-detail' && selectedFacilityId) {
      const facility = FACILITIES.find(f => f.id === selectedFacilityId);
      if (facility) {
        setRightSidebarContent(
          <BookingSidebar
            pricePerHour={facility.pricePerHour}
            capacity={facility.capacity}
            itemName={facility.name}
            onBooking={(date, time, duration, participants) => {
              toast.success(`Booking confirmed for ${facility.name}!`);
            }}
          />
        );
      }
    }

    // Set sidebar for product detail
    if (currentScreen === 'product-detail' && selectedProductId) {
      const product = PRODUCTS.find(p => p.id === selectedProductId);
      if (product) {
        setRightSidebarContent(
          <ProductOrderSidebar
            productName={product.name}
            productImage={product.image}
            price={product.price}
            originalPrice={product.originalPrice}
            rating={product.rating}
            reviews={product.reviews}
            inStock={product.inStock}
            onAddToCart={(quantity) => {
              toast.success(`Added ${quantity}x ${product.name} to cart!`);
            }}
          />
        );
      }
    }

    // Set sidebar for service detail
    if (currentScreen === 'service-detail' && selectedServiceId) {
      const service = SERVICES.find(s => s.id === selectedServiceId);
      if (service) {
        setRightSidebarContent(
          <ServiceBookingSidebar
            serviceName={service.name}
            serviceImage={service.image}
            provider={service.provider}
            price={service.price}
            duration={service.duration}
            rating={service.rating}
            reviews={service.reviews}
            verified={service.verified}
            onBooking={(date, time, notes) => {
              toast.success(`Booking confirmed for ${service.name}!`);
            }}
          />
        );
      }
    }

    // Set sidebar for explore page
    if (currentScreen === 'explore') {
      setRightSidebarContent(<ExploreFilterSidebar activeTab={exploreActiveTab} />);
    }
  }, [currentScreen, selectedFacilityId, selectedProductId, selectedServiceId, exploreActiveTab]);

  // Render onboarding
  if (isOnboarding) {
    switch (onboardingStep) {
      case 'signup':
        return <SignUp onComplete={handleSignUpComplete} />;
      case 'sports':
        return (
          <RootLayout
            activeScreen="onboarding"
            onNavigate={handleNavigate}
            onNotifications={() => setCurrentScreen('notifications')}
            onMessages={() => setCurrentScreen('messages')}
            onProfile={() => setCurrentScreen('profile')}
            onSwitchProfile={handleSwitchProfile}
            currentProfile={userType}
            currentProfileId={currentProfileId}
            rightSidebarContent={null}
          >
            <ChooseSports
              onComplete={handleSportsComplete}
              onBack={() => setOnboardingStep('signup')}
            />
          </RootLayout>
        );
      case 'goals':
        return (
          <RootLayout
            activeScreen="onboarding"
            onNavigate={handleNavigate}
            onNotifications={() => setCurrentScreen('notifications')}
            onMessages={() => setCurrentScreen('messages')}
            onProfile={() => setCurrentScreen('profile')}
            onSwitchProfile={handleSwitchProfile}
            currentProfile={userType}
            currentProfileId={currentProfileId}
            rightSidebarContent={null}
          >
            <SetGoals
              onComplete={handleGoalsComplete}
              onBack={() => setOnboardingStep('sports')}
            />
          </RootLayout>
        );
      case 'confirmation':
        return <Confirmation onComplete={handleOnboardingComplete} />;
    }
  }

  // Manage Resources screen
  if (currentScreen === 'manage-resources') {
    return (
      <ManageResources
        onBack={() => setCurrentScreen('business')}
        onNotifications={() => setCurrentScreen('notifications')}
        onMessages={() => setCurrentScreen('messages')}
        onProfile={() => setCurrentScreen('business')}
      />
    );
  }

  // Manage Customers screen
  if (currentScreen === 'manage-customers') {
    return (
      <ManageCustomers
        onBack={() => setCurrentScreen('business')}
        onNotifications={() => setCurrentScreen('notifications')}
        onMessages={() => setCurrentScreen('messages')}
        onProfile={() => setCurrentScreen('business')}
      />
    );
  }

  // Manage Team screen
  if (currentScreen === 'manage-team') {
    return (
      <TeamManagement
        onBack={() => setCurrentScreen('business')}
        onNotifications={() => setCurrentScreen('notifications')}
        onMessages={() => setCurrentScreen('messages')}
        onProfile={() => setCurrentScreen('business')}
      />
    );
  }

  // Create Business screen
  if (currentScreen === 'create-business') {
    return (
      <CreateBusiness
        onBack={() => setCurrentScreen('business')}
        onComplete={(businessData) => {
          // Handle business creation
          console.log('New business:', businessData);
          setCurrentScreen('business');
        }}
      />
    );
  }

  // Render main app based on user type and screen
  if (userType === 'business') {
    if (currentScreen === 'create-activity') {
      return (
        <RootLayout
          activeScreen={currentScreen}
          onNavigate={handleNavigate}
          onNotifications={() => setCurrentScreen('notifications')}
          onMessages={() => setCurrentScreen('messages')}
          onProfile={() => setCurrentScreen('business')}
          onSwitchProfile={(type, profileId) => {
            setUserType(type);
            if (type === 'user') {
              setCurrentScreen('profile');
            } else if (type === 'business' && profileId) {
              setCurrentBusinessId(profileId);
              setCurrentScreen('business');
            }
          }}
          currentProfile="business"
          currentProfileId={currentBusinessId}
          notificationCount={3}
          messageCount={2}
          rightSidebarContent={rightSidebarContent}
        >
          <CreateActivity
            onBack={() => {
              setCurrentScreen('business');
              setRightSidebarContent(null);
            }}
            onSubmit={() => {
              setCurrentScreen('business');
              setRightSidebarContent(null);
            }}
            onMetricsChange={handleMetricsChange}
          />
        </RootLayout>
      );
    }

    if (currentScreen === 'create-campaign') {
      return (
        <RootLayout
          activeScreen={currentScreen}
          onNavigate={handleNavigate}
          onNotifications={() => setCurrentScreen('notifications')}
          onMessages={() => setCurrentScreen('messages')}
          onProfile={() => setCurrentScreen('business')}
          onSwitchProfile={(type, profileId) => {
            setUserType(type);
            if (type === 'user') {
              setCurrentScreen('profile');
            } else if (type === 'business' && profileId) {
              setCurrentBusinessId(profileId);
              setCurrentScreen('business');
            }
          }}
          currentProfile="business"
          currentProfileId={currentBusinessId}
          notificationCount={3}
          messageCount={2}
        >
          <CreateCampaign
            onBack={() => setCurrentScreen('business-campaigns')}
            onNotifications={() => setCurrentScreen('notifications')}
            onMessages={() => setCurrentScreen('messages')}
            onProfile={() => setCurrentScreen('business')}
            currentBusinessId={currentBusinessId}
          />
        </RootLayout>
      );
    }

    // Render different business pages based on screen
    let businessContent;
    switch (currentScreen) {
      case 'business-activities':
        businessContent = (
          <BusinessActivities
            onCreateActivity={() => setCurrentScreen('create-activity')}
          />
        );
        break;
      case 'business-campaigns':
        businessContent = (
          <BusinessCampaigns
            onCreateCampaign={() => setCurrentScreen('create-campaign')}
          />
        );
        break;
      case 'business-customers':
        businessContent = (
          <BusinessCustomers
            onManageCustomers={() => setCurrentScreen('manage-customers')}
          />
        );
        break;
      case 'business-resources':
        businessContent = (
          <BusinessResources
            onManageFacilities={() => setCurrentScreen('manage-resources')}
            onAddResource={() => setCurrentScreen('add-resource')}
          />
        );
        break;
      case 'business-analytics':
        businessContent = <BusinessAnalytics />;
        break;
      case 'business-team':
        businessContent = (
          <BusinessTeam
            onManageTeam={() => setCurrentScreen('manage-team')}
            onAddMember={() => setCurrentScreen('add-team-member')}
          />
        );
        break;
      case 'business-athletes':
        businessContent = (
          <BusinessAthletes
            onNavigate={(page, data) => {
              if (page === 'business-athletes-add-collab') {
                setCurrentScreen('business-athletes-add-collab');
              }
            }}
          />
        );
        break;
      case 'business-partners':
        businessContent = (
          <BusinessPartners
            onNavigate={(page, data) => {
              if (page === 'business-partners-add-collab') {
                setCurrentScreen('business-partners-add-collab');
              }
            }}
          />
        );
        break;
      case 'business-athletes-add-collab':
        businessContent = (
          <AddCollaboration
            onBack={() => setCurrentScreen('business-athletes')}
            partnerType="athlete"
          />
        );
        break;
      case 'business-partners-add-collab':
        businessContent = (
          <AddCollaboration
            onBack={() => setCurrentScreen('business-partners')}
            partnerType="business"
          />
        );
        break;
      case 'add-team-member':
        businessContent = (
          <AddTeamMember
            onBack={() => setCurrentScreen('business')}
          />
        );
        break;
      case 'add-resource':
        businessContent = (
          <AddResource
            onBack={() => setCurrentScreen('business-resources')}
            onSubmit={(resourceData) => {
              console.log('New resource:', resourceData);
              toast.success(`${resourceData.type.charAt(0).toUpperCase() + resourceData.type.slice(1)} created successfully!`);
              setCurrentScreen('business-resources');
            }}
          />
        );
        break;
      default:
        businessContent = (
          <BusinessDashboard
            onCreateActivity={() => setCurrentScreen('create-activity')}
            onManageFacilities={() => setCurrentScreen('manage-resources')}
            onManageCustomers={() => setCurrentScreen('manage-customers')}
            onManageTeam={() => setCurrentScreen('manage-team')}
            onCreateBusiness={() => setCurrentScreen('create-business')}
            onCreateCampaign={() => setCurrentScreen('create-campaign')}
            onNotifications={() => setCurrentScreen('notifications')}
            onMessages={() => setCurrentScreen('messages')}
            onProfile={() => setCurrentScreen('business')}
            onSwitchProfile={(type, profileId) => {
              setUserType(type);
              if (type === 'user') {
                setCurrentScreen('profile');
              } else if (type === 'business' && profileId) {
                setCurrentBusinessId(profileId);
                setCurrentScreen('business');
              }
            }}
            currentBusinessId={currentBusinessId}
          />
        );
    }

    return (
      <RootLayout
        activeScreen={currentScreen}
        onNavigate={handleNavigate}
        onNotifications={() => setCurrentScreen('notifications')}
        onMessages={() => setCurrentScreen('messages')}
        onProfile={() => setCurrentScreen('business')}
        onSwitchProfile={(type, profileId) => {
          setUserType(type);
          if (type === 'user') {
            setCurrentScreen('profile');
          } else if (type === 'business' && profileId) {
            setCurrentBusinessId(profileId);
            setCurrentScreen('business');
          }
        }}
        currentProfile="business"
        currentProfileId={currentBusinessId}
        notificationCount={3}
        messageCount={2}
      >
        {businessContent}
      </RootLayout>
    );
  }

  // User screens
  let screenContent;
  let hideBottomNav = false;

  // Right sidebar setter function
  const setRightSidebar = (content: React.ReactNode | null) => {
    setRightSidebarContent(content);
  };

  switch (currentScreen) {
    case 'profile':
      screenContent = (
        <ProfileEnhanced
          onNotifications={() => setCurrentScreen('notifications')}
          onMessages={() => setCurrentScreen('messages')}
          onGoals={() => {}} // No-op since goals are now in profile tabs
          onSwitchProfile={(type, profileId) => {
            setUserType(type);
            if (type === 'business') {
              if (profileId) {
                setCurrentBusinessId(profileId);
              }
              setCurrentScreen('business');
            } else if (type === 'user') {
              setCurrentProfileId(profileId || 'personal-1');
              setCurrentScreen('profile');
            }
          }}
        />
      );
      break;
    case 'messages':
      screenContent = <Messages onConversationClick={handleConversationClick} />;
      break;
    case 'conversation':
      screenContent = selectedConversationId ? (
        <Conversation
          conversationId={selectedConversationId}
          onBack={() => setCurrentScreen('messages')}
        />
      ) : (
        <Messages onConversationClick={handleConversationClick} />
      );
      hideBottomNav = true;
      break;
    case 'notifications':
      screenContent = <Notifications onBack={() => setCurrentScreen('home')} />;
      hideBottomNav = true;
      break;
    case 'settings':
      screenContent = (
        <Settings
          onNavigate={handleNavigate}
          currentProfile={userType}
          userName="Alex Johnson"
          userEmail="alex.johnson@email.com"
        />
      );
      hideBottomNav = true;
      break;
    case 'settings/profile-info':
      screenContent = (
        <ProfileInformation
          onBack={() => setCurrentScreen('settings')}
          userName="Alex Johnson"
          userEmail="alex.johnson@email.com"
          userPhone="+1 (555) 123-4567"
        />
      );
      hideBottomNav = true;
      break;
    case 'settings/language':
      screenContent = (
        <LanguageSettings
          onBack={() => setCurrentScreen('settings')}
        />
      );
      hideBottomNav = true;
      break;
    case 'settings/privacy':
      screenContent = (
        <PrivacySettings
          onBack={() => setCurrentScreen('settings')}
        />
      );
      hideBottomNav = true;
      break;
    case 'settings/blocked-users':
      screenContent = (
        <BlockedUsers
          onBack={() => setCurrentScreen('settings')}
        />
      );
      hideBottomNav = true;
      break;
    case 'settings/data-permissions':
      screenContent = (
        <DataPermissions
          onBack={() => setCurrentScreen('settings')}
        />
      );
      hideBottomNav = true;
      break;
    case 'settings/notifications':
      screenContent = (
        <NotificationSettings
          onBack={() => setCurrentScreen('settings')}
        />
      );
      hideBottomNav = true;
      break;
    case 'settings/payment-methods':
      screenContent = (
        <PaymentMethods
          onBack={() => setCurrentScreen('settings')}
        />
      );
      hideBottomNav = true;
      break;
    case 'settings/transaction-history':
      screenContent = (
        <TransactionHistory
          onBack={() => setCurrentScreen('settings')}
        />
      );
      hideBottomNav = true;
      break;
    case 'settings/terms':
      screenContent = (
        <TermsOfService
          onBack={() => setCurrentScreen('settings')}
        />
      );
      hideBottomNav = true;
      break;
    case 'settings/privacy-policy':
      screenContent = (
        <PrivacyPolicy
          onBack={() => setCurrentScreen('settings')}
        />
      );
      hideBottomNav = true;
      break;
    case 'settings/help':
      screenContent = (
        <HelpSupport
          onBack={() => setCurrentScreen('settings')}
        />
      );
      hideBottomNav = true;
      break;
    case 'settings/wallet':
      screenContent = (
        <WalletBalance
          onBack={() => setCurrentScreen('settings')}
        />
      );
      hideBottomNav = true;
      break;
    case 'activity-detail':
      screenContent = selectedActivityId ? (
        <ActivityDetail
          activityId={selectedActivityId}
          onBack={handleBackFromActivityDetail}
        />
      ) : (
        <Explore
          onActivityClick={handleActivityClick}
          onFacilityClick={(id) => {
            setSelectedFacilityId(id);
            setCurrentScreen('facility-detail');
          }}
          onProductClick={(id) => {
            setSelectedProductId(id);
            setCurrentScreen('product-detail');
          }}
          onServiceClick={(id) => {
            setSelectedServiceId(id);
            setCurrentScreen('service-detail');
          }}
          onPersonClick={(id) => {
            setSelectedPersonId(id);
            setCurrentScreen('person-detail');
          }}
          onNavigate={handleNavigate}
          onGoalClick={handleGoalClick}
          onNotifications={() => setCurrentScreen('notifications')}
          onMessages={() => setCurrentScreen('messages')}
          onProfile={() => setCurrentScreen('profile')}
          onSwitchProfile={(type) => {
            setUserType(type);
            if (type === 'business') {
              setCurrentScreen('business');
            }
          }}
        />
      );
      hideBottomNav = true;
      break;
    case 'facility-detail':
      if (selectedFacilityId) {
        screenContent = (
          <FacilityDetail
            facilityId={selectedFacilityId}
            onBack={() => {
              setCurrentScreen('explore');
              setSelectedFacilityId(null);
            }}
          />
        );
      } else {
        screenContent = (
          <Explore
            onActivityClick={handleActivityClick}
            onFacilityClick={(id) => {
              setSelectedFacilityId(id);
              setCurrentScreen('facility-detail');
            }}
            onProductClick={(id) => {
              setSelectedProductId(id);
              setCurrentScreen('product-detail');
            }}
            onServiceClick={(id) => {
              setSelectedServiceId(id);
              setCurrentScreen('service-detail');
            }}
            onPersonClick={(id) => {
              setSelectedPersonId(id);
              setCurrentScreen('person-detail');
            }}
            onNavigate={handleNavigate}
            onGoalClick={handleGoalClick}
          />
        );
      }
      hideBottomNav = true;
      break;
    case 'product-detail':
      if (selectedProductId) {
        screenContent = (
          <ProductDetail
            productId={selectedProductId}
            onBack={() => {
              setCurrentScreen('explore');
              setSelectedProductId(null);
            }}
          />
        );
      } else {
        screenContent = (
          <Explore
            onActivityClick={handleActivityClick}
            onFacilityClick={(id) => {
              setSelectedFacilityId(id);
              setCurrentScreen('facility-detail');
            }}
            onProductClick={(id) => {
              setSelectedProductId(id);
              setCurrentScreen('product-detail');
            }}
            onServiceClick={(id) => {
              setSelectedServiceId(id);
              setCurrentScreen('service-detail');
            }}
            onPersonClick={(id) => {
              setSelectedPersonId(id);
              setCurrentScreen('person-detail');
            }}
            onNavigate={handleNavigate}
            onGoalClick={handleGoalClick}
          />
        );
      }
      hideBottomNav = true;
      break;
    case 'service-detail':
      if (selectedServiceId) {
        screenContent = (
          <ServiceDetail
            serviceId={selectedServiceId}
            onBack={() => {
              setCurrentScreen('explore');
              setSelectedServiceId(null);
            }}
          />
        );
      } else {
        screenContent = (
          <Explore
            onActivityClick={handleActivityClick}
            onFacilityClick={(id) => {
              setSelectedFacilityId(id);
              setCurrentScreen('facility-detail');
            }}
            onProductClick={(id) => {
              setSelectedProductId(id);
              setCurrentScreen('product-detail');
            }}
            onServiceClick={(id) => {
              setSelectedServiceId(id);
              setCurrentScreen('service-detail');
            }}
            onPersonClick={(id) => {
              setSelectedPersonId(id);
              setCurrentScreen('person-detail');
            }}
            onNavigate={handleNavigate}
            onGoalClick={handleGoalClick}
          />
        );
      }
      hideBottomNav = true;
      break;
    case 'person-detail':
      screenContent = selectedPersonId ? (
        <PersonDetail
          personId={selectedPersonId}
          onBack={() => {
            setCurrentScreen('explore');
            setSelectedPersonId(null);
          }}
          onMessage={(personId) => {
            // Navigate to messages and open conversation
            setCurrentScreen('messages');
          }}
          onSquadClick={(squadId) => {
            setSelectedSquadId(squadId);
            setCurrentScreen('squad-detail');
          }}
        />
      ) : (
        <Explore
          onActivityClick={handleActivityClick}
          onFacilityClick={(id) => {
            setSelectedFacilityId(id);
            setCurrentScreen('facility-detail');
          }}
          onProductClick={(id) => {
            setSelectedProductId(id);
            setCurrentScreen('product-detail');
          }}
          onServiceClick={(id) => {
            setSelectedServiceId(id);
            setCurrentScreen('service-detail');
          }}
          onPersonClick={(id) => {
            setSelectedPersonId(id);
            setCurrentScreen('person-detail');
          }}
          onNavigate={handleNavigate}
          onGoalClick={handleGoalClick}
        />
      );
      hideBottomNav = true;
      break;
    case 'squad-detail':
      screenContent = selectedSquadId ? (
        <SquadDetail
          squadId={selectedSquadId}
          onBack={() => {
            setCurrentScreen('explore');
            setSelectedSquadId(null);
          }}
          onNotifications={() => setCurrentScreen('notifications')}
          onMessages={() => setCurrentScreen('messages')}
          onProfile={() => setCurrentScreen('profile')}
          onPersonClick={(personId) => {
            setSelectedPersonId(personId);
            setCurrentScreen('person-detail');
          }}
          onActivityClick={(activityId) => {
            setSelectedActivityId(activityId);
            setCurrentScreen('activity-detail');
          }}
        />
      ) : (
        <Explore
          onActivityClick={handleActivityClick}
          onFacilityClick={(id) => {
            setSelectedFacilityId(id);
            setCurrentScreen('facility-detail');
          }}
          onProductClick={(id) => {
            setSelectedProductId(id);
            setCurrentScreen('product-detail');
          }}
          onServiceClick={(id) => {
            setSelectedServiceId(id);
            setCurrentScreen('service-detail');
          }}
          onPersonClick={(id) => {
            setSelectedPersonId(id);
            setCurrentScreen('person-detail');
          }}
          onNavigate={handleNavigate}
          onGoalClick={handleGoalClick}
        />
      );
      hideBottomNav = true;
      break;
    case 'facilities':
      screenContent = (
        <Facilities
          onFacilityClick={(id) => {
            setSelectedFacilityId(id);
            setCurrentScreen('facility-detail');
          }}
          onSetRightSidebar={setRightSidebarContent}
          userType={userType}
        />
      );
      break;
    case 'products':
      screenContent = (
        <Products
          onProductClick={(id) => {
            setSelectedProductId(id);
            setCurrentScreen('product-detail');
          }}
          userType={userType}
        />
      );
      break;
    case 'services':
      screenContent = (
        <Services
          onServiceClick={(id) => {
            setSelectedServiceId(id);
            setCurrentScreen('service-detail');
          }}
          userType={userType}
        />
      );
      break;
    case 'marketplace':
      screenContent = (
        <Marketplace
          onProductDetail={(id) => {
            setSelectedProductId(id);
            setCurrentScreen('product-detail');
          }}
          onStoreDetail={(id) => {
            setSelectedStoreId(id);
            setCurrentScreen('store-detail');
          }}
          onNotifications={() => setCurrentScreen('notifications')}
          onMessages={() => setCurrentScreen('messages')}
          onProfile={() => setCurrentScreen('profile')}
          onSwitchProfile={(type) => {
            setUserType(type);
            if (type === 'business') {
              setCurrentScreen('business');
            }
          }}
          onNavigate={handleNavigate}
          setRightSidebar={setRightSidebar}
        />
      );
      break;
    case 'store-detail':
      if (selectedStoreId) {
        screenContent = (
          <StoreDetail
            storeId={selectedStoreId}
            onBack={() => {
              setCurrentScreen('marketplace');
              setSelectedStoreId(null);
            }}
            onProductDetail={(id) => {
              setSelectedProductId(id);
              setCurrentScreen('product-detail');
            }}
            onNotifications={() => setCurrentScreen('notifications')}
            onMessages={() => setCurrentScreen('messages')}
            onProfile={() => setCurrentScreen('profile')}
          />
        );
      } else {
        screenContent = (
          <Marketplace
            onProductDetail={(id) => {
              setSelectedProductId(id);
              setCurrentScreen('product-detail');
            }}
            onStoreDetail={(id) => {
              setSelectedStoreId(id);
              setCurrentScreen('store-detail');
            }}
            onNotifications={() => setCurrentScreen('notifications')}
            onMessages={() => setCurrentScreen('messages')}
            onProfile={() => setCurrentScreen('profile')}
            onSwitchProfile={(type) => {
              setUserType(type);
              if (type === 'business') {
                setCurrentScreen('business');
              }
            }}
            onNavigate={handleNavigate}
            setRightSidebar={setRightSidebar}
          />
        );
      }
      hideBottomNav = true;
      break;
    case 'businesses':
      screenContent = (
        <Businesses
          onBusinessClick={(id) => {
            // Navigate to business detail or profile
            console.log('Business clicked:', id);
          }}
        />
      );
      break;
    case 'jobs':
      screenContent = (
        <Jobs
          onJobClick={(id) => {
            // Navigate to job detail
            console.log('Job clicked:', id);
          }}
        />
      );
      break;
    case 'activities':
      screenContent = (
        <Activities
          onActivityClick={handleActivityClick}
          onSetRightSidebar={setRightSidebarContent}
          userType={userType}
        />
      );
      break;
    case 'explore':
      screenContent = (
        <Explore
          onActivityClick={handleActivityClick}
          onBusinessClick={(id) => console.log('Business clicked:', id)}
          onFacilityClick={(id) => {
            setSelectedFacilityId(id);
            setCurrentScreen('facility-detail');
          }}
          onProductClick={(id) => {
            setSelectedProductId(id);
            setCurrentScreen('product-detail');
          }}
          onServiceClick={(id) => {
            setSelectedServiceId(id);
            setCurrentScreen('service-detail');
          }}
          onPersonClick={(id) => {
            setSelectedPersonId(id);
            setCurrentScreen('person-detail');
          }}
          onNavigate={handleNavigate}
          onGoalClick={handleGoalClick}
          onNotifications={() => setCurrentScreen('notifications')}
          onMessages={() => setCurrentScreen('messages')}
          onProfile={() => setCurrentScreen('profile')}
          onSwitchProfile={(type) => {
            setUserType(type);
            if (type === 'business') {
              setCurrentScreen('business');
            }
          }}
          onTabChange={(tab) => setExploreActiveTab(tab)}
          userType={userType}
        />
      );
      break;
    case 'community':
      screenContent = (
        <Community
          onSquadClick={(squadId) => {
            setSelectedSquadId(squadId);
            setCurrentScreen('squad-profile');
          }}
          onPersonClick={(personId) => {
            setSelectedPersonId(personId);
            setCurrentScreen('person-detail');
          }}
        />
      );
      break;
    case 'squad-profile':
      screenContent = selectedSquadId ? (
        <SquadProfile
          squadId={selectedSquadId}
          onBack={() => {
            setCurrentScreen('community');
            setSelectedSquadId(null);
          }}
        />
      ) : (
        <Community
          onSquadClick={(squadId) => {
            setSelectedSquadId(squadId);
            setCurrentScreen('squad-profile');
          }}
        />
      );
      hideBottomNav = true;
      break;
    case 'squad':
    case 'squad-dashboard':
      screenContent = (
        <SquadDashboard
          currentSquadId={currentProfileId}
          onCreateActivity={() => setCurrentScreen('create-activity')}
          onManageMembers={() => setCurrentScreen('squad-members')}
        />
      );
      break;
    case 'home':
    default:
      screenContent = (
        <Home
          onActivityClick={handleActivityClick}
        />
      );
  }

  return (
    <>
      <RootLayout
        activeScreen={currentScreen}
        onNavigate={handleNavigate}
        onNotifications={() => setCurrentScreen('notifications')}
        onMessages={() => setCurrentScreen('messages')}
        onProfile={() => setCurrentScreen('profile')}
        onSwitchProfile={(type, profileId) => {
          if (type === 'user') {
            setUserType('user');
            setCurrentProfileId(profileId || 'personal-1');
            setCurrentScreen('profile');
          } else if (type === 'business' && profileId) {
            setUserType('business');
            setCurrentBusinessId(profileId);
            setCurrentProfileId(profileId);
            setCurrentScreen('business');
          } else if (type === 'squad' && profileId) {
            setUserType('user'); // Keep userType as user since squad uses user screens
            setCurrentProfileId(profileId);
            setCurrentScreen('squad');
          }
        }}
        currentProfile={userType}
        currentProfileId={currentProfileId}
        rightSidebarContent={rightSidebarContent}
      >
        {screenContent}
      </RootLayout>
      {!hideBottomNav && (
        <BottomNav
          activeTab={currentScreen}
          onTabChange={handleTabChange}
          userType={userType}
        />
      )}
      <Toaster />
    </>
  );
}

import { useState } from 'react';
import { Toaster } from '@/app/components/ui/sonner';

// Onboarding
import { SignUp } from '@/app/screens/onboarding/SignUp';
import { ChooseSports } from '@/app/screens/onboarding/ChooseSports';
import { ExperienceLevel } from '@/app/screens/onboarding/ExperienceLevel';
import { SetGoals } from '@/app/screens/onboarding/SetGoals';
import { Confirmation } from '@/app/screens/onboarding/Confirmation';

// User Screens
import { Home } from '@/app/screens/user/Home';
import { Explore } from '@/app/screens/user/Explore';
import { Facilities } from '@/app/screens/user/Facilities';
import { Products } from '@/app/screens/user/Products';
import { Businesses } from '@/app/screens/user/Businesses';
import { Jobs } from '@/app/screens/user/Jobs';
import { ActivityDetail } from '@/app/screens/user/ActivityDetail';
import { FacilityDetail } from '@/app/screens/user/FacilityDetail';
import { ProductDetail } from '@/app/screens/user/ProductDetail';
import { ServiceDetail } from '@/app/screens/user/ServiceDetail';
import { PersonDetail } from '@/app/screens/user/PersonDetail';
import { Goals } from '@/app/screens/user/Goals';
import { Messages } from '@/app/screens/user/Messages';
import { Conversation } from '@/app/screens/user/Conversation';
import { Notifications } from '@/app/screens/user/Notifications';
import { Profile } from '@/app/screens/user/Profile';
import { ProfileEnhanced } from '@/app/screens/user/ProfileEnhanced';
import { Marketplace } from '@/app/screens/user/Marketplace';
import { StoreDetail } from '@/app/screens/user/StoreDetail';

// Business Screens
import { BusinessDashboard } from '@/app/screens/business/BusinessDashboard';
import { CreateActivity } from '@/app/screens/business/CreateActivity';
import { CreateActivitySteps } from '@/app/screens/business/CreateActivitySteps';
import { ManageResources } from '@/app/screens/business/ManageResources';
import { ManageCustomers } from '@/app/screens/business/ManageCustomers';
import { TeamManagement } from '@/app/screens/business/TeamManagement';
import { CreateBusiness } from '@/app/screens/business/CreateBusiness';

// Navigation
import { BottomNav } from '@/app/components/BottomNav';
import { RootLayout } from '@/app/components/RootLayout';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';

type OnboardingStep = 'signup' | 'sports' | 'level' | 'goals' | 'confirmation';
type UserType = 'user' | 'business';
type Screen = 
  | 'home'
  | 'activities'
  | 'facilities'
  | 'products'
  | 'businesses'
  | 'jobs'
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
  | 'goals' 
  | 'profile'
  | 'business-profile'
  | 'messages'
  | 'conversation'
  | 'notifications'
  | 'business'
  | 'create-activity'
  | 'marketplace'
  | 'store-detail'
  | 'manage-resources'
  | 'manage-customers'
  | 'manage-team'
  | 'create-business';

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
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [currentBusinessId, setCurrentBusinessId] = useState<string>('business-1');

  // Onboarding state
  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<string>('');
  const [goals, setGoals] = useState<string[]>([]);

  // Onboarding handlers
  const handleSignUpComplete = () => {
    setOnboardingStep('sports');
  };

  const handleSportsComplete = (sports: string[]) => {
    setSelectedSports(sports);
    setOnboardingStep('level');
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
      // Would set explore tab state here
    } else if (destination === 'messages') {
      setCurrentScreen('messages');
    } else if (destination === 'notifications') {
      setCurrentScreen('notifications');
    } else if (destination === 'goals') {
      setCurrentScreen('goals');
    } else {
      setCurrentScreen(destination as Screen);
    }
  };

  const handleConversationClick = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setCurrentScreen('conversation');
  };

  // Render onboarding
  if (isOnboarding) {
    switch (onboardingStep) {
      case 'signup':
        return <SignUp onComplete={handleSignUpComplete} />;
      case 'sports':
        return (
          <ChooseSports
            onComplete={handleSportsComplete}
            onBack={() => setOnboardingStep('signup')}
          />
        );
      case 'level':
        return (
          <ExperienceLevel
            onComplete={handleLevelComplete}
            onBack={() => setOnboardingStep('sports')}
          />
        );
      case 'goals':
        return (
          <SetGoals
            onComplete={handleGoalsComplete}
            onBack={() => setOnboardingStep('level')}
          />
        );
      case 'confirmation':
        return <Confirmation onComplete={handleOnboardingComplete} />;
    }
  }

  // Profile screen
  if (currentScreen === 'profile') {
    if (userType === 'business') {
      // Business users see the BusinessDashboard which now includes profile
      setCurrentScreen('business');
      return null;
    }
    return (
      <>
        <ProfileEnhanced
          onNotifications={() => setCurrentScreen('notifications')}
          onMessages={() => setCurrentScreen('messages')}
          onGoals={() => setCurrentScreen('goals')}
          onSwitchProfile={(type, profileId) => {
            setUserType(type);
            if (type === 'business') {
              if (profileId) {
                setCurrentBusinessId(profileId);
              }
              setCurrentScreen('business');
            }
          }}
        />
        <BottomNav
          activeTab="profile"
          onTabChange={handleTabChange}
          userType="user"
        />
      </>
    );
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
        <CreateActivitySteps
          onBack={() => setCurrentScreen('business')}
          onSubmit={() => setCurrentScreen('business')}
        />
      );
    }

    return (
      <>
        <BusinessDashboard
          onCreateActivity={() => setCurrentScreen('create-activity')}
          onManageFacilities={() => setCurrentScreen('manage-resources')}
          onManageCustomers={() => setCurrentScreen('manage-customers')}
          onManageTeam={() => setCurrentScreen('manage-team')}
          onCreateBusiness={() => setCurrentScreen('create-business')}
          onNotifications={() => setCurrentScreen('notifications')}
          onMessages={() => setCurrentScreen('messages')}
          onProfile={() => setCurrentScreen('business')}
          onSwitchProfile={(type, profileId) => {
            setUserType(type);
            if (type === 'user') {
              setCurrentScreen('home');
            } else if (type === 'business' && profileId) {
              setCurrentBusinessId(profileId);
              setCurrentScreen('business');
            }
          }}
          currentBusinessId={currentBusinessId}
        />
        <BottomNav
          activeTab={currentScreen}
          onTabChange={handleTabChange}
          userType="business"
        />
      </>
    );
  }

  // User screens
  let screenContent;
  let hideBottomNav = false;

  switch (currentScreen) {
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
      screenContent = selectedFacilityId ? (
        <FacilityDetail
          facilityId={selectedFacilityId}
          onBack={() => {
            setCurrentScreen('explore');
            setSelectedFacilityId(null);
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
    case 'product-detail':
      screenContent = selectedProductId ? (
        <ProductDetail
          productId={selectedProductId}
          onBack={() => {
            setCurrentScreen('explore');
            setSelectedProductId(null);
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
    case 'service-detail':
      screenContent = selectedServiceId ? (
        <ServiceDetail
          serviceId={selectedServiceId}
          onBack={() => {
            setCurrentScreen('explore');
            setSelectedServiceId(null);
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
        />
      );
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
    case 'goals':
      screenContent = (
        <Goals 
          onGoalClick={handleGoalClick}
          onNavigate={handleNavigate}
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
      break;
    case 'activities':
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
      break;
    case 'explore':
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
          setUserType(type);
          if (type === 'business') {
            if (profileId) {
              setCurrentBusinessId(profileId);
            }
            setCurrentScreen('business');
          }
        }}
        currentProfile={userType}
        currentProfileId="personal-1"
      >
        {screenContent}
      </RootLayout>
      <Toaster />
    </>
  );
}

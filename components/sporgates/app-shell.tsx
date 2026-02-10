"use client"

import { useState, useCallback } from "react"
import type { PageRoute } from "@/lib/navigation"
import { TopBar } from "@/components/sporgates/top-bar"
import { ExploreSidebar } from "@/components/sporgates/explore-sidebar"
import { FeedSidebar } from "@/components/sporgates/feed-sidebar"
import { BottomNav } from "@/components/sporgates/bottom-nav"
import { HomePage } from "@/components/sporgates/pages/home-page"
import { ExplorePage } from "@/components/sporgates/pages/explore-page"
import { ActivitiesPage } from "@/components/sporgates/pages/activities-page"
import { ActivityDetailPage } from "@/components/sporgates/pages/activity-detail-page"
import { FacilitiesPage } from "@/components/sporgates/pages/facilities-page"
import { MarketplacePage } from "@/components/sporgates/pages/marketplace-page"
import { ProductsPage } from "@/components/sporgates/pages/products-page"
import { ServicesPage } from "@/components/sporgates/pages/services-page"
import { BusinessesPage } from "@/components/sporgates/pages/businesses-page"
import { JobsPage } from "@/components/sporgates/pages/jobs-page"
import { MessagesPage } from "@/components/sporgates/pages/messages-page"
import { ConversationPage } from "@/components/sporgates/pages/conversation-page"
import { NotificationsPage } from "@/components/sporgates/pages/notifications-page"
import { ProfilePage } from "@/components/sporgates/pages/profile-page"
import { ProfileEnhancedPage } from "@/components/sporgates/pages/profile-enhanced-page"
import { ProfileInformationPage } from "@/components/sporgates/pages/profile-information-page"
import { PersonDetailPage } from "@/components/sporgates/pages/person-detail-page"
import { SettingsPage } from "@/components/sporgates/pages/settings-page"
import { SettingsProfilePage } from "@/components/sporgates/pages/settings-profile-page"
import { SettingsPrivacyPage } from "@/components/sporgates/pages/settings-privacy-page"
import { SettingsNotificationsPage } from "@/components/sporgates/pages/settings-notifications-page"
import { SettingsPaymentPage } from "@/components/sporgates/pages/settings-payment-page"
import { SettingsWalletPage } from "@/components/sporgates/pages/settings-wallet-page"
import { SettingsLanguagePage } from "@/components/sporgates/pages/settings-language-page"
import { SettingsBlockedPage } from "@/components/sporgates/pages/settings-blocked-page"
import { SettingsTermsPage } from "@/components/sporgates/pages/settings-terms-page"
import { SettingsPrivacyPolicyPage } from "@/components/sporgates/pages/settings-privacy-policy-page"
import { SettingsHelpPage } from "@/components/sporgates/pages/settings-help-page"
import { AuthPages } from "@/components/sporgates/pages/auth-pages"
import { BusinessDashboardPage } from "@/components/sporgates/pages/business-dashboard-page"
import { FacilityDetailPage } from "@/components/sporgates/pages/facility-detail-page"
import { ProductDetailPage } from "@/components/sporgates/pages/product-detail-page"
import { ServiceDetailPage } from "@/components/sporgates/pages/service-detail-page"
import { BusinessDetailPage } from "@/components/sporgates/pages/business-detail-page"
import { OrganizerPortfolio } from "@/components/sporgates/business/organizer-portfolio"
import {
  BusinessActivitiesPage,
  BusinessCustomersPage,
  BusinessTeamPage,
  BusinessAnalyticsPage,
  BusinessCampaignsPage,
  BusinessResourcesPage,
  BusinessPartnersPage,
} from "@/components/sporgates/pages/business-pages"
import { CommunityPage } from "@/components/sporgates/pages/community-page"
import { SquadDetailPage } from "@/components/sporgates/pages/squad-detail-page"
import { SquadProfilePage } from "@/components/sporgates/pages/squad-profile-page"
import { SquadDashboardPage } from "@/components/sporgates/pages/squad-dashboard-page"
import { StoreDetailPage } from "@/components/sporgates/pages/store-detail-page"
import { SettingsDataPermissionsPage } from "@/components/sporgates/pages/settings-data-permissions-page"
import { SettingsTransactionsPage } from "@/components/sporgates/pages/settings-transactions-page"
import {
  CreateActivityPage,
  CreateActivityStepsPage,
  CreateCampaignPage,
  CreateBusinessPage,
  AddResourcePage,
  AddTeamMemberPage,
  AddCollaborationPage,
  BusinessAthletesPage,
  ManageResourcesPage,
  ManageCustomersPage,
  TeamManagementPage,
  BusinessProfilePage,
  AttendanceManagementPage,
} from "@/components/sporgates/pages/business-forms"

const authPages: PageRoute[] = [
  "signin",
  "signup",
  "forgot-password",
  "reset-password",
  "verify-email",
  "choose-sports",
  "set-goals",
  "onboarding-confirmation",
]

export function AppShell() {
  const [currentPage, setCurrentPage] = useState<PageRoute>("home")
  const [detailId, setDetailId] = useState<string | null>(null)
  const [isBusinessMode, setIsBusinessMode] = useState(false)

  const navigate = useCallback((page: PageRoute, id?: string) => {
    setCurrentPage(page)
    setDetailId(id || null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const toggleBusinessMode = useCallback(() => {
    setIsBusinessMode((prev) => {
      const next = !prev
      setCurrentPage(next ? "business-dashboard" : "home")
      return next
    })
  }, [])

  const isAuth = authPages.includes(currentPage)
  const showSidebars = !isAuth && currentPage !== "messages"
  const hideRightSidebarPages: PageRoute[] = [
    "activity-detail",
    "facility-detail",
    "product-detail",
    "service-detail",
    "business-detail",
    "organizer-portfolio",
    "person-detail",
    "squad-profile",
  ]
  const showRightSidebar = showSidebars && !isBusinessMode && !hideRightSidebarPages.includes(currentPage)

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={navigate} />
      case "explore":
        return <ExplorePage onNavigate={navigate} />
      case "activities":
        return <ActivitiesPage onNavigate={navigate} />
      case "activity-detail":
        return <ActivityDetailPage activityId={detailId || "1"} onNavigate={navigate} />
      case "facilities":
        return <FacilitiesPage onNavigate={navigate} />
      case "facility-detail":
        return <FacilityDetailPage facilityId={detailId || "1"} onNavigate={navigate} />
      case "marketplace":
        return <MarketplacePage onNavigate={navigate} />
      case "products":
        return <ProductsPage onNavigate={navigate} />
      case "product-detail":
        return <ProductDetailPage productId={detailId || "1"} onNavigate={navigate} />
      case "services":
        return <ServicesPage onNavigate={navigate} />
      case "service-detail":
        return <ServiceDetailPage serviceId={detailId || "1"} onNavigate={navigate} />
      case "businesses":
        return <BusinessesPage onNavigate={navigate} />
      case "business-detail":
        return <BusinessDetailPage businessId={detailId || "1"} onNavigate={navigate} />
      case "organizer-portfolio":
        return <OrganizerPortfolio onClose={() => navigate("business-detail", detailId || "1")} />
      case "jobs":
        return <JobsPage onNavigate={navigate} />
      case "messages":
        return <MessagesPage onNavigate={navigate} />
      case "conversation":
        return <ConversationPage conversationId={detailId || "1"} onNavigate={navigate} />
      case "notifications":
        return <NotificationsPage />
      case "profile":
        return <ProfilePage onNavigate={navigate} />
      case "profile-enhanced":
        return <ProfileEnhancedPage onNavigate={navigate} />
      case "profile-information":
        return <ProfileInformationPage onNavigate={navigate} />
      case "person-detail":
        return <PersonDetailPage personId={detailId || "1"} onNavigate={navigate} />
      case "settings":
        return <SettingsPage onNavigate={navigate} />
      case "settings-profile":
        return <SettingsProfilePage onNavigate={navigate} />
      case "settings-privacy":
        return <SettingsPrivacyPage onBack={() => navigate("settings")} />
      case "settings-notifications":
        return <SettingsNotificationsPage onBack={() => navigate("settings")} />
      case "settings-payment":
        return <SettingsPaymentPage onBack={() => navigate("settings")} />
      case "settings-wallet":
        return <SettingsWalletPage onBack={() => navigate("settings")} />
      case "settings-language":
        return <SettingsLanguagePage onBack={() => navigate("settings")} />
      case "settings-blocked":
        return <SettingsBlockedPage onBack={() => navigate("settings")} />
      case "settings-terms":
        return <SettingsTermsPage onBack={() => navigate("settings")} />
      case "settings-privacy-policy":
        return <SettingsPrivacyPolicyPage onBack={() => navigate("settings")} />
      case "settings-help":
        return <SettingsHelpPage onBack={() => navigate("settings")} />
      case "business-dashboard":
        return <BusinessDashboardPage onNavigate={navigate} />
      case "business-activities":
        return <BusinessActivitiesPage onNavigate={navigate} />
      case "business-customers":
        return <BusinessCustomersPage onNavigate={navigate} />
      case "business-team":
        return <BusinessTeamPage onNavigate={navigate} />
      case "business-analytics":
        return <BusinessAnalyticsPage onNavigate={navigate} />
      case "business-campaigns":
        return <BusinessCampaignsPage onNavigate={navigate} />
      case "business-resources":
        return <BusinessResourcesPage onNavigate={navigate} />
      case "business-partners":
        return <BusinessPartnersPage onNavigate={navigate} />
      case "community":
        return <CommunityPage onNavigate={navigate} />
      case "squad-detail":
        return <SquadDetailPage squadId={detailId || "1"} onNavigate={navigate} />
      case "squad-profile":
        return <SquadProfilePage squadId={detailId || "1"} onNavigate={navigate} />
      case "squad-dashboard":
        return <SquadDashboardPage onNavigate={navigate} />
      case "store-detail":
        return <StoreDetailPage businessId={detailId || "1"} onNavigate={navigate} />
      case "settings-data-permissions":
        return <SettingsDataPermissionsPage onBack={() => navigate("settings")} />
      case "settings-transactions":
        return <SettingsTransactionsPage onBack={() => navigate("settings")} />
      case "business-athletes":
        return <BusinessAthletesPage onNavigate={navigate} />
      case "business-profile":
        return <BusinessProfilePage onNavigate={navigate} />
      case "create-activity":
        return <CreateActivityPage onNavigate={navigate} />
      case "create-activity-steps":
        return <CreateActivityStepsPage onNavigate={navigate} />
      case "create-campaign":
        return <CreateCampaignPage onNavigate={navigate} />
      case "create-business":
        return <CreateBusinessPage onNavigate={navigate} />
      case "add-resource":
        return <AddResourcePage onNavigate={navigate} />
      case "add-team-member":
        return <AddTeamMemberPage onNavigate={navigate} />
      case "add-collaboration":
        return <AddCollaborationPage onNavigate={navigate} />
      case "manage-resources":
        return <ManageResourcesPage onNavigate={navigate} />
      case "manage-customers":
        return <ManageCustomersPage onNavigate={navigate} />
      case "team-management":
        return <TeamManagementPage onNavigate={navigate} />
      case "attendance-management":
        return <AttendanceManagementPage onNavigate={navigate} />
      case "signin":
      case "signup":
      case "forgot-password":
      case "reset-password":
      case "verify-email":
      case "choose-sports":
      case "set-goals":
      case "onboarding-confirmation":
        return <AuthPages page={currentPage} onNavigate={navigate} />
      default:
        return <HomePage onNavigate={navigate} />
    }
  }

  if (isAuth) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {renderPage()}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopBar
        onNavigate={navigate}
        isBusinessMode={isBusinessMode}
        onToggleBusinessMode={toggleBusinessMode}
        unreadMessages={3}
        unreadNotifications={2}
      />
      <div className="flex">
        {showSidebars && (
          <ExploreSidebar
            currentPage={currentPage}
            onNavigate={navigate}
            isBusinessMode={isBusinessMode}
          />
        )}
        <main className="min-w-0 flex-1 p-4 lg:p-6">
          {renderPage()}
        </main>
        {showRightSidebar && <FeedSidebar onNavigate={navigate} />}
      </div>
      <BottomNav
        currentPage={currentPage}
        onNavigate={navigate}
        isBusinessMode={isBusinessMode}
      />
    </div>
  )
}

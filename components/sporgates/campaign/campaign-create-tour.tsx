"use client"

import { TourGuide, type TourStep, TourHelpButton, useTour } from "@/components/ui/tour-guide"

export const CAMPAIGN_CREATE_TOUR_STORAGE_KEY = "sporgates.campaignCreateTour.v1"
export const CAMPAIGNS_DASHBOARD_TOUR_STORAGE_KEY = "sporgates.campaignsDashboardTour.v1"

/** Default copy for the create-campaign guided tour */
export const CAMPAIGN_CREATE_TOUR_STEPS: TourStep[] = [
  {
    target: "header",
    title: "Create a marketing campaign",
    body: "This screen walks you through launching a campaign: name it, pick a goal, set budget and dates, choose who sees it, and plan how you communicate before, during, and after your event.",
  },
  {
    target: "details",
    title: "Campaign details",
    body: "Give your campaign a clear name and description so your team knows what it is. Choose a goal—awareness, bookings, or engagement—so later reporting matches what you are trying to achieve.",
  },
  {
    target: "budget",
    title: "Budget & schedule",
    body: "Set how much you want to spend and when the campaign runs. The estimate helps you think about reach; you can adjust budget and dates before you go live.",
  },
  {
    target: "audience",
    title: "Target audience",
    body: "Narrow who should see your campaign—everyone, athletes, beginners, or people near you. This helps focus spend on people most likely to care about your activities.",
  },
  {
    target: "communication",
    title: "Communication plan",
    body: "Plan messaging for before, during, and after your event—print, athlete collaboration, and deliverables. Switch tabs to configure each phase so promotion stays consistent end to end.",
  },
  {
    target: "actions",
    title: "Save or launch",
    body: "Cancel returns you to campaigns without saving this draft. Launch Campaign confirms you are ready—use it when details, budget, audience, and comms look right.",
  },
]

/** Default copy for the campaigns dashboard guided tour */
export const CAMPAIGNS_DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    target: "dashboard-header",
    title: "Your campaigns dashboard",
    body: "This is where you manage all marketing campaigns: create new ones, monitor performance, and take actions like launch, pause, and optimize creatives.",
  },
  {
    target: "dashboard-new",
    title: "Create a new campaign",
    body: "Start here to create a campaign. You’ll set objective, budget, targeting, and the creatives that will show in the app.",
  },
  {
    target: "dashboard-metrics",
    title: "High-level results",
    body: "These totals give a quick pulse on budget, spend, reach, and conversions across all campaigns in the selected time window.",
  },
  {
    target: "dashboard-list",
    title: "Campaign list",
    body: "Each card is a campaign. Open KPI Review / Monitor KPIs to dig into performance and creatives, and use the status guidance to know what to do next.",
  },
]
export function useCampaignCreateTour() {
  return useTour(CAMPAIGN_CREATE_TOUR_STORAGE_KEY)
}

export function useCampaignDashboardTour() {
  return useTour(CAMPAIGNS_DASHBOARD_TOUR_STORAGE_KEY)
}

export function CampaignCreateTour({
  steps,
  active,
  onClose,
  storageKey = CAMPAIGN_CREATE_TOUR_STORAGE_KEY,
}: {
  steps: TourStep[]
  active: boolean
  onClose: () => void
  storageKey?: string
}) {
  return (
    <TourGuide
      steps={steps}
      active={active}
      onClose={onClose}
      storageKey={storageKey}
      targetAttribute="data-campaign-tour"
    />
  )
}

export const CampaignTourHelpButton = TourHelpButton

export type CampaignStatus =
  | "DRAFT"
  | "READY"
  | "LEARNING"
  | "ACTIVE"
  | "LEARNING_LIMITED"
  | "PAUSED"
  | "ENDED"
  | "ARCHIVED";

export type CampaignObjective =
  | "AWARENESS"
  | "ACTIVITY_BOOKINGS"
  | "EVENT_ATTENDEES"
  | "PARTNER_LEADS";

export type CampaignBudgetType = "DAILY" | "LIFETIME";

export interface CampaignAudience {
  location: string;
  radiusMiles: number;
  ageMin: number;
  ageMax: number;
  gender: "all" | "male" | "female" | string;
  sports: string[];
  segmentType?: "cold" | "warm" | "retargeting" | string;
  retargetingSources?: string[];
  lookalikeEnabled?: boolean;
  lookalikeSeed?: string;
  audienceQualityScore?: number;
}

export interface CreateCampaignCommand {
  name: string;
  objective: CampaignObjective;
  budgetType: CampaignBudgetType;
  budgetAmount: number;
  startDate: string;
  endDate: string;
  location: string;
  radiusMiles: number;
  ageMin: number;
  ageMax: number;
  gender: string;
  sports: string[];
}

export interface UpdateCampaignAudienceCommand extends CampaignAudience {}

export interface CampaignForecast {
  potentialAudience: number;
  estimatedReach: number;
  estimatedAttendees: number;
  estimatedEvents: number;
  dailyBudget: number;
  costPerEngagement: number;
  audienceDensity: "high" | "medium" | "low" | string;
  significantEditLikelyToResetLearning: boolean;
}

export interface CampaignPerformance {
  totalSpend: number;
  totalReach: number;
  totalClicks?: number;
  totalConversions: number;
  totalRevenue?: number;
  clickThroughRate?: number;
  costPerClick?: number;
  conversionRate: number;
  costPerConversion: number;
  roas?: number;
  health?: "ON_TRACK" | "UNDERPERFORMING" | "NEEDS_CREATIVE_REFRESH" | string;
  timeWindowDays?: number;
}

export interface CampaignAdNetworkSync {
  provider: string;
  externalCampaignId?: string;
  externalAdSetId?: string;
  syncStatus: "NOT_CONNECTED" | "SYNC_PENDING" | "SYNCED" | "SYNC_FAILED" | string;
  lastSyncAt?: string;
}

export interface CampaignListItem {
  id: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  budgetAmount: number;
  spent: number;
  reach: number;
  conversions: number;
  startDate: string;
  endDate: string;
}

export interface Campaign {
  id: string;
  businessId: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  budgetType: CampaignBudgetType;
  budgetAmount: number;
  startDate: string;
  endDate: string;
  significantEditCount: number;
  audience: CampaignAudience;
  performance: CampaignPerformance;
  adNetworkSync?: CampaignAdNetworkSync;
  snapshots?: Array<{
    snapshotDate: string;
    spend: number;
    reach: number;
    clicks?: number;
    conversions: number;
    revenue?: number;
    ctr?: number;
    costPerClick?: number;
    costPerConversion: number;
    roas?: number;
    conversionRate: number;
  }>;
}

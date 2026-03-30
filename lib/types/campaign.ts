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
export type CampaignConversionEvent =
  | "ACTIVITY_BOOKED"
  | "EVENT_RSVP_CONFIRMED"
  | "PARTNER_LEAD_SUBMITTED"
  | "PROFILE_VISIT"
  | "MESSAGE_SENT";
export type CampaignAttributionModel = "LAST_TOUCH" | "FIRST_TOUCH" | "LINEAR";

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
  excludedAudienceIds?: string[];
  savedAudiences?: CampaignAudienceProfile[];
}

export interface CampaignAudienceProfile {
  id: string;
  name: string;
  audience: CampaignAudience;
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
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  utmTerm?: string;
  primaryConversionEvent: CampaignConversionEvent;
  attributionModel: CampaignAttributionModel;
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

export interface CampaignMeasurement {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent?: string;
  utmTerm?: string;
  primaryConversionEvent: CampaignConversionEvent;
  attributionModel: CampaignAttributionModel;
}

export type CampaignCreativeStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "WINNER" | "LOSER";

export interface CampaignCreative {
  id: string;
  angle: string;
  hook: string;
  headline: string;
  primaryText: string;
  cta: string;
  control: boolean;
  status: CampaignCreativeStatus;
}

export interface CreateCampaignCreativeCommand {
  angle: string;
  hook: string;
  headline: string;
  primaryText: string;
  cta: string;
  control: boolean;
}

export interface UpdateCampaignCreativeStatusCommand {
  status: CampaignCreativeStatus;
}

export type CampaignExperimentStatus = "DRAFT" | "RUNNING" | "COMPLETED" | "CANCELLED";

export interface CampaignExperiment {
  id: string;
  hypothesis: string;
  controlCreativeId: string;
  variantCreativeIds: string[];
  minSampleSize: number;
  startDate: string;
  endDate: string;
  winnerCreativeId?: string;
  status: CampaignExperimentStatus;
}

export interface CreateCampaignExperimentCommand {
  hypothesis: string;
  controlCreativeId: string;
  variantCreativeIds: string[];
  minSampleSize: number;
  startDate: string;
  endDate: string;
}

export interface PromoteCampaignExperimentWinnerCommand {
  winnerCreativeId: string;
}

export interface SaveCampaignAudienceCommand {
  name: string;
}

export interface UpdateCampaignExclusionsCommand {
  excludedAudienceIds: string[];
}

export interface CampaignListItem {
  id: string;
  name: string;
  objective: CampaignObjective;
  status: CampaignStatus;
  primaryConversionEvent?: CampaignConversionEvent;
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
  measurement?: CampaignMeasurement;
  performance: CampaignPerformance;
  adNetworkSync?: CampaignAdNetworkSync;
  creatives?: CampaignCreative[];
  experiments?: CampaignExperiment[];
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

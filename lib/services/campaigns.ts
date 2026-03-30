import { campaignsApi } from "@/lib/api/campaigns";
import type {
  Campaign,
  CampaignForecast,
  CampaignListItem,
  CreateCampaignCreativeCommand,
  CreateCampaignExperimentCommand,
  CreateCampaignCommand,
  PromoteCampaignExperimentWinnerCommand,
  SaveCampaignAudienceCommand,
  UpdateCampaignCreativeStatusCommand,
  UpdateCampaignAudienceCommand,
  UpdateCampaignExclusionsCommand,
} from "@/lib/types/campaign";

export const campaignsService = {
  list: (businessId: string): Promise<CampaignListItem[]> => campaignsApi.list(businessId),
  getById: (businessId: string, campaignId: string, windowDays?: number): Promise<Campaign> =>
    campaignsApi.getById(businessId, campaignId, windowDays),
  create: (businessId: string, command: CreateCampaignCommand): Promise<Campaign> =>
    campaignsApi.create(businessId, command),
  launch: (businessId: string, campaignId: string): Promise<Campaign> =>
    campaignsApi.launch(businessId, campaignId),
  pause: (businessId: string, campaignId: string): Promise<Campaign> =>
    campaignsApi.pause(businessId, campaignId),
  archive: (businessId: string, campaignId: string): Promise<Campaign> =>
    campaignsApi.archive(businessId, campaignId),
  addCreative: (businessId: string, campaignId: string, command: CreateCampaignCreativeCommand): Promise<Campaign> =>
    campaignsApi.addCreative(businessId, campaignId, command),
  updateCreativeStatus: (
    businessId: string,
    campaignId: string,
    creativeId: string,
    command: UpdateCampaignCreativeStatusCommand
  ): Promise<Campaign> => campaignsApi.updateCreativeStatus(businessId, campaignId, creativeId, command),
  addExperiment: (businessId: string, campaignId: string, command: CreateCampaignExperimentCommand): Promise<Campaign> =>
    campaignsApi.addExperiment(businessId, campaignId, command),
  promoteExperimentWinner: (
    businessId: string,
    campaignId: string,
    experimentId: string,
    command: PromoteCampaignExperimentWinnerCommand
  ): Promise<Campaign> => campaignsApi.promoteExperimentWinner(businessId, campaignId, experimentId, command),
  saveAudience: (businessId: string, campaignId: string, command: SaveCampaignAudienceCommand): Promise<Campaign> =>
    campaignsApi.saveAudience(businessId, campaignId, command),
  applySavedAudience: (businessId: string, campaignId: string, audienceProfileId: string): Promise<Campaign> =>
    campaignsApi.applySavedAudience(businessId, campaignId, audienceProfileId),
  updateAudienceExclusions: (
    businessId: string,
    campaignId: string,
    command: UpdateCampaignExclusionsCommand
  ): Promise<Campaign> => campaignsApi.updateAudienceExclusions(businessId, campaignId, command),
  forecast: (
    businessId: string,
    campaignId: string,
    command: UpdateCampaignAudienceCommand
  ): Promise<CampaignForecast> => campaignsApi.forecast(businessId, campaignId, command),
  draftForecast: (businessId: string, command: CreateCampaignCommand): Promise<CampaignForecast> =>
    campaignsApi.draftForecast(businessId, command),
};

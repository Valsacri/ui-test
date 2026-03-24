import { campaignsApi } from "@/lib/api/campaigns";
import type {
  Campaign,
  CampaignForecast,
  CampaignListItem,
  CreateCampaignCommand,
  UpdateCampaignAudienceCommand,
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
  forecast: (
    businessId: string,
    campaignId: string,
    command: UpdateCampaignAudienceCommand
  ): Promise<CampaignForecast> => campaignsApi.forecast(businessId, campaignId, command),
  draftForecast: (businessId: string, command: CreateCampaignCommand): Promise<CampaignForecast> =>
    campaignsApi.draftForecast(businessId, command),
};

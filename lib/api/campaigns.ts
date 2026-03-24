import apiClient from "@/lib/api";
import type {
  Campaign,
  CampaignForecast,
  CampaignListItem,
  CreateCampaignCommand,
  UpdateCampaignAudienceCommand,
} from "@/lib/types/campaign";

export const campaignsApi = {
  async list(businessId: string): Promise<CampaignListItem[]> {
    const response = await apiClient.get(`/v1/businesses/${businessId}/campaigns`);
    return response.data;
  },

  async getById(businessId: string, campaignId: string, windowDays?: number): Promise<Campaign> {
    const response = await apiClient.get(`/v1/businesses/${businessId}/campaigns/${campaignId}`, {
      params: windowDays ? { windowDays } : undefined,
    });
    return response.data;
  },

  async create(businessId: string, command: CreateCampaignCommand): Promise<Campaign> {
    const response = await apiClient.post(`/v1/businesses/${businessId}/campaigns`, command);
    return response.data;
  },

  async launch(businessId: string, campaignId: string): Promise<Campaign> {
    const response = await apiClient.post(`/v1/businesses/${businessId}/campaigns/${campaignId}/launch`);
    return response.data;
  },

  async pause(businessId: string, campaignId: string): Promise<Campaign> {
    const response = await apiClient.post(`/v1/businesses/${businessId}/campaigns/${campaignId}/pause`);
    return response.data;
  },

  async archive(businessId: string, campaignId: string): Promise<Campaign> {
    const response = await apiClient.post(`/v1/businesses/${businessId}/campaigns/${campaignId}/archive`);
    return response.data;
  },

  async forecast(
    businessId: string,
    campaignId: string,
    command: UpdateCampaignAudienceCommand
  ): Promise<CampaignForecast> {
    const response = await apiClient.post(
      `/v1/businesses/${businessId}/campaigns/${campaignId}/forecast`,
      command
    );
    return response.data;
  },

  async draftForecast(businessId: string, command: CreateCampaignCommand): Promise<CampaignForecast> {
    const response = await apiClient.post(`/v1/businesses/${businessId}/campaigns/forecast`, command);
    return response.data;
  },
};

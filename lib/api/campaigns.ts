import apiClient from "@/lib/api";
import type {
  Campaign,
  CreateCampaignCreativeCommand,
  CreateCampaignExperimentCommand,
  CampaignForecast,
  CampaignListItem,
  CreateCampaignCommand,
  PromoteCampaignExperimentWinnerCommand,
  SaveCampaignAudienceCommand,
  UpdateCampaignBudgetCommand,
  UpdateCampaignDetailsCommand,
  UpdateCampaignCreativeStatusCommand,
  UpdateCampaignAudienceCommand,
  UpdateCampaignExclusionsCommand,
} from "@/lib/types/campaign";

export type LocationSuggestion = {
  id: string;
  label: string;
};

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

  async updateDetails(businessId: string, campaignId: string, command: UpdateCampaignDetailsCommand): Promise<Campaign> {
    const response = await apiClient.patch(`/v1/businesses/${businessId}/campaigns/${campaignId}/details`, command);
    return response.data;
  },

  async updateBudget(businessId: string, campaignId: string, command: UpdateCampaignBudgetCommand): Promise<Campaign> {
    const response = await apiClient.patch(`/v1/businesses/${businessId}/campaigns/${campaignId}/budget`, command);
    return response.data;
  },

  async updateAudience(businessId: string, campaignId: string, command: UpdateCampaignAudienceCommand): Promise<Campaign> {
    const response = await apiClient.patch(`/v1/businesses/${businessId}/campaigns/${campaignId}/audience`, command);
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

  async addCreative(businessId: string, campaignId: string, command: CreateCampaignCreativeCommand): Promise<Campaign> {
    const response = await apiClient.post(`/v1/businesses/${businessId}/campaigns/${campaignId}/creatives`, command);
    return response.data;
  },

  async updateCreativeStatus(
    businessId: string,
    campaignId: string,
    creativeId: string,
    command: UpdateCampaignCreativeStatusCommand
  ): Promise<Campaign> {
    const response = await apiClient.patch(
      `/v1/businesses/${businessId}/campaigns/${campaignId}/creatives/${creativeId}/status`,
      command
    );
    return response.data;
  },

  async addExperiment(businessId: string, campaignId: string, command: CreateCampaignExperimentCommand): Promise<Campaign> {
    const response = await apiClient.post(`/v1/businesses/${businessId}/campaigns/${campaignId}/experiments`, command);
    return response.data;
  },

  async promoteExperimentWinner(
    businessId: string,
    campaignId: string,
    experimentId: string,
    command: PromoteCampaignExperimentWinnerCommand
  ): Promise<Campaign> {
    const response = await apiClient.patch(
      `/v1/businesses/${businessId}/campaigns/${campaignId}/experiments/${experimentId}/winner`,
      command
    );
    return response.data;
  },

  async saveAudience(businessId: string, campaignId: string, command: SaveCampaignAudienceCommand): Promise<Campaign> {
    const response = await apiClient.post(`/v1/businesses/${businessId}/campaigns/${campaignId}/audience/saved`, command);
    return response.data;
  },

  async applySavedAudience(businessId: string, campaignId: string, audienceProfileId: string): Promise<Campaign> {
    const response = await apiClient.post(
      `/v1/businesses/${businessId}/campaigns/${campaignId}/audience/saved/${audienceProfileId}/apply`
    );
    return response.data;
  },

  async updateAudienceExclusions(
    businessId: string,
    campaignId: string,
    command: UpdateCampaignExclusionsCommand
  ): Promise<Campaign> {
    const response = await apiClient.patch(
      `/v1/businesses/${businessId}/campaigns/${campaignId}/audience/exclusions`,
      command
    );
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

  async locationSuggestions(businessId: string, query: string): Promise<LocationSuggestion[]> {
    const response = await apiClient.get(`/v1/businesses/${businessId}/campaigns/location-suggestions`, {
      params: { query },
    });
    return response.data;
  },
};

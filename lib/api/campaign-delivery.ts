import apiClient from "@/lib/api"
import type { RecordCampaignDeliveryEventCommand, ServedCampaignPlacement, CampaignPlacement } from "@/lib/types/campaign-delivery"

export const campaignDeliveryApi = {
  async serve(placement: CampaignPlacement): Promise<ServedCampaignPlacement | null> {
    const response = await apiClient.get<ServedCampaignPlacement | undefined>(`/v1/campaigns/serve`, {
      params: { placement },
    })
    if (response.status === 204 || response.data == null) {
      return null
    }
    return response.data
  },

  async recordEvent(command: RecordCampaignDeliveryEventCommand): Promise<void> {
    await apiClient.post(`/v1/campaigns/delivery-events`, command)
  },
}


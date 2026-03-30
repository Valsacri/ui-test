import { campaignDeliveryApi } from "@/lib/api/campaign-delivery"
import type { CampaignPlacement, RecordCampaignDeliveryEventCommand, ServedCampaignPlacement } from "@/lib/types/campaign-delivery"

export const campaignDeliveryService = {
  serve(placement: CampaignPlacement): Promise<ServedCampaignPlacement | null> {
    return campaignDeliveryApi.serve(placement)
  },

  recordEvent(command: RecordCampaignDeliveryEventCommand): Promise<void> {
    return campaignDeliveryApi.recordEvent(command)
  },
}


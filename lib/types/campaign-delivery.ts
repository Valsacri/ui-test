export type CampaignPlacement = "HOME_FEED" | "BUSINESS_FEED"

export type CampaignDeliveryEventType = "IMPRESSION" | "CLICK"

export type ServedCampaignPlacement = {
  placement: CampaignPlacement
  campaignId: string
  businessId: string
  creativeId: string
  headline: string
  primaryText: string
  cta: string
}

export type RecordCampaignDeliveryEventCommand = {
  placement: CampaignPlacement
  /** Client-generated idempotency key to dedupe delivery events. */
  eventKey: string
  campaignId: string
  creativeId: string
  type: CampaignDeliveryEventType
}


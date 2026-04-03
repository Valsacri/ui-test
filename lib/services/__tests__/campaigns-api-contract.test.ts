import { beforeEach, describe, expect, it, vi } from "vitest"

const mockGet = vi.fn()
const mockPost = vi.fn()
const mockPatch = vi.fn()

vi.mock("../../api", () => ({
  default: {
    get: (url: string, config?: unknown) => mockGet(url, config),
    post: (url: string, data?: unknown, config?: unknown) => mockPost(url, data, config),
    put: vi.fn(),
    delete: vi.fn(),
    patch: (url: string, data?: unknown, config?: unknown) => mockPatch(url, data, config),
  },
}))

describe("Campaigns service API contracts", () => {
  beforeEach(() => {
    mockGet.mockReset().mockResolvedValue({ data: [] })
    mockPost.mockReset().mockResolvedValue({ data: {} })
    mockPatch.mockReset().mockResolvedValue({ data: {} })
  })

  it("list calls GET /v1/businesses/:businessId/campaigns", async () => {
    const { campaignsService } = await import("../campaigns")
    await campaignsService.list("business-1")
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet.mock.calls[0][0]).toBe("/v1/businesses/business-1/campaigns")
  })

  it("create calls POST /v1/businesses/:businessId/campaigns", async () => {
    const { campaignsService } = await import("../campaigns")
    await campaignsService.create("business-2", {
      name: "Test Campaign",
      objective: "AWARENESS",
      budgetType: "LIFETIME",
      budgetAmount: 1000,
      budgetCurrency: "MAD",
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      location: "Casablanca",
      radiusMiles: 20,
      ageMin: 18,
      ageMax: 40,
      gender: "all",
      sports: ["Running"],
      segmentType: "cold",
      retargetingSources: [],
      lookalikeEnabled: false,
      audienceQualityScore: 50,
      utmSource: "sporgates",
      utmMedium: "paid_placement",
      utmCampaign: "test_campaign",
      utmContent: "hero_card",
      utmTerm: "running",
      primaryConversionEvent: "ACTIVITY_BOOKED",
      attributionModel: "LAST_TOUCH",
    })
    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost.mock.calls[0][0]).toBe("/v1/businesses/business-2/campaigns")
  })

  it("launch/pause/archive call lifecycle endpoints", async () => {
    const { campaignsService } = await import("../campaigns")
    await campaignsService.launch("business-9", "campaign-1")
    await campaignsService.pause("business-9", "campaign-1")
    await campaignsService.archive("business-9", "campaign-1")

    expect(mockPost.mock.calls[0][0]).toBe("/v1/businesses/business-9/campaigns/campaign-1/launch")
    expect(mockPost.mock.calls[1][0]).toBe("/v1/businesses/business-9/campaigns/campaign-1/pause")
    expect(mockPost.mock.calls[2][0]).toBe("/v1/businesses/business-9/campaigns/campaign-1/archive")
  })

  it("creative endpoints call expected URLs", async () => {
    const { campaignsService } = await import("../campaigns")
    await campaignsService.addCreative("business-3", "campaign-2", {
      angle: "Outcome",
      hook: "Grow attendance",
      headline: "Pack your next event",
      primaryText: "Reach nearby athletes and convert faster.",
      cta: "Book Now",
      control: false,
      destinationType: "BUSINESS_PROFILE",
      destinationId: "business-3",
    })
    await campaignsService.updateCreativeStatus("business-3", "campaign-2", "creative-1", { status: "WINNER" })

    expect(mockPost.mock.calls[0][0]).toBe("/v1/businesses/business-3/campaigns/campaign-2/creatives")
    expect(mockPatch.mock.calls[0][0]).toBe("/v1/businesses/business-3/campaigns/campaign-2/creatives/creative-1/status")
  })

  it("experiment endpoints call expected URLs", async () => {
    const { campaignsService } = await import("../campaigns")
    await campaignsService.addExperiment("business-4", "campaign-4", {
      hypothesis: "Variant improves conversion",
      controlCreativeId: "creative-control",
      variantCreativeIds: ["creative-a"],
      minSampleSize: 1000,
      startDate: "2026-03-01",
      endDate: "2026-03-14",
    })
    await campaignsService.promoteExperimentWinner("business-4", "campaign-4", "experiment-1", {
      winnerCreativeId: "creative-a",
    })

    expect(mockPost.mock.calls[0][0]).toBe("/v1/businesses/business-4/campaigns/campaign-4/experiments")
    expect(mockPatch.mock.calls[0][0]).toBe("/v1/businesses/business-4/campaigns/campaign-4/experiments/experiment-1/winner")
  })

  it("audience ops endpoints call expected URLs", async () => {
    const { campaignsService } = await import("../campaigns")
    await campaignsService.saveAudience("business-6", "campaign-6", { name: "Warm segment" })
    await campaignsService.applySavedAudience("business-6", "campaign-6", "audience-1")
    await campaignsService.updateAudienceExclusions("business-6", "campaign-6", {
      excludedAudienceIds: ["recent_bookers_7d"],
    })

    expect(mockPost.mock.calls[0][0]).toBe("/v1/businesses/business-6/campaigns/campaign-6/audience/saved")
    expect(mockPost.mock.calls[1][0]).toBe("/v1/businesses/business-6/campaigns/campaign-6/audience/saved/audience-1/apply")
    expect(mockPatch.mock.calls[0][0]).toBe("/v1/businesses/business-6/campaigns/campaign-6/audience/exclusions")
  })
})

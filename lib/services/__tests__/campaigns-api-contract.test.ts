import { beforeEach, describe, expect, it, vi } from "vitest"

const mockGet = vi.fn()
const mockPost = vi.fn()

vi.mock("../../api", () => ({
  default: {
    get: (url: string, config?: unknown) => mockGet(url, config),
    post: (url: string, data?: unknown, config?: unknown) => mockPost(url, data, config),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}))

describe("Campaigns service API contracts", () => {
  beforeEach(() => {
    mockGet.mockReset().mockResolvedValue({ data: [] })
    mockPost.mockReset().mockResolvedValue({ data: {} })
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
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      location: "Casablanca",
      radiusMiles: 20,
      ageMin: 18,
      ageMax: 40,
      gender: "all",
      sports: ["Running"],
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
})

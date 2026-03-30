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

describe("Campaign delivery API contracts", () => {
  beforeEach(() => {
    mockGet.mockReset()
    mockPost.mockReset()
  })

  it("serve calls GET /v1/campaigns/serve with placement", async () => {
    mockGet.mockResolvedValue({
      status: 200,
      data: {
        placement: "HOME_FEED",
        campaignId: "c1",
        businessId: "b1",
        creativeId: "cr1",
        headline: "H",
        primaryText: "P",
        cta: "Go",
      },
    })
    const { campaignDeliveryService } = await import("../campaign-delivery")
    const result = await campaignDeliveryService.serve("HOME_FEED")
    expect(mockGet).toHaveBeenCalledWith("/v1/campaigns/serve", { params: { placement: "HOME_FEED" } })
    expect(result?.campaignId).toBe("c1")
  })

  it("serve returns null on 204", async () => {
    mockGet.mockResolvedValue({ status: 204, data: undefined })
    const { campaignDeliveryService } = await import("../campaign-delivery")
    const result = await campaignDeliveryService.serve("HOME_FEED")
    expect(result).toBeNull()
  })

  it("recordEvent posts to /v1/campaigns/delivery-events", async () => {
    mockPost.mockResolvedValue({ status: 204 })
    const { campaignDeliveryService } = await import("../campaign-delivery")
    await campaignDeliveryService.recordEvent({
      placement: "HOME_FEED",
      eventKey: "ek1",
      campaignId: "c1",
      creativeId: "cr1",
      type: "CLICK",
    })
    expect(mockPost.mock.calls[0][0]).toBe("/v1/campaigns/delivery-events")
    expect(mockPost.mock.calls[0][1]).toEqual({
      placement: "HOME_FEED",
      eventKey: "ek1",
      campaignId: "c1",
      creativeId: "cr1",
      type: "CLICK",
    })
  })
})

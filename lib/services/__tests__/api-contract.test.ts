import { describe, it, expect, vi, beforeEach } from "vitest"

/**
 * API contract tests (SP-66): assert FE service calls use the paths expected by the backend.
 * Mocks the api client and verifies the URL (and method) for key endpoints.
 */
const mockGet = vi.fn()
const mockPost = vi.fn()
const mockPut = vi.fn()
const mockDelete = vi.fn()

vi.mock("../../api", () => ({
  default: {
    get: (url: string, config?: unknown) => mockGet(url, config),
    post: (url: string, data?: unknown, config?: unknown) => mockPost(url, data, config),
    put: (url: string, data?: unknown, config?: unknown) => mockPut(url, data, config),
    delete: (url: string, config?: unknown) => mockDelete(url, config),
    patch: vi.fn(),
  },
}))

describe("API contract: user service paths", () => {
  beforeEach(() => {
    mockGet.mockReset().mockResolvedValue({ data: null })
    mockPost.mockReset().mockResolvedValue({ data: null })
    mockPut.mockReset().mockResolvedValue({ data: null })
    mockDelete.mockReset().mockResolvedValue(undefined)
  })

  it("getPaymentMethods calls GET /v1/users/:userId/payment-methods", async () => {
    const { userService } = await import("../user")
    mockGet.mockResolvedValue({ data: [] })
    await userService.getPaymentMethods("user-123")
    expect(mockGet).toHaveBeenCalledTimes(1)
    expect(mockGet.mock.calls[0][0]).toBe("/v1/users/user-123/payment-methods")
  })

  it("addPaymentMethod calls POST /v1/users/:userId/payment-methods", async () => {
    const { userService } = await import("../user")
    const body = {
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: false,
    }
    await userService.addPaymentMethod("user-1", body)
    expect(mockPost).toHaveBeenCalledTimes(1)
    expect(mockPost.mock.calls[0][0]).toBe("/v1/users/user-1/payment-methods")
    expect(mockPost.mock.calls[0][1]).toEqual(body)
  })

  it("setDefaultPaymentMethod calls PUT /v1/users/:userId/payment-methods/:methodId/default", async () => {
    const { userService } = await import("../user")
    mockPut.mockResolvedValue({ data: { id: "pm1", isDefault: true } })
    await userService.setDefaultPaymentMethod("user-1", "pm-99")
    expect(mockPut).toHaveBeenCalledTimes(1)
    expect(mockPut.mock.calls[0][0]).toBe("/v1/users/user-1/payment-methods/pm-99/default")
  })

  it("deletePaymentMethod calls DELETE /v1/users/:userId/payment-methods/:methodId", async () => {
    const { userService } = await import("../user")
    await userService.deletePaymentMethod("user-1", "pm-42")
    expect(mockDelete).toHaveBeenCalledTimes(1)
    expect(mockDelete.mock.calls[0][0]).toBe("/v1/users/user-1/payment-methods/pm-42")
  })
})

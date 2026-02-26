import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { SettingsPaymentPage } from "../settings-payment-page"

const { mockGetCurrentUser, mockUseSWR } = vi.hoisted(() => ({
  mockGetCurrentUser: vi.fn(),
  mockUseSWR: vi.fn(),
}))

vi.mock("@/lib/services", () => ({
  authService: {
    getCurrentUser: () => mockGetCurrentUser(),
  },
  userService: {
    getPaymentMethods: vi.fn().mockResolvedValue([]),
    deletePaymentMethod: vi.fn().mockResolvedValue(undefined),
    setDefaultPaymentMethod: vi.fn().mockResolvedValue(undefined),
  },
}))

vi.mock("swr", () => ({
  default: (_key: string, _fetcher: () => Promise<unknown>) => mockUseSWR(),
}))

const mockOnBack = vi.fn()

describe("SettingsPaymentPage", () => {
  beforeEach(() => {
    mockOnBack.mockClear()
    mockGetCurrentUser.mockReturnValue(null)
    mockUseSWR.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    })
  })

  it("renders back button", () => {
    render(<SettingsPaymentPage onBack={mockOnBack} />)
    expect(screen.getByRole("button", { name: /back to settings/i })).toBeInTheDocument()
  })

  it("shows sign in message when no user", () => {
    render(<SettingsPaymentPage onBack={mockOnBack} />)
    expect(screen.getByText(/sign in to manage payment methods/i)).toBeInTheDocument()
  })

  it("shows Add Card button, title and empty state when user is set and no methods", () => {
    mockGetCurrentUser.mockReturnValue({ id: "user1" })
    mockUseSWR.mockReturnValue({
      data: [],
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    })
    render(<SettingsPaymentPage onBack={mockOnBack} />)
    expect(screen.getByRole("heading", { name: /payment methods/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /add card/i })).toBeInTheDocument()
    expect(screen.getByText(/no payment methods saved/i)).toBeInTheDocument()
  })

  it("renders payment method card when data is returned", () => {
    mockGetCurrentUser.mockReturnValue({ id: "user1" })
    mockUseSWR.mockReturnValue({
      data: [
        {
          id: "pm1",
          userId: "user1",
          type: "card",
          last4: "4242",
          brand: "Visa",
          expiryMonth: 12,
          expiryYear: 2026,
          isDefault: true,
        },
      ],
      error: null,
      isLoading: false,
      mutate: vi.fn(),
    })
    render(<SettingsPaymentPage onBack={mockOnBack} />)
    expect(screen.getByText(/4242/)).toBeInTheDocument()
    expect(screen.getByText(/visa/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument()
  })
})

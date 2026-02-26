import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import { AuthPages } from "../auth-pages"

vi.mock("@/lib/services", () => ({
  authService: {
    login: vi.fn().mockResolvedValue({ user: {}, token: "token" }),
    verifyEmail: vi.fn().mockResolvedValue(undefined),
  },
}))

vi.mock("@/lib/services/user", () => ({
  userService: {
    getCurrentUser: vi.fn().mockResolvedValue(null),
  },
}))

vi.mock("@/lib/services/sport", () => ({
  sportService: {
    getAll: vi.fn().mockResolvedValue([]),
  },
}))

const mockOnNavigate = vi.fn()

describe("AuthPages", () => {
  beforeEach(() => {
    mockOnNavigate.mockClear()
  })

  it("renders sign-in page with heading and form", () => {
    render(<AuthPages page="signin" onNavigate={mockOnNavigate} />)

    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
  })

  it("renders forgot password link on sign-in page", () => {
    render(<AuthPages page="signin" onNavigate={mockOnNavigate} />)
    expect(screen.getByRole("button", { name: /forgot password/i })).toBeInTheDocument()
  })

  it("renders sign-up page with heading and form", () => {
    render(<AuthPages page="signup" onNavigate={mockOnNavigate} />)

    expect(screen.getByRole("heading", { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument()
    expect(screen.getAllByPlaceholderText(/password/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument()
  })

  it("renders forgot-password page with email field and submit", () => {
    render(<AuthPages page="forgot-password" onNavigate={mockOnNavigate} />)

    expect(screen.getByRole("heading", { name: /reset password/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument()
  })

  it("renders reset-password page with heading and form", () => {
    render(<AuthPages page="reset-password" onNavigate={mockOnNavigate} />)

    expect(screen.getByRole("heading", { name: /set new password/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/new password/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /save password/i })).toBeInTheDocument()
  })

  it("renders verify-email page with heading and verify button", () => {
    render(<AuthPages page="verify-email" onNavigate={mockOnNavigate} />)

    expect(screen.getByRole("heading", { name: /verify your email/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /verify email/i })).toBeInTheDocument()
  })

  it("renders choose-sports onboarding page", async () => {
    render(<AuthPages page="choose-sports" onNavigate={mockOnNavigate} />)

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /what sports interest you\?/i })).toBeInTheDocument()
    })
    expect(screen.getByText(/step 1 of 2/i)).toBeInTheDocument()
  })

  it("renders set-goals onboarding page", () => {
    render(<AuthPages page="set-goals" onNavigate={mockOnNavigate} />)

    expect(screen.getByRole("heading", { name: /what are your goals\?/i })).toBeInTheDocument()
    expect(screen.getByText(/step 2 of 2/i)).toBeInTheDocument()
  })

  it("renders onboarding-confirmation page", () => {
    render(<AuthPages page="onboarding-confirmation" onNavigate={mockOnNavigate} />)

    expect(screen.getByRole("heading", { name: /you're all set/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /go to home/i })).toBeInTheDocument()
  })
})

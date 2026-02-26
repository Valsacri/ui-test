import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import AuthError from "../error"

describe("AuthError (auth layout error boundary)", () => {
  it("renders Authentication Error and Try Again button", () => {
    const reset = vi.fn()
    render(<AuthError error={new Error("Auth fail")} reset={reset} />)
    expect(screen.getByRole("heading", { name: /authentication error/i })).toBeInTheDocument()
    expect(screen.getByText(/something went wrong during authentication/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
  })

  it("calls reset when Try Again is clicked", () => {
    const reset = vi.fn()
    render(<AuthError error={new Error("Test")} reset={reset} />)
    fireEvent.click(screen.getByRole("button", { name: /try again/i }))
    expect(reset).toHaveBeenCalledTimes(1)
  })
})

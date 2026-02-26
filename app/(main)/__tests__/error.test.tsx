import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import MainError from "../error"

describe("MainError (main layout error boundary)", () => {
  it("renders error message and Try Again button", () => {
    const reset = vi.fn()
    render(<MainError error={new Error("Test error")} reset={reset} />)

    expect(screen.getByRole("heading", { name: /something went wrong/i })).toBeInTheDocument()
    expect(screen.getByText(/unexpected error occurred/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
  })

  it("calls reset when Try Again is clicked", () => {
    const reset = vi.fn()
    render(<MainError error={new Error("Test")} reset={reset} />)

    fireEvent.click(screen.getByRole("button", { name: /try again/i }))

    expect(reset).toHaveBeenCalledTimes(1)
  })
})

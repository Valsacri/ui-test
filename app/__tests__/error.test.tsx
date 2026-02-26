import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import GlobalError from "../error"

describe("GlobalError (root error boundary)", () => {
  it("renders error message and Try Again button", () => {
    const reset = vi.fn()
    render(<GlobalError error={new Error("Global fail")} reset={reset} />)
    expect(screen.getByRole("heading", { name: /something went wrong/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
  })

  it("calls reset when Try Again is clicked", () => {
    const reset = vi.fn()
    render(<GlobalError error={new Error("Test")} reset={reset} />)
    fireEvent.click(screen.getByRole("button", { name: /try again/i }))
    expect(reset).toHaveBeenCalledTimes(1)
  })
})

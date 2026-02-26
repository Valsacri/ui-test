import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import NotFound from "../not-found"

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe("NotFound", () => {
  it("renders 404 and Page Not Found", () => {
    render(<NotFound />)
    expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument()
    expect(screen.getByText(/page not found/i)).toBeInTheDocument()
  })

  it("renders Go Home link", () => {
    render(<NotFound />)
    const link = screen.getByRole("link", { name: /go home/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/")
  })
})

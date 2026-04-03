import { describe, it, expect } from "vitest"
import { getPostOnboardingPageRoute } from "@/lib/post-onboarding-destination"

describe("getPostOnboardingPageRoute", () => {
  it("prefers BUSINESS over PLAYER when both selected", () => {
    expect(getPostOnboardingPageRoute(["PLAYER", "BUSINESS"])).toBe("business-onboarding")
  })

  it("routes SPONSOR to business onboarding", () => {
    expect(getPostOnboardingPageRoute(["SPONSOR"])).toBe("business-onboarding")
  })

  it("routes ORGANIZER to create activity", () => {
    expect(getPostOnboardingPageRoute(["ORGANIZER"])).toBe("create-activity")
  })

  it("routes COACH to profile enhanced", () => {
    expect(getPostOnboardingPageRoute(["COACH"])).toBe("profile-enhanced")
  })

  it("defaults to home when empty", () => {
    expect(getPostOnboardingPageRoute([])).toBe("home")
  })
})

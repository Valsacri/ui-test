import type { PageRoute } from "@/lib/navigation"

/**
 * First matching role wins. Each route is a sensible “first setup” step for that persona.
 * Align with PARTICIPANT_ROLES ids in auth onboarding.
 */
const ROLE_TO_ROUTE: ReadonlyArray<{ role: string; route: PageRoute }> = [
  { role: "BUSINESS", route: "business-onboarding" },
  /** Brands need a business profile before campaigns / partnerships. */
  { role: "SPONSOR", route: "business-onboarding" },
  /** First organized event (can refine in business flow later). */
  { role: "ORGANIZER", route: "create-activity" },
  /** Complete coach-facing profile. */
  { role: "COACH", route: "profile-enhanced" },
  { role: "PLAYER", route: "home" },
  { role: "FAN", route: "explore" },
]

export function getPostOnboardingPageRoute(participantRoles: string[]): PageRoute {
  if (!participantRoles?.length) return "home"
  const upper = new Set(participantRoles.map((r) => r.toUpperCase()))
  for (const { role, route } of ROLE_TO_ROUTE) {
    if (upper.has(role)) return route
  }
  return "home"
}

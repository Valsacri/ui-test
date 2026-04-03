import { test, expect } from "@playwright/test"

const appOrigin = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000"

const mockForecast = {
  potentialAudience: 10_000,
  estimatedReach: 5_000,
  estimatedAttendees: 100,
  estimatedEvents: 0,
  dailyBudget: 40,
  costPerEngagement: 1,
  audienceDensity: "medium",
  significantEditLikelyToResetLearning: false,
}

const mockListCampaign = {
  id: "camp-ready-1",
  name: "E2E Ready Campaign",
  objective: "ACTIVITY_BOOKINGS",
  status: "READY",
  budgetAmount: 1000,
  spent: 0,
  reach: 0,
  conversions: 0,
  startDate: "2026-01-01",
  endDate: "2026-02-01",
}

const mockCampaignDetail = {
  id: "camp-ready-1",
  businessId: "e2e-biz-1",
  name: "E2E Ready Campaign",
  objective: "ACTIVITY_BOOKINGS",
  status: "READY",
  budgetType: "LIFETIME",
  budgetAmount: 1000,
  budgetCurrency: "USD",
  startDate: "2026-01-01",
  endDate: "2026-01-31",
  significantEditCount: 0,
  audience: {
    location: "Casablanca",
    radiusMiles: 20,
    ageMin: 18,
    ageMax: 45,
    gender: "all",
    sports: ["Running"],
    segmentType: "cold",
    retargetingSources: [] as string[],
    lookalikeEnabled: false,
    audienceQualityScore: 50,
  },
  performance: {
    totalSpend: 0,
    totalReach: 0,
    totalConversions: 0,
    conversionRate: 0,
    costPerConversion: 0,
    health: "PENDING_DATA",
  },
}

test.describe("Marketing campaigns (in-app)", () => {
  test("business campaigns redirects unauthenticated user to sign-in", async ({ page }) => {
    await page.goto("/business/campaigns")
    await expect(page).toHaveURL(/\/signin/)
  })

  test("dashboard lists campaigns and opens create / edit modals (mocked API)", async ({ page, context }) => {
    const cookieUrl = new URL(appOrigin)
    await context.addCookies([
      {
        name: "auth_logged_in",
        value: "1",
        domain: cookieUrl.hostname,
        path: "/",
      },
    ])
    await context.addInitScript(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "e2e-user",
          email: "e2e@test.local",
          firstName: "E2E",
          lastName: "User",
        })
      )
      localStorage.setItem("activeBusinessId", "e2e-biz-1")
      localStorage.setItem("sporgates.campaignsDashboardTour.v1", "1")
    })

    await page.route("**/v1/businesses/my", async (route) => {
      if (route.request().method() !== "GET") {
        await route.continue()
        return
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "e2e-biz-1",
            name: "E2E Business",
            bio: "Test",
            city: "Casablanca",
            rating: 0,
            followers: 0,
          },
        ]),
      })
    })

    await page.route("**/v1/businesses/e2e-biz-1/campaigns/location-suggestions**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ id: "loc-1", label: "Casablanca, Morocco" }]),
      })
    })

    await page.route("**/v1/businesses/e2e-biz-1/campaigns/camp-ready-1**", async (route) => {
      if (route.request().method() !== "GET") {
        await route.continue()
        return
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockCampaignDetail),
      })
    })

    await page.route("**/v1/businesses/e2e-biz-1/campaigns/forecast", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue()
        return
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockForecast),
      })
    })

    await page.route("**/v1/businesses/e2e-biz-1/campaigns", async (route) => {
      if (route.request().method() !== "GET") {
        await route.continue()
        return
      }
      const url = route.request().url()
      if (url.includes("/campaigns/camp-ready-1") || url.includes("/campaigns/forecast")) {
        await route.continue()
        return
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([mockListCampaign]),
      })
    })

    await page.goto("/business/campaigns")

    await expect(page.getByRole("heading", { name: "Campaigns", exact: true })).toBeVisible()
    await expect(page.getByText("E2E Ready Campaign")).toBeVisible()

    await page.getByRole("button", { name: /new campaign/i }).click()
    await expect(page.locator(".gradient-primary").getByText("Create Campaign")).toBeVisible()
    await page.keyboard.press("Escape")

    await page.getByRole("button", { name: /^edit campaign$/i }).click()
    await expect(page.locator(".gradient-primary").getByText("Edit Campaign")).toBeVisible()
    await expect(page.getByText(/Update campaign settings before launch/i)).toBeVisible()
  })
})

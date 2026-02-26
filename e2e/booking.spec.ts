import { test, expect } from "@playwright/test"

test.describe("Booking flow entry (SP-61)", () => {
  test("facilities redirects unauthenticated user to sign-in", async ({ page }) => {
    await page.goto("/facilities")
    await expect(page).toHaveURL(/\/signin/)
  })

  test("activities redirects unauthenticated user to sign-in", async ({ page }) => {
    await page.goto("/activities")
    await expect(page).toHaveURL(/\/signin/)
  })

  test("facility detail redirects unauthenticated user to sign-in", async ({ page }) => {
    await page.goto("/facilities/some-id")
    await expect(page).toHaveURL(/\/signin/)
  })
})

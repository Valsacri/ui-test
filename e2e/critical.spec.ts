import { test, expect } from "@playwright/test"

test.describe("Critical flows (SP-65)", () => {
  test("home redirects unauthenticated user to sign-in", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/signin/)
    await expect(page).toHaveTitle(/Sporgates/i)
  })

  test("explore redirects unauthenticated user to sign-in", async ({ page }) => {
    await page.goto("/explore")
    await expect(page).toHaveURL(/\/signin/)
    await expect(page.getByPlaceholder(/email address/i)).toBeVisible()
  })
})

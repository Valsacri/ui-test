import { test, expect } from "@playwright/test"

test.describe("Auth flow (SP-60)", () => {
  test("sign-in page loads and shows sign-in form", async ({ page }) => {
    await page.goto("/signin")
    await expect(page).toHaveURL(/\/signin/)
    await expect(page.getByPlaceholder(/email address/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i).first()).toBeVisible()
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible()
  })

  test("sign-in page has button to go to sign up", async ({ page }) => {
    await page.goto("/signin")
    await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible()
  })

  test("sign-up page loads and shows registration form", async ({ page }) => {
    await page.goto("/signup")
    await expect(page).toHaveURL(/\/signup/)
    await expect(page.getByPlaceholder(/email address/i)).toBeVisible()
    await expect(page.getByPlaceholder(/password/i).first()).toBeVisible()
    await expect(page.getByPlaceholder(/confirm password/i)).toBeVisible()
  })
})

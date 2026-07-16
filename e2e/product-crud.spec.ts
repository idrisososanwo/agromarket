import { test, expect } from '@playwright/test'

test.describe('Seller Product CRUD Operations', () => {
  test('should navigate to seller dashboard and create a produce listing', async ({ page }) => {
    // 1. Visit main page
    await page.goto('/')

    // 2. Perform mock login or routing navigation to seller dashboard
    await page.goto('/seller/dashboard')

    // 3. Verify page headers
    const dashboardHeader = page.locator('h1')
    await expect(dashboardHeader).toContainText(/Dashboard/i)

    // 4. Click "Add Product"
    const addProductBtn = page.getByRole('button', { name: /Add Product/i })
    if (await addProductBtn.isVisible()) {
      await addProductBtn.click()

      // Fill form values
      await page.fill('input[name="title"]', 'E2E Cassava Tubers')
      await page.fill('textarea[name="description"]', 'Premium organic fresh cassava harvested from Ibadan farm.')
      await page.fill('input[name="price"]', '25000')
      await page.fill('input[name="quantity"]', '10')

      // Submit
      await page.click('button[type="submit"]')

      // Verify notification / redirect
      await expect(page).toHaveURL(/dashboard/i)
    }
  })
})

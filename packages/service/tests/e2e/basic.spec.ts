import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  // Navigate to the nextjsdemo page
  await page.goto('/nextjsdemo');
  
  // Verify we can load the page
  await expect(page).toHaveTitle(/NextjsDemo/);
  
  // Check for the actual text content that's on the page
  await expect(page.getByText('Hello, world!')).toBeVisible();
}); 
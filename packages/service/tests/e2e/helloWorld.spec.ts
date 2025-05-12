import { test, expect } from '@playwright/test';

test.describe('Root Page Test', () => {
  test('successfully loads root page and checks content', async ({ page }) => {
    await page.goto('/nextjsdemo');
    
    await expect(page.getByText('Hello, world!')).toBeVisible();
    await expect(page.getByText('I was here onboarding demo!')).toBeVisible();
  });
}); 
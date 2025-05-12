import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Use PLAYWRIGHT_BASE_URL for CI environments, fallback to localhost for local development
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${process.env.PORT || '9548'}`;

// Log the configuration for debugging
console.log('Playwright Configuration:');
console.log('Base URL:', baseURL);
console.log('Protection Bypass Secret:', process.env.VERCEL_PROTECTION_BYPASS ? 'Available' : 'Not Available');

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['**/*.spec.ts'],
  use: {
    // Run in headless mode
    headless: true,
    // Append /nextjsdemo to the base URL if it's not already included
    baseURL: baseURL.endsWith('/nextjsdemo') ? baseURL : `${baseURL}/nextjsdemo`,
    // Add protection bypass header to all requests
    extraHTTPHeaders: process.env.VERCEL_PROTECTION_BYPASS ? {
      'x-vercel-protection-bypass': process.env.VERCEL_PROTECTION_BYPASS
    } : undefined,
    // Add screenshot on failure
    screenshot: 'only-on-failure',
    // Enable tracing
    trace: 'retain-on-failure',
    // Increase timeouts for network conditions
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },
  workers: 1,
  // Enable automatic retries
  retries: 2,
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Add additional context options
        contextOptions: {
          ignoreHTTPSErrors: true,
        }
      },
    }
  ],
  timeout: 30000,
  expect: {
    timeout: 10000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'playwright-results.xml' }]
  ],
}); 
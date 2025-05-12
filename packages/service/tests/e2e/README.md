# Playwright - E2E Tests

## Description

We use [Playwright](https://playwright.dev/docs/intro) for our end-to-end tests. The tooling includes TypeScript and built-in test assertions that follow modern testing best practices. Playwright provides native support for multiple browsers (Chromium, Firefox, and WebKit) and offers powerful features like network interception, mobile device emulation, and parallel test execution.

## Setup

Run `pnpm install` to install dependencies. Playwright's browsers will be installed automatically during the installation process.

## Run Locally

1. Configure which environment you want tests to run in. For local development:
   - Run the Next.js backend with `pnpm dev`
   - The tests will automatically use the correct port (9548)

2. From the service directory, you have several options to run tests:
   - `pnpm test:e2e` - Run tests headlessly
   - `pnpm test:e2e:ui` - Open Playwright's UI mode for interactive testing
   - `pnpm test:e2e:debug` - Run tests in debug mode with step-by-step execution

### Playwright UI Mode

When you start the test runner with `pnpm test:e2e:ui`, Playwright opens its UI mode which provides:

1. Interactive test selection and execution
2. Real-time test results and reporting
3. Time-travel debugging with step-by-step replay
4. Network request inspection
5. Console logs and error messages
6. Screenshot and video recording viewer

Your workflow can be:

1. Start the UI mode
2. Select tests to run
3. Watch test execution in real-time
4. Make changes to test files
5. Click "Run" to execute updated tests
6. Use time-travel debugging when tests fail

## Authentication and Vercel Protection

For deployments protected by Vercel, we use the `VERCEL_PROTECTION_BYPASS` environment variable. This is automatically handled in the Playwright configuration, which adds the protection bypass header to all requests when the variable is present.

## Running in CI

In CI:

1. We use `wait-for-vercel` to get the preview deployment URL
2. The URL is passed to Playwright via the `PLAYWRIGHT_BASE_URL` environment variable
3. Tests run headlessly using `xvfb-run` for X11 support
4. Debug logs are enabled with `DEBUG=pw:api,pw:browser*`
5. Test artifacts (reports, screenshots, traces) are saved as CI artifacts

The configuration in `.gitlab-ci.yml` handles:
- Setting up the environment with required dependencies
- Installing Playwright and its browsers
- Running tests with the correct configuration
- Collecting and storing test results

## Test Reports

Playwright generates several types of test artifacts:

1. HTML report (`playwright-report/index.html`)
2. JUnit XML report (`playwright-results.xml`)
3. Test traces for debugging (`test-results/`)
4. Screenshots on failure

These artifacts are automatically collected in CI and can be accessed from the GitLab pipeline interface.

## Best Practices

1. Use Playwright's built-in assertions and locators
2. Leverage test isolation with `test.describe` and `test.beforeEach`
3. Use `page.waitForSelector` instead of arbitrary timeouts
4. Take advantage of automatic waiting for elements
5. Use trace viewer for debugging failed tests
6. Keep tests independent and avoid dependencies between tests 
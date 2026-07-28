import { test as base } from './testFixtures';

/**
 * Extended Fixtures for Network Interception, Payload Injection, and API Mocking
 */
type MockFixtures = {
  /**
   * Mocks the GET /contacts endpoint with a custom response body and status code.
   * Useful for testing empty states, edge cases, or large lists without touching the real DB.
   */
  mockContactList: (mockData: Array<Record<string, unknown>>, statusCode?: number) => Promise<void>;

  /**
   * Intercepts POST/PUT requests and injects modified request bodies (API Injection).
   */
  injectRequestPayload: (urlPattern: RegExp | string, overridePayload: Record<string, unknown>) => Promise<void>;

  /**
   * Simulates server-side failures (e.g., HTTP 500 Internal Server Error, 503 Service Unavailable).
   * Verifies UI graceful degradation and error boundary handling.
   */
  mockServerError: (urlPattern: RegExp | string, statusCode?: number) => Promise<void>;
};

export const test = base.extend<MockFixtures>({
  mockContactList: async ({ page }, use) => {
    await use(async (mockData, statusCode = 200) => {
      // Intercept GET requests matching the contacts API endpoint
      await page.route('**/contacts', async (route) => {
        if (route.request().method() === 'GET') {
          await route.fulfill({
            status: statusCode,
            contentType: 'application/json',
            body: JSON.stringify(mockData),
          });
        } else {
          await route.continue();
        }
      });
    });
  },

  injectRequestPayload: async ({ page }, use) => {
    await use(async (urlPattern, overridePayload) => {
      // Intercept outgoing HTTP traffic and modify payload before hitting the server
      await page.route(urlPattern, async (route) => {
        const request = route.request();
        if (['POST', 'PUT', 'PATCH'].includes(request.method())) {
          await route.continue({
            postData: JSON.stringify(overridePayload),
          });
        } else {
          await route.continue();
        }
      });
    });
  },

  })

export { expect } from '@playwright/test';
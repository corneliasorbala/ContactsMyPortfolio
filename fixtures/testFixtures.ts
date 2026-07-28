import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { StandardLoginPage } from '../pages/StandardLoginPage';
import { AddUserPage } from '../pages/AddUserPage';
import { ContactListPage } from '../pages/ContactListPage';
import { UserApiClient } from '../api/UserApiClient';
import { ContactApiClient } from '../api/ContactApiClient';
import { TestDataGenerator } from '../utils/TestDataGenerator';

/**
 * Consolidated Application Fixtures
 * Combines Page Object Models, API Clients, and Automated State-Seeding Fixtures.
 */
type AppFixtures = {
  // Page Objects
  loginPage: LoginPage;
  addUserPage: AddUserPage;
  contactListPage: ContactListPage;

  // API Clients
  userApi: UserApiClient;
  contactApi: ContactApiClient;

  // Hybrid Seeding Fixture: Registers a fresh user via API before running tests
  authedUser: {
    token: string;
    email: string;
    password: string;
    user: ReturnType<typeof TestDataGenerator.generateUser>;
  };
};

export const test = base.extend<AppFixtures>({
  // =========================================================================
  // 1. PAGE OBJECT FIXTURES
  // =========================================================================

  loginPage: async ({ page }, use) => {
    await use(new StandardLoginPage(page));
  },

  addUserPage: async ({ page }, use) => {
    await use(new AddUserPage(page));
  },

  contactListPage: async ({ page }, use) => {
    await use(new ContactListPage(page));
  },

  // =========================================================================
  // 2. API CLIENT FIXTURES
  // =========================================================================

  userApi: async ({ request }, use) => {
    await use(new UserApiClient(request));
  },

  contactApi: async ({ request }, use) => {
    await use(new ContactApiClient(request));
  },

  // =========================================================================
  // 3. AUTOMATED HYBRID SEEDING FIXTURE
  // =========================================================================

  authedUser: async ({ userApi }, use) => {
    // Generate dynamic user details
    const user = TestDataGenerator.generateUser();

    // Register user via UserApiClient to avoid duplicating endpoint URLs
    const createRes = await userApi.addUser(user);
    const body = await createRes.json();

    // Pass token, credentials, and user object to test blocks
    await use({
      token: body.token,
      email: user.email,
      password: user.password,
      user,
    });
  },
});

export { expect } from '@playwright/test';
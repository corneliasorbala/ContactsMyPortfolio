import { test, expect } from '../../fixtures/testFixtures';
import { TestDataGenerator } from '../../utils/TestDataGenerator';

/**
 * Expected error and status messages from the application.
 */
const INVALID_CREDENTIALS_ERROR = 'Incorrect username or password';

/**
 * Test vectors for negative and edge-case inputs.
 */
const TEST_VECTORS = {
  longString: 'a'.repeat(255) + '@example.com',
  spacesOnly: '   ',
};

/**
 * Comprehensive Login Flow Test Suite
 * 
 * Validates functional correctness, form validation, security boundary resilience,
 * and session state handling for the Login screen.
 */
test.describe('Login Flow Suite', () => {

  /**
   * Setup: Navigate to the login page before every test execution.
   */
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.navigate();
  });

  test('Successful login with valid credentials using API-seeded user', async ({ page, loginPage, contactListPage, userApi }) => {
    // 1. Seed user via API to guarantee test state isolation
    const user = TestDataGenerator.generateUser();
    const apiRes = await userApi.addUser(user);
    expect(apiRes.status()).toBe(201);

    // 2. Perform UI login
    await loginPage.login(user.email, user.password);

    // 3. Verify landing page redirection and key UI elements
    await expect(page).toHaveURL(/.*\/contactList/);
    await expect(contactListPage.headerTitle).toHaveText('Contact List');
    await expect(contactListPage.logoutButton).toBeVisible();
  });

  test('User can logout successfully', async ({ page, loginPage, contactListPage, userApi }) => {
    const user = TestDataGenerator.generateUser();
    await userApi.addUser(user);

    await loginPage.login(user.email, user.password);
    await expect(contactListPage.headerTitle).toHaveText('Contact List');
    await contactListPage.logout();
    await expect(page).toHaveURL(/.*\/($|login)/);
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('Form can be submitted via Enter keyboard key', async ({ page, loginPage, contactListPage, userApi }) => {
    const user = TestDataGenerator.generateUser();
    await userApi.addUser(user);

    await loginPage.emailInputField.fill(user.email);
    await loginPage.passwordInputField.fill(user.password);
    
    await loginPage.passwordInputField.press('Enter');

    await expect(contactListPage.headerTitle).toHaveText('Contact List');
  });

  test('Show error on invalid credentials', async ({ loginPage }) => {
    await loginPage.login('invalid_user@example.com', 'WrongPassword123!');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(INVALID_CREDENTIALS_ERROR);
  });

  test('Validation: empty email and empty password', async ({ loginPage }) => {
    await loginPage.submitButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(INVALID_CREDENTIALS_ERROR);
  });

  test('Validation: empty email with filled password', async ({ loginPage }) => {
    await loginPage.passwordInputField.fill('Password123!');
    await loginPage.submitButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(INVALID_CREDENTIALS_ERROR);
  });

  test('Validation: filled email with empty password', async ({ loginPage }) => {
    await loginPage.emailInputField.fill('valid@example.com');
    await loginPage.submitButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(INVALID_CREDENTIALS_ERROR);
  });

  test('Validation: invalid email syntax (missing @ symbol)', async ({ loginPage }) => {
    await loginPage.login('invalidemail.com', 'Password123!');

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(INVALID_CREDENTIALS_ERROR);
  });

  test('Validation: spaces only in credentials', async ({ loginPage }) => {
    await loginPage.login(TEST_VECTORS.spacesOnly, TEST_VECTORS.spacesOnly);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toHaveText(INVALID_CREDENTIALS_ERROR);
  });

  test('Case sensitivity: email is case-insensitive, login succeeds with UPPERCASE email', async ({ loginPage, contactListPage, userApi }) => {
    const user = TestDataGenerator.generateUser();
    await userApi.addUser(user);

    // Try logging in with capitalized email variant
    await loginPage.login(user.email.toUpperCase(), user.password);
    await expect(contactListPage.headerTitle).toHaveText('Contact List');
  });

  test('Password input field masks characters securely', async ({ loginPage }) => {
    await expect(loginPage.passwordInputField).toHaveAttribute('type', 'password');
  });

  test('Navigation: Clicking Sign Up button redirects to Add User page', async ({ page, loginPage }) => {
    await loginPage.signUpButton.click();
    await expect(page).toHaveTitle('Add User');
  });

});
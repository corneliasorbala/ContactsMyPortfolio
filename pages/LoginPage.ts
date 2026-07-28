import { Page, Locator } from '@playwright/test';

/**
 * Serves as the base Page Object.
 */
export abstract class LoginPage {
  readonly page: Page;
  readonly emailInputField: Locator;
  readonly passwordInputField: Locator;
  readonly submitButton: Locator;
  readonly signUpButton: Locator;
  readonly errorMessage: Locator;

  /**
   * Initializes page locators using accessible and stable selection strategies.
   * param page - Playwright Page object representing the browser tab context.
   */
  constructor(page: Page) {
    this.page = page;

    // Playwright Best Practice: Prefer user-facing locators (getByPlaceholder, getByRole)
    this.emailInputField = page.getByPlaceholder('Email');
    this.passwordInputField = page.getByPlaceholder('Password');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.signUpButton = page.getByRole('button', { name: 'Sign up' });

    // CSS selector fallback for dynamic alert/error elements
    this.errorMessage = page.locator('#error');
  }

  /**
   * Navigates directly to the login route.
   */
  async navigate(): Promise<void> {
    await this.page.goto('/login');
  }

  /**
   * Default implementation for performing user authentication.
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInputField.fill(email);
    await this.passwordInputField.fill(password);
    await this.submitButton.click();
  }
}
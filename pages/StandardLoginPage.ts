// src/pages/StandardLoginPage.ts
import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';

/**
 * Implements the concrete UI user interactions for the standard login flow.
 */
export class StandardLoginPage extends LoginPage {
  /**
   * Initializes page elements via the base `LoginPage` class.
   * param page - Playwright Page object representing the browser tab context.
   */
  constructor(page: Page) {
    super(page);
  }

  /**
   * Performs the standard user login action sequence.
   * 
   * Fills in user credentials and submits the login form. Using locators directly
   * within the parent class ensures consistent locator reuse across test runs.
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInputField.fill(email);
    await this.passwordInputField.fill(password);
    await this.submitButton.click();
  }
}
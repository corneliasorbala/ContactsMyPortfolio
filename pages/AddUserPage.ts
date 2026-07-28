import { Locator, Page } from '@playwright/test';
import { LoginPage } from './LoginPage';


export class AddUserPage {
  readonly page: Page
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
 
  // Page object model for the sign-up form
  constructor(page: Page) {
    // Save the Playwright page instance for later use
    this.page = page
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.errorMessage = page.locator("#error");
  }

 /**
   * Fills out the registration form fields.
   */
  async fillForm(userData: { firstName?: string; lastName?: string; email?: string; password?: string }): Promise<void> {
    if (userData.firstName !== undefined) await this.firstNameInput.fill(userData.firstName);
    if (userData.lastName !== undefined) await this.lastNameInput.fill(userData.lastName);
    if (userData.email !== undefined) await this.emailInput.fill(userData.email);
    if (userData.password !== undefined) await this.passwordInput.fill(userData.password);
  }

  /**
   * Submits the registration form.
   */
  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  /**
   * Fills and submits the user registration form in one call.
   */
  async registerUser(userData: { firstName?: string; lastName?: string; email?: string; password?: string }): Promise<void> {
    await this.fillForm(userData);
    await this.submit();
  }
}
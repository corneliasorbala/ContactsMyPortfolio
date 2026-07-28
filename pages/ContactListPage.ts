import { Page, Locator } from '@playwright/test';

export class ContactListPage {
  readonly page: Page;
  readonly headerTitle: Locator;
  readonly subHeaderInstruction: Locator;
  readonly logoutButton: Locator;
  readonly addNewContactButton: Locator;
  readonly contactTable: Locator;
  readonly contactRows: Locator;
  readonly contactTableHeaders: Locator;

  constructor(page: Page) {
    this.page = page;
    this.headerTitle = page.locator('h1');
    this.subHeaderInstruction = page.locator('p', { hasText: 'Click on any contact to view the Contact Details' });
    this.logoutButton = page.locator('#logout');
    this.addNewContactButton = page.locator('#add-contact');
    this.contactTable = page.locator('table.contactTable');
    this.contactRows = page.locator('tr.contactTableBodyRow');
    this.contactTableHeaders = page.locator('table.contactTable th');
  }

  /**
   * Direct URL navigation to Contact List page
   */
  async navigate(): Promise<void> {
    await this.page.goto('https://thinking-tester-contact-list.herokuapp.com/contactList');
  }
  /**
   * Clicks the Logout button
   */
  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  /**
   * Clicks "Add a New Contact" button
   */
  async clickAddNewContact(): Promise<void> {
    await this.addNewContactButton.click();
  }

  /**
   * Clicks on a contact row specified by row index (0-based)
   */
  async clickContactRowByIndex(index: number): Promise<void> {
    await this.contactRows.nth(index).click();
  }

  /**
   * Clicks on a contact row matching the target full name
   */
  async clickContactByName(fullName: string): Promise<void> {
    await this.contactRows.filter({ hasText: fullName }).click();
  }

  /**
   * Gets object data parsed from a given row index
   */
  async getRowDataByIndex(index: number) {
    const row = this.contactRows.nth(index);
    const cells = row.locator('td');
    return {
      name: (await cells.nth(1).textContent())?.trim(),
      birthdate: (await cells.nth(2).textContent())?.trim(),
      email: (await cells.nth(3).textContent())?.trim(),
      phone: (await cells.nth(4).textContent())?.trim(),
      address: (await cells.nth(5).textContent())?.trim(),
      cityStatePostal: (await cells.nth(6).textContent())?.trim(),
      country: (await cells.nth(7).textContent())?.trim(),
    };
  }
}
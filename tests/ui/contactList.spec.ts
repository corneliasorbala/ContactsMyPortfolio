import { test, expect } from '../../fixtures/testFixtures';
import { TestDataGenerator } from '../../utils/TestDataGenerator';

/**
 * Test Suite: Contact List Main Dashboard Page (/contactList)
 * 
 * Verifies UI elements, user authentication guards, dynamic table rendering,
 * row click navigation, API seeding integrations, and session teardowns.
 */
test.describe('Contact List Dashboard Suite', () => {

  // Setup UI session state prior to each UI scenario
  test.beforeEach(async ({ page, loginPage, authedUser }) => {
    // StandardLoginPage extends LoginPage abstract class
    await loginPage.navigate();
    await loginPage.login(authedUser.email, authedUser.password);
    await expect(page).toHaveURL(/.*\/contactList/);
  });

  // =========================================================================
  // 1. PAGE LOAD, UI STRUCTURE & ACCESSIBILITY
  // =========================================================================

  test('UI Layout: Header, guidance text, and action controls display correctly', async ({ contactListPage }) => {
    await expect(contactListPage.headerTitle).toHaveText('Contact List');
    await expect(contactListPage.subHeaderInstruction).toBeVisible();
    await expect(contactListPage.logoutButton).toBeVisible();
    await expect(contactListPage.addNewContactButton).toBeVisible();
  });

  test('Table Structure: Table columns display expected headers', async ({ contactListPage }) => {
    const expectedHeaders = [
      'Name',
      'Birthdate',
      'Email',
      'Phone',
      'Address',
      'City, State/Province, Postal Code',
      'Country',
    ];

    await expect(contactListPage.contactTable).toBeVisible();
    for (const headerText of expectedHeaders) {
      await expect(contactListPage.contactTableHeaders.filter({ hasText: headerText })).toBeVisible();
    }
  });

  test('Empty State: New user has empty table with no contact rows', async ({ contactListPage }) => {
    await expect(contactListPage.contactRows).toHaveCount(0);
  });

  // =========================================================================
  // 2. DYNAMIC CONTACT DATA RENDERING (HYBRID API SEEDING)
  // =========================================================================

  test('Data Rendering: API-seeded contact correctly populates into UI table', async ({ page, contactListPage, contactApi, authedUser }) => {
    const contactData = TestDataGenerator.generateContact();
    
    // Seed contact via ContactApiClient
    const apiRes = await contactApi.addContact(authedUser.token, contactData);
    const createdContact = await apiRes.json();

    // Refresh page to render seeded state
    await page.reload();

    // Verify row count and parsed UI row data
    await expect(contactListPage.contactRows).toHaveCount(1);
    
    const uiRowData = await contactListPage.getRowDataByIndex(0);
    expect(uiRowData.name).toBe(`${contactData.firstName} ${contactData.lastName}`);
    expect(uiRowData.email).toBe(contactData.email);
    expect(uiRowData.phone).toBe(contactData.phone);

    // Teardown API contact
    await contactApi.deleteContact(authedUser.token, createdContact._id);
  });

  test('Multiple Records: Multiple seeded contacts render in individual rows', async ({ page, contactListPage, contactApi, authedUser }) => {
    const res1 = await contactApi.addContact(authedUser.token, TestDataGenerator.generateContact());
    const res2 = await contactApi.addContact(authedUser.token, TestDataGenerator.generateContact());
    
    const contact1 = await res1.json();
    const contact2 = await res2.json();

    await page.reload();

    await expect(contactListPage.contactRows).toHaveCount(2);

    // Teardown
    await contactApi.deleteContact(authedUser.token, contact1._id);
    await contactApi.deleteContact(authedUser.token, contact2._id);
  });

  // =========================================================================
  // 3. NAVIGATION & INTERACTION SCENARIOS
  // =========================================================================

  test('Navigation: Clicking "Add a New Contact" opens Add Contact form page', async ({ page, contactListPage }) => {
    await contactListPage.clickAddNewContact();
    await expect(page).toHaveURL(/.*\/addContact/);
  });

  test('Navigation: Clicking contact row navigates to Contact Details view', async ({ page, contactListPage, contactApi, authedUser }) => {
    const res = await contactApi.addContact(authedUser.token, TestDataGenerator.generateContact());
    const contact = await res.json();
    
    await page.reload();

    // Click contact row
    await contactListPage.clickContactByName(`${contact.firstName} ${contact.lastName}`);

    // Verify redirection to details page
    await expect(page).toHaveURL(/.*\/contactDetails/);

    // Teardown
    await contactApi.deleteContact(authedUser.token, contact._id);
  });

  test('Session & Teardown: Clicking Logout redirects user back to login page', async ({ page, contactListPage }) => {
    await contactListPage.logout();
    await expect(page).toHaveURL(/.*\/($|login)/);
  });

  // =========================================================================
  // 4. ROUTE SECURITY & AUTHENTICATION GUARD
  // =========================================================================

  test('Route Protection: Unauthenticated direct access redirects to root login page', async ({ page, context }) => {
    // Clear cookies/storage to simulate unauthenticated state
    await context.clearCookies();
    
    await page.goto('https://thinking-tester-contact-list.herokuapp.com/contactList');

    // Should redirect back to login
    await expect(page).toHaveURL(/.*\/($|login)/);
  });
});
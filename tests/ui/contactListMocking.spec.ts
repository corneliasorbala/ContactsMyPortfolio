import { test, expect } from '../../fixtures/mockFixtures';

/**
 * Portfolio Test Suite: Network Mocking, Resiliency, & Payload Injection
 * 
 * Demonstrates advanced SDET capabilities:
 * 1. UI testing against mocked API responses (stubbing).
 * 2. Simulating backend failure scenarios (resilience testing).
 * 3. Client-side request payload injection (security & schema validation).
 */
test.describe('Contact List - Network Interception & Mocking Suite', () => {

  test.beforeEach(async ({ page, loginPage, authedUser }) => {
    // Authenticate and navigate to dashboard state
    await loginPage.navigate();
    await loginPage.login(authedUser.email, authedUser.password);
  });

  // =========================================================================
  // 1. DATA MOCKING
  // =========================================================================

  test('Mocking: Verify UI renders custom mocked contacts correctly', async ({ page, contactListPage, mockContactList }) => {
    // 1. Arrange: Define deterministic mock dataset
    const mockedContacts = [
      {
        _id: 'mock_id_001',
        firstName: 'Mocked',
        lastName: 'UserOne',
        birthdate: '1995-05-15',
        email: 'mocked.one@portfolio.com',
        phone: '5551112222',
        city: 'Metropolis',
        country: 'USA',
      },
      {
        _id: 'mock_id_002',
        firstName: 'Mocked',
        lastName: 'UserTwo',
        birthdate: '1988-12-01',
        email: 'mocked.two@portfolio.com',
        phone: '5553334444',
        city: 'Gotham',
        country: 'USA',
      },
    ];

    // 2. Act: Activate network route mock before page refresh
    await mockContactList(mockedContacts, 200);
    await page.reload();

    // 3. Assert: UI table reflects exact mock state regardless of actual DB contents
    await expect(contactListPage.contactRows).toHaveCount(2);

    const firstRowData = await contactListPage.getRowDataByIndex(0);
    expect(firstRowData.name).toBe('Mocked UserOne');
    expect(firstRowData.email).toBe('mocked.one@portfolio.com');
  });

  test('Mocking: Verify UI handles empty state gracefully via API stubbing', async ({ page, contactListPage, mockContactList }) => {
    // Act: Inject empty array stub
    await mockContactList([], 200);
    await page.reload();

    // Assert: Table is completely empty
    await expect(contactListPage.contactRows).toHaveCount(0);
  });

});
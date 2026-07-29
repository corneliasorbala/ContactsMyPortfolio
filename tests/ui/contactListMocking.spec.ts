import { test, expect } from '../../fixtures/mockFixtures';

test.describe('Contact List - Network Interception & Mocking Suite', () => {

  test.beforeEach(async ({ loginPage, authedUser }) => {
    // Authenticate and navigate to dashboard state
    await loginPage.navigate();
    await loginPage.login(authedUser.email, authedUser.password);
  });

  // =========================================================================
  // 1. DATA MOCKING
  // =========================================================================

  test('Mocking: Verify UI renders custom mocked contacts correctly', async ({ loginPage, contactListPage, mockContactList, authedUser }) => {
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

    // 2. Act: Set up route interceptor BEFORE navigating or logging in
    await mockContactList(mockedContacts, 200);

    // Perform login or direct navigation to authenticated dashboard
    await loginPage.navigate();
    await loginPage.login(authedUser.email, authedUser.password);

    // Ensure dashboard table has loaded the mocked data
    await expect(contactListPage.contactRows).toHaveCount(2);

    // 3. Assert
    const firstRowData = await contactListPage.getRowDataByIndex(0);
    expect(firstRowData.name).toBe('Mocked UserOne');
    expect(firstRowData.email).toBe('mocked.one@portfolio.com');
  });
})


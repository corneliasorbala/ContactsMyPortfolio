import { test, expect } from '../../fixtures/testFixtures';
import { TestDataGenerator } from '../../utils/TestDataGenerator';

/**
 * Contact API Integration Test Suite
 * 
 * Validates the full RESTful CRUD lifecycle for contact records under the /contacts endpoint.
 * Ensures proper Bearer authorization, status code compliance, dynamic schema verification,
 * and individual test isolation through pre-test authentication seeding.
 */
test.describe('Contact API Suite', () => {
  let authToken: string;

  /**
   * Pre-test Hook: Ensures test isolation by registering a fresh user 
   * account via API before each scenario to extract an active JWT session token.
   */
  test.beforeEach(async ({ userApi }) => {
    // 1. Arrange: Generate unique dynamic user credentials
    const user = TestDataGenerator.generateUser();

    // 2. Act: Register user dynamically to seed authorization state
    const response = await userApi.addUser(user);
    const body = await response.json();

    // 3. Store isolated session token for subsequent API calls
    authToken = body.token;
  });

  // =========================================================================
  // 1. CREATE OPERATIONS (POST)
  // =========================================================================

  test('POST /contacts - Add a new contact', async ({ contactApi }) => {
    // 1. Arrange: Define complete contact payload
    const contactData = {
      firstName: 'John',
      lastName: 'Doe',
      birthdate: '1990-01-01',
      email: 'johndoe@example.com',
      phone: '8005550199',
      street1: '123 Main St',
      city: 'Anytown',
      stateProvince: 'NY',
      postalCode: '12345',
      country: 'USA'
    };

    // 2. Act: Execute contact creation endpoint with active token
    const response = await contactApi.addContact(authToken, contactData);

    // 3. Assert: Verify HTTP 201 Created response
    expect(response.status()).toBe(201);

    // 4. Assert Body: Validate persistent ID assignment and payload matching
    const body = await response.json();
    expect(body._id).toBeDefined();
    expect(body.firstName).toBe('John');
  });

  // =========================================================================
  // 2. READ OPERATIONS (GET)
  // =========================================================================

  test('GET /contacts - Fetch contact list for authenticated user', async ({ contactApi }) => {
    // 1. Act: Request contact list for the authenticated user context
    const response = await contactApi.getContacts(authToken);

    // 2. Assert: Verify HTTP 200 OK status
    expect(response.status()).toBe(200);

    // 3. Assert Body: Validate response structure evaluates to an Array
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  // =========================================================================
  // 3. UPDATE OPERATIONS (PUT)
  // =========================================================================

  test('PUT /contacts/:id - Update contact details', async ({ contactApi }) => {
    // 1. Arrange: Seed initial contact record
    const contactData = { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' };
    const createRes = await contactApi.addContact(authToken, contactData);
    const contact = await createRes.json();

    // 2. Act: Send full update payload with modified fields
    const updatedData = { ...contactData, firstName: 'JaneUpdated' };
    const updateRes = await contactApi.updateContact(authToken, contact._id, updatedData);

    // 3. Assert: Verify HTTP 200 OK status
    expect(updateRes.status()).toBe(200);

    // 4. Assert Body: Confirm specific property modification
    const body = await updateRes.json();
    expect(body.firstName).toBe('JaneUpdated');
  });

  // =========================================================================
  // 4. DELETE OPERATIONS (DELETE)
  // =========================================================================

  test('DELETE /contacts/:id - Delete a contact', async ({ contactApi }) => {
    // 1. Arrange: Seed contact record designated for removal
    const contactData = { firstName: 'Mark', lastName: 'Smith' };
    const createRes = await contactApi.addContact(authToken, contactData);
    const contact = await createRes.json();

    // 2. Act: Send hard-delete request target by entity ID
    const deleteRes = await contactApi.deleteContact(authToken, contact._id);

    // 3. Assert: Confirm successful resource destruction (HTTP 200 OK)
    expect(deleteRes.status()).toBe(200);
  });
});
import { test, expect } from '../../fixtures/testFixtures';
import { TestDataGenerator } from '../../utils/TestDataGenerator';

/**
 * User API Integration Test Suite
 * 
 * Verifies full RESTful CRUD lifecycle, authentication endpoints, and session 
 * token management for the /users route. Ensures schema compliance  and proper HTTP status code handling.
 */
test.describe('User API Suite', () => {

  // =========================================================================
  // 1. REGISTRATION & AUTHENTICATION ENDPOINTS
  // =========================================================================

  test('POST /users - Create new user successfully', async ({ userApi }) => {
    // 1. Arrange: Generate unique dynamic user credentials
    const user = TestDataGenerator.generateUser();

    // 2. Act: Send registration request to backend API
    const response = await userApi.addUser(user);

    // 3. Assert: Validate HTTP 201 Created status
    expect(response.status()).toBe(201);

    // 4. Assert Body: Verify returned payload schema, normalized email, and JWT token presence
    const body = await response.json();
    expect(body.user.email).toBe(user.email.toLowerCase());
    expect(body.user.firstName).toBe(user.firstName);
    expect(body.token).toBeDefined();
  });

  test('POST /users/login - Authenticate existing user', async ({ userApi }) => {
    // 1. Arrange: Pre-seed test user in backend DB
    const user = TestDataGenerator.generateUser();
    await userApi.addUser(user);

    // 2. Act: Submit login request with created credentials
    const loginResponse = await userApi.login({
      email: user.email,
      password: user.password
    });

    // 3. Assert: Validate HTTP 200 OK status
    expect(loginResponse.status()).toBe(200);

    // 4. Assert Body: Validate authenticated user profile and bearer token returned
    const body = await loginResponse.json();
    expect(body.user.email).toBe(user.email.toLowerCase());
    expect(body.token).toBeDefined();
  });

  // =========================================================================
  // 2. PROFILE MANAGEMENT (AUTHENTICATED ENDPOINTS)
  // =========================================================================

  test('GET /users/me - Get logged-in user profile', async ({ userApi }) => {
    // 1. Arrange: Seed account and capture session  token
    const user = TestDataGenerator.generateUser();
    const createRes = await userApi.addUser(user);
    const { token } = await createRes.json();

    // 2. Act: Fetch active user profile using Bearer token authentication
    const profileResponse = await userApi.getUserProfile(token);

    // 3. Assert: Validate HTTP 200 OK and match returned profile to registered data
    expect(profileResponse.status()).toBe(200);

    const body = await profileResponse.json();
    expect(body.email).toBe(user.email.toLowerCase());
  });

  test('PATCH /users/me - Update user profile', async ({ userApi }) => {
    // 1. Arrange: Register user and store auth token
    const user = TestDataGenerator.generateUser();
    const createRes = await userApi.addUser(user);
    const { token } = await createRes.json();

    // 2. Act: Send partial update payload (firstName change)
    const updatedData = { firstName: 'UpdatedFirstName' };
    const updateResponse = await userApi.updateUserProfile(token, updatedData);

    // 3. Assert: Verify HTTP 200 OK and validate updated property in response payload
    expect(updateResponse.status()).toBe(200);

    const body = await updateResponse.json();
    expect(body.firstName).toBe('UpdatedFirstName');
  });

  // =========================================================================
  // 3. SESSION TEARDOWN & ACCOUNT DELETION
  // =========================================================================

  test('POST /users/logout - Logout user session', async ({ userApi }) => {
    // 1. Arrange: Create user state and obtain active token
    const user = TestDataGenerator.generateUser();
    const createRes = await userApi.addUser(user);
    const { token } = await createRes.json();

    // 2. Act: Invalidate current auth session token
    const logoutResponse = await userApi.logout(token);

    // 3. Assert: Validate successful session revocation (HTTP 200 OK)
    expect(logoutResponse.status()).toBe(200);
  });

  test('DELETE /users/me - Delete user account', async ({ userApi }) => {
    // 1. Arrange: Seed user account to prepare for deletion testing
    const user = TestDataGenerator.generateUser();
    const createRes = await userApi.addUser(user);
    const { token } = await createRes.json();

    // 2. Act: Execute account hard-deletion via API
    const deleteResponse = await userApi.deleteUser(token);

    // 3. Assert: Confirm account destruction (HTTP 200 OK)
    expect(deleteResponse.status()).toBe(200);
  });
});
// import { test, expect } from '../../fixtures/testFixtures';
// import { TestDataGenerator } from '../../utils/TestDataGenerator';

// /**
//  * UI Authentication Test Suite
//  * Verifies key end-to-end user registration and authentication flows through the UI.
//  */
// test.describe('UI Authentication Suite', () => {

//   /**
//    * Test: User Registration

//    * Validates that a new user can navigate from the login page to the sign-up form,
//    * complete registration with dynamically generated test data, and successfully 
//    * land on the Contact List dashboard.
//    */
//   test('Register new user via UI', async ({ loginPage, addUserPage, contactListPage }) => {
//     // 1. Generate unique test data to guarantee test isolation and prevent duplicate user conflicts
//     const user = TestDataGenerator.generateUser();

//     // 2. Navigate to login and initiate sign-up navigation
//     await loginPage.navigate();
//     await loginPage.signUpButton.click();

//     // 3. Complete user registration form using Page Object abstraction
//     await addUserPage.registerUser(user);

//     // 4. Assert successful registration and redirection to main dashboard
//     await expect(contactListPage.headerTitle).toHaveText('Contact List');
//     await expect(contactListPage.logoutButton).toBeVisible();
//   });
// });
import { test, expect } from '../../fixtures/testFixtures';
import { TestDataGenerator } from '../../utils/TestDataGenerator';

/**
 * Expected backend error messages returned by the API during form submission validation.
 */
const PASSWORD_REQUIRED_ERROR = 'User validation failed: password: Path `password` is required.';
const REQUIRED_FIELDS_ERROR = 'User validation failed: firstName: Path `firstName` is required., lastName: Path `lastName` is required., email: Email is invalid, password: Path `password` is required.';
const INVALID_EMAIL_ERROR = 'User validation failed: email: Email is invalid';
const FIRST_NAME_REQUIRED_ERROR = 'User validation failed: firstName: Path `firstName` is required.';
const LAST_NAME_REQUIRED_ERROR = 'User validation failed: lastName: Path `lastName` is required.';

/**
 * Test vectors for boundary value analysis and negative validations.
 */
const INVALID_PASSWORDS = {
  spacesOnly: '   ',
  emptyPassword: '',
  shortPassword: 'Ab1!',
  noNumber: 'PasswordNoDigits!',
  noUppercase: 'password123!',
  noLowercase: 'PASSWORD123!',
  noSpecialChar: 'Password123',
  leadingTrailingSpaces: ' Password123! ',
  repeatedChars: 'AAAAAAA1!',
};


/**
 * Sign Up Page Validation Suite
 * 
 * Verifies end-to-end user registration flows through the UI, covering happy paths,
 * individual field validations, email format edge cases and UI navigation.
 */
test.describe('Sign Up Page Validation Suite', () => {
  let defaultUser: ReturnType<typeof TestDataGenerator.generateUser>;

  /**
   * Test Setup: Runs before every test in this suite.
   * Generates a fresh, unique user object and navigates to the 'Add User' screen via the UI.
   */
  test.beforeEach(async ({ page, loginPage }) => {
    defaultUser = TestDataGenerator.generateUser();

    // Navigate to Login page and transition to registration screen
    await loginPage.navigate();
    await loginPage.signUpButton.click();
    await expect(page).toHaveTitle('Add User');
  });

  // =========================================================================
  // 1. HAPPY PATH & SUCCESSFUL REGISTRATION SCENARIOS
  // =========================================================================

  test('Sign up with valid credentials (Happy Path)', async ({ page, addUserPage }) => {
    await addUserPage.registerUser(defaultUser);
    await expect(page).toHaveTitle('My Contacts');
  });

  // NEW: Verifies backend automatically converts emails to lowercase on account creation
  test('Sign up automatically converts uppercase email to lowercase', async ({ page, addUserPage }) => {
    const uppercaseEmailUser = {
      ...defaultUser,
      email: defaultUser.email.toUpperCase(),
    };

    await addUserPage.registerUser(uppercaseEmailUser);
    await expect(page).toHaveTitle('My Contacts');
  });

  // =========================================================================
  // 2. INDIVIDUAL FIELD & MANDATORY VALIDATION TESTS
  // =========================================================================

  test('Show validation error when all required fields are empty', async ({ addUserPage }) => {
    await addUserPage.submit();
    await expect(addUserPage.errorMessage).toHaveText(REQUIRED_FIELDS_ERROR);
  });

  // NEW: Verifies error when only First Name is omitted
  test('Show validation error when First Name is empty', async ({ addUserPage }) => {
    await addUserPage.registerUser({
      ...defaultUser,
      firstName: '',
    });
    await expect(addUserPage.errorMessage).toHaveText(FIRST_NAME_REQUIRED_ERROR);
  });

  // NEW: Verifies error when only Last Name is omitted
  test('Show validation error when Last Name is empty', async ({ addUserPage }) => {
    await addUserPage.registerUser({
      ...defaultUser,
      lastName: '',
    });
    await expect(addUserPage.errorMessage).toHaveText(LAST_NAME_REQUIRED_ERROR);
  });

  // NEW: Verifies error when only Email is omitted
  test('Show validation error when Email is empty', async ({ addUserPage }) => {
    await addUserPage.registerUser({
      ...defaultUser,
      email: '',
    });
    await expect(addUserPage.errorMessage).toHaveText(INVALID_EMAIL_ERROR);
  });

  // =========================================================================
  // 3. EMAIL FORMAT & EDGE CASE VALIDATIONS
  // =========================================================================

  test('Show invalid email error for missing @ symbol', async ({ addUserPage }) => {
    await addUserPage.registerUser({
      ...defaultUser,
      email: 'invalidemail.com',
    });
    await expect(addUserPage.errorMessage).toHaveText(INVALID_EMAIL_ERROR);
  });

  // Edge case check for email missing username portion (@domain.com)
  test('Show invalid email error when email is missing username prefix', async ({ addUserPage }) => {
    await addUserPage.registerUser({
      ...defaultUser,
      email: '@example.com',
    });
    await expect(addUserPage.errorMessage).toHaveText(INVALID_EMAIL_ERROR);
  });

  // Edge case check for email missing top-level domain (user@domain)
  test('Show invalid email error when email lacks TLD extension', async ({ addUserPage }) => {
    await addUserPage.registerUser({
      ...defaultUser,
      email: 'user@domain',
    });
    await expect(addUserPage.errorMessage).toHaveText(INVALID_EMAIL_ERROR);
  });

  // Edge case check for spaces inside email string
  test('Show invalid email error when email contains whitespace', async ({ addUserPage }) => {
    await addUserPage.registerUser({
      ...defaultUser,
      email: 'user name@example.com',
    });
    await expect(addUserPage.errorMessage).toHaveText(INVALID_EMAIL_ERROR);
  });

  // =========================================================================
  // 4. PASSWORD FIELD VALIDATIONS
  // =========================================================================

  test('Show password error when sending space as character in password field', async ({ addUserPage }) => {
    await addUserPage.registerUser({
      ...defaultUser,
      password: INVALID_PASSWORDS.spacesOnly,
    });
    await expect(addUserPage.errorMessage).toHaveText(PASSWORD_REQUIRED_ERROR);
  });

  test('Show password error when sending empty string in password field', async ({ addUserPage }) => {
    await addUserPage.registerUser({
      ...defaultUser,
      password: INVALID_PASSWORDS.emptyPassword,
    });
    await expect(addUserPage.errorMessage).toHaveText(PASSWORD_REQUIRED_ERROR);
  });

  test('Show password error when sending short password', async ({ addUserPage }) => {
    const shortPasswordError = `User validation failed: password: Path \`password\` (\`${INVALID_PASSWORDS.shortPassword}\`) is shorter than the minimum allowed length (7).`;

    await addUserPage.registerUser({
      ...defaultUser,
      password: INVALID_PASSWORDS.shortPassword,
    });
    await expect(addUserPage.errorMessage).toHaveText(shortPasswordError);
  });


  // =========================================================================
  // 6. UI NAVIGATION & FORM CONTROLS
  // =========================================================================

  // Verifies Cancel button returns user back to Login screen
  test('UI Navigation: Clicking Cancel button returns to Login page', async ({ page, addUserPage }) => {
    await addUserPage.cancelButton.click();
    await expect(page).toHaveTitle('Contact List App');
  });

  // =========================================================================
  // KNOWN BUGS / SECURITY BOUNDARY TESTS
  // =========================================================================

  // test('BUG: Show password error when sending no numbers in password', async ({ addUserPage }) => {
  //   await addUserPage.registerUser({
  //     ...defaultUser,
  //     password: INVALID_PASSWORDS.noNumber,
  //   });
  //   await expect(addUserPage.errorMessage).toHaveText(PASSWORD_REQUIRED_ERROR);
  // });

  // test('BUG: Show password error when sending only lowercase letters', async ({ addUserPage }) => {
  //   await addUserPage.registerUser({
  //     ...defaultUser,
  //     password: INVALID_PASSWORDS.noUppercase,
  //   });
  //   await expect(addUserPage.errorMessage).toHaveText(PASSWORD_REQUIRED_ERROR);
  // });

  // test('BUG: Show password error when sending only uppercase letters', async ({ addUserPage }) => {
  //   await addUserPage.registerUser({
  //     ...defaultUser,
  //     password: INVALID_PASSWORDS.noLowercase,
  //   });
  //   await expect(addUserPage.errorMessage).toHaveText(PASSWORD_REQUIRED_ERROR);
  // });

  // test('BUG: Show password error when sending password with no special characters', async ({ addUserPage }) => {
  //   await addUserPage.registerUser({
  //     ...defaultUser,
  //     password: INVALID_PASSWORDS.noSpecialChar,
  //   });
  //   await expect(addUserPage.errorMessage).toHaveText(PASSWORD_REQUIRED_ERROR);
  // });

  // test('BUG: Show password error when sending leading/trailing spaces', async ({ addUserPage }) => {
  //   await addUserPage.registerUser({
  //     ...defaultUser,
  //     password: INVALID_PASSWORDS.leadingTrailingSpaces,
  //   });
  //   await expect(addUserPage.errorMessage).toHaveText(PASSWORD_REQUIRED_ERROR);
  // });

  // test('BUG: Show password error when sending only repeated characters', async ({ addUserPage }) => {
  //   await addUserPage.registerUser({
  //     ...defaultUser,
  //     password: INVALID_PASSWORDS.repeatedChars,
  //   });
  //   await expect(addUserPage.errorMessage).toHaveText(PASSWORD_REQUIRED_ERROR);
  // });
}); 
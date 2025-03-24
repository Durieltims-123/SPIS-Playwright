import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Adjust the path as needed

let loginPage: LoginPage; // Declare global variable

test.beforeAll(async ({ browser }) => {
    // ✅ Initialize loginPage, but DON'T log in
    const context = await browser.newContext();
    const page = await context.newPage();
    loginPage = new LoginPage(page);
});

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page); // ✅ Create a new instance with the provided `page`
    await loginPage.goto(); // ✅ Ensure we always start from the login page
});

test.afterEach(async ({ page }) => {
    await page.waitForTimeout(2000); // Wait for 2 seconds after each test (if needed)
});

// ✅ Validate Empty Username and Password
test('Validate Empty Username and Password', async () => {
    await loginPage.clickLoginButton();
    await loginPage.validateUsernameError();
});

// ✅ Validate Non-Existent Username
test('Validate Inexisting Username', async () => {
    await loginPage.enterUsername('admin_test123');
    await loginPage.enterPassword('12345');
    await loginPage.clickLoginButton();
    await loginPage.validateUsernameError();
});

// ✅ Validate Wrong Password
test('Validate Wrong Password', async () => {
    await loginPage.enterUsername('admin_test');
    await loginPage.enterPassword('12345');
    await loginPage.clickLoginButton();
    // Uncomment if you have a function to validate password errors
    // await loginPage.validatePasswordError();
});

// ✅ Validate Successful Login
test('Validate Successful Login', async () => {
    await loginPage.login('admin_test', 'test_password');
    // await expect(loginPage.page).toHaveURL(/dashboard/); // ✅ Ensure user is redirected to dashboard
});

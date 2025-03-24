import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Adjust the path as needed


let loginPage: LoginPage  // Declare as global variable

test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    loginPage = new LoginPage(page);

    // ✅ Save session state
    await context.storageState({ path: 'storageState.json' });
});


test.beforeEach(async ({ page }) => {
    await loginPage.goto();
});


test.afterEach(async ({ page }) => {
    await page.waitForTimeout(2000); // Waits for 2 seconds
});


test('Validate Empty Username and Password', async ({ page }) => {
    loginPage.clickLoginButton()
    loginPage.validateUsernameError
});


test('Validate Inexisting Username', async ({ page }) => {
    const loginPage = new LoginPage(page)
    loginPage.enterUsername('admin_test123')
    loginPage.enterPassword('12345')
    loginPage.clickLoginButton()
    loginPage.validateUsernameError
});


test('Validate Wrong Password ', async ({ page }) => {
    const loginPage = new LoginPage(page)
    loginPage.enterUsername('admin_test')
    loginPage.enterPassword('12345')
    loginPage.clickLoginButton()
    // loginPage.validatePasswordError()
});


test('Validate Successful Login', async ({ page }) => {
    const loginPage = new LoginPage(page)
    loginPage.login('admin_test', 'test_password')
});


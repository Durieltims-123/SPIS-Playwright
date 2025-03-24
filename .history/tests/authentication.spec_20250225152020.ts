import { test, expect, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Adjust path if needed

let page: Page; // Declare page globally
let loginPage: LoginPage; // Declare loginPage globally
let context: BrowserContext; // Declare context globally

test.beforeAll(async ({ browser }) => {
    test.setTimeout(60000);
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page); // Instantiate loginPage once
});

test.beforeEach(async () => {
    await loginPage.goto()
})


test.afterEach(async () => {
    await page.waitForTimeout(2000) // Waits for 2 seconds
})


test('Validate Empty Username and Password', async () => {
    await loginPage.clickLoginButton()
    await loginPage.validateUsernameError
})


test('Validate Inexisting Username', async () => {
    await loginPage.enterUsername('admin_test123')
    await loginPage.enterPassword('12345')
    await loginPage.clickLoginButton()
    await loginPage.validateUsernameError
})


test('Validate Wrong Password ', async () => {
    await loginPage.enterUsername('admin_test')
    await loginPage.enterPassword('12345')
    await loginPage.clickLoginButton()
    await loginPage.validatePasswordError()
})


test('Validate Successful Login', async () => {
    await loginPage.login('admin_test', 'test_password')
})


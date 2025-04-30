import { test, expect, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Adjust path if needed

let page: Page; // Declare page globally
let loginPage: LoginPage; // Declare loginPage globally
let context: BrowserContext; // Declare context globally

test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    loginPage = new LoginPage(page); // Instantiate loginPage once
});

test.beforeEach(async () => {
    test.setTimeout(60000);
    await loginPage.goto()
})


test.afterEach(async () => {
    await page.waitForTimeout(2000) // Waits for 2 seconds
})


test('SPIS-00001 | Validate Empty Username and Password', async () => {
    await loginPage.clickLoginButton()
    await loginPage.validateUsernameError
})

test('SPIS-00002 | Throws an error', async () => {
    await loginPage.login('durieltims', 'Password12345!')
})


test('SPIS-00003 | Validate Inexisting Username', async () => {
    await loginPage.enterUsername('admin_test123')
    await loginPage.enterPassword('12345')
    await loginPage.clickLoginButton()
    await loginPage.validateUsernameError
})


test('SPIS-00004 | Validate Wrong Password ', async () => {
    await loginPage.enterUsername('durieltims')
    await loginPage.enterPassword('12345')
    await loginPage.clickLoginButton()
    await loginPage.validatePasswordError()
})


test('SPIS-00005 | Validate Successful Login', async () => {
    await loginPage.login('durieltims', 'Password123!')
})




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


// test.afterEach(async () => {
//     await page.waitForTimeout(2000) // Waits for 2 seconds
// })


// test('Validate Empty Username and Password', async () => {
//     loginPage.clickLoginButton()
//     loginPage.validateUsernameError
//     await page.pause()
// })


test('Validate Inexisting Username', async () => {
    page.locator('input[placeholder="username"]').waitFor
    page.locator('input[placeholder="username"]').fill('admin_test')
    page.locator('input[placeholder="password"]').waitFor
    page.locator('input[placeholder="password"]').fill('1234567890')
    await page.screenshot({ path: 'screenshots/screenshot.png' });

    // page.locator('input[name="password"]').waitFor
    // page.locator('input[name="password"]').fill('admin_test')
    // loginPage.enterUsername('admin_test123')
    // loginPage.enterPassword('12345')
    // loginPage.clickLoginButton()
    // loginPage.validateUsernameError
})


// test('Validate Wrong Password ', async () => {
//     // await page.goto('http://172.31.208.231/spis-testing/login');
//     // loginPage = new LoginPage(page)
//     // await loginPage.goto()


//     // loginPage.enterUsername('admin_test')
//     // loginPage.enterPassword('12345')
//     // loginPage.clickLoginButton()
//     // loginPage.validatePasswordError()
// })


// test('Validate Successful Login', async () => {
//     // loginPage = new LoginPage(page)
//     // loginPage.login('admin_test', 'test_password')
// })




// test.beforeEach(async () => {
//     const loginPage = new LoginPage(page)
//     await loginPage.login('admin_test', 'test_password')
// })

// test('User can access dashboard', async () => {
//     // await page.goto('/dashboard') // Navigates while already logged in

//     // // Example: Verify the user is logged in
//     // await expect(page.locator('text=Logout')).toBeVisible()
// })

// test('Access Login', async () => {
//     await page.goto('/dashboard') // Navigates while already logged in

//     // Example: Verify the user is logged in
//     await expect(page.locator('text=Logout')).toBeVisible()
// })



// test('User can view profile', async () => {
//     await page.goto('/profile') // Navigates while already logged in

//     // Example: Verify profile details are visible
//     await expect(page.locator('h1')).toHaveText('Profile')
// })

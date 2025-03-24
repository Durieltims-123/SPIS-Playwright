import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Adjust the path as needed


let loginPage: LoginPage  // Declare as global variable

test.beforeAll(async ({ page }) => {
    loginPage = new LoginPage(page)
})

test.beforeEach(async ({ page }) => {
    await page.route('**/*.{js,css,png,jpg,svg}', async (route) => {
        // Serve the response from cache if available
        const cachedResponse = await route.fetch();
        await route.fulfill({ response: cachedResponse });
    });

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




// test.beforeEach(async ({ page }) => {
//     const loginPage = new LoginPage(page)
//     await loginPage.login('admin_test', 'test_password')
// });

// test('User can access dashboard', async ({ page }) => {
//     // await page.goto('/dashboard'); // Navigates while already logged in

//     // // Example: Verify the user is logged in
//     // await expect(page.locator('text=Logout')).toBeVisible();
// });

// test('Access Login', async ({ page }) => {
//     await page.goto('/dashboard'); // Navigates while already logged in

//     // Example: Verify the user is logged in
//     await expect(page.locator('text=Logout')).toBeVisible();
// });



// test('User can view profile', async ({ page }) => {
//     await page.goto('/profile'); // Navigates while already logged in

//     // Example: Verify profile details are visible
//     await expect(page.locator('h1')).toHaveText('Profile');
// });

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Adjust the path as needed



test('Validate Inexisting Username', async ({ page }) => {

});


test('Validate Wrong Password ', async ({ page }) => {

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

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Adjust the path as needed


let loginPage: LoginPage  // Declare as global variable


test('Validate Empty Username and Password', async ({ page }) => {
    await page.goto('http://172.31.208.231/spis-testing/login')
});

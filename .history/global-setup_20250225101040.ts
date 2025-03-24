import { chromium } from '@playwright/test';
import { LoginPage } from './pages/LoginPage'; // Adjust path as needed

async function globalSetup() {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.goto(); // Automatically goes to login page
    await loginPage.login('admin_test', 'test_password'); // Uses LoginPage object

    // Save session
    await page.context().storageState({ path: 'auth.json' });

    await browser.close();
}

export default globalSetup;

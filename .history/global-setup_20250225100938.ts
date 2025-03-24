import { chromium } from '@playwright/test';

async function globalSetup() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('http://172.31.208.231/spis-testing/login');
    await page.getByRole('textbox', { name: 'username' }).fill('admin_test');
    await page.getByRole('textbox', { name: 'password' }).fill('test_password');
    await page.getByRole('button', { name: 'Login' }).click();

    // Save the authentication state
    await page.context().storageState({ path: 'auth.json' });

    await browser.close();
}

export default globalSetup;

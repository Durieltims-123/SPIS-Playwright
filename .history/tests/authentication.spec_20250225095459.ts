import { test, expect } from '@playwright/test';

test('Login', async ({ page }) => {
    await page.goto('http://172.31.208.231/spis-testing/');
    await page.getByRole('listitem').filter({ hasText: 'Login' }).click();
    await page.getByRole('textbox', { name: 'username' }).click();
    await page.getByRole('textbox', { name: 'username' }).fill('admin_test');
    await page.getByRole('textbox', { name: 'password' }).click();
    await page.getByRole('textbox', { name: 'password' }).fill('test_password');
    await page.getByRole('button', { name: 'Login' }).click();
});
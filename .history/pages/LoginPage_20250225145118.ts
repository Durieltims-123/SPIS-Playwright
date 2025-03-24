import { Page, expect } from '@playwright/test';

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Corrected selectors
    get usernameField() {
        return this.page.locator('input[type="text"][placeholder="username"]')
    }

    get passwordField() {
        return this.page.locator('input[placeholder="password"]'); // Changed type="text" to correct selector
    }

    get loginButton() {
        return this.page.locator('input[type="submit"][value="Login"]');
    }

    async goto() {
        await this.page.goto('http://172.31.208.231/spis-testing/login', { waitUntil: 'domcontentloaded' });
    }

    async enterUsername(username: string) {
        await this.usernameField.waitFor(); // Ensure field is available before interaction
        await this.usernameField.fill(username);
    }

    async enterPassword(password: string) {
        await this.passwordField.waitFor(); // Ensure field is available before interaction
        await this.passwordField.fill(password);
    }

    async validateUsernameError() {
        const errorPopup = this.page.locator('div[id="swal2-content"]');
        await errorPopup.waitFor(); // Ensure error message appears
        await expect(errorPopup).toHaveText('Username does not yet exist.');
    }

    async validatePasswordError() {
        const errorPopup = this.page.locator('div[id="swal2-content"]');
        await errorPopup.waitFor({ timeout: 30000 }); // Ensure it appears before asserting
        await expect(errorPopup).toBeVisible();
        await expect(errorPopup).toContainText('Incorrect Username or Password.');
    }

    async clickLoginButton() {
        await this.loginButton.waitFor(); // Ensure button is ready before clicking
        await this.loginButton.click({ force: true });
    }

    async login(username: string, password: string) {
        await this.goto(); // Ensure navigation is awaited
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();

        // Wait for the dashboard to load properly
        await this.page.waitForURL(/dashboard/, { timeout: 15000 });
        await expect(this.page).toHaveURL(/dashboard/);
    }
}

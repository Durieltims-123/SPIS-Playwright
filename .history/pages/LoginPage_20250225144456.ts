import { Page, expect } from '@playwright/test'

export class LoginPage {
    private page: Page


    constructor(page: Page) {
        this.page = page
    }


    // Getters for locators (Fix initialization issue)
    get usernameField() {
        return this.page.locator('input[type="text"][placeholder="username"]')
    }

    get passwordField() {
        return this.page.locator('input[type="text"][placeholder="password"]')
    }

    get loginButton() {
        return this.page.locator('input[type="submit"][value="Login"]')
    }


    async goto() {
        await this.page.goto('http://172.31.208.231/spis-testing/login', { waitUntil: 'domcontentloaded' });
    }


    async enterUsername(username: string) {
        await this.usernameField.click();
        await this.usernameField.fill(username);
    }

    async enterPassword(password: string) {
        await this.passwordField.click();
        await this.passwordField.fill(password);
    }

    async validateUsernameError() {
        await this.page.waitForSelector('div[id="swal2-content"]');
        await expect(this.page.locator('div[id="swal2-content"]')).toHaveText('Username does not yet exist.');
    }


    async validatePasswordError() {
        await this.page.waitForSelector('div[id="swal2-content"]', { timeout: 30000 });
        await expect(this.page.locator('div[id="swal2-content"]')).toBeVisible();
        await expect(this.page.locator('div[id="swal2-content"]')).toContainText('Incorrect Username or Password.');
    }


    async clickLoginButton() {
        this.loginButton.click({ force: true });

    }

    async login(username: string, password: string) {
        await this.goto(); // Ensure this is awaited properly
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();

        // await this.page.waitForURL('http://172.31.208.231/spis-testing/dashboard', { timeout: 15000 });
        // await expect(this.page).toHaveURL('http://172.31.208.231/spis-testing/dashboard');

    }

}

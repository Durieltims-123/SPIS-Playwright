import { Page, expect } from '@playwright/test'

export class LoginPage {
    private page: Page

    constructor(page: Page) {
        this.page = page
    }

    async goto() {
        await this.page.goto('http://172.31.208.231/spis-testing/login', { waitUntil: 'domcontentloaded' });
    }


    async enterUsername(username: string) {
        await this.page.getByPlaceholder('username').click();
        await this.page.getByPlaceholder('username').fill(username);
    }

    async enterPassword(password: string) {
        await this.page.getByPlaceholder('password').click();
        await this.page.getByPlaceholder('password').fill(password);
    }


    async validateUsernameError() {
        await this.page.waitForSelector('div[id="swal2-content"]', { timeout: 5000 });
        await expect(this.page.locator('div[id="swal2-content"]')).toHaveText('Username does not yet exist.');
    }


    async validatePasswordError() {
        await this.page.waitForSelector('div[id="swal2-content"]', { timeout: 5000 });
        await expect(this.page.locator('div[id="swal2-content"]')).toContainText('Incorrect Username or Password.')
    }


    async clickLoginButton() {
        await this.page.getByRole('button', { name: 'Login' }).click()
    }

    async login(username: string, password: string) {
        await this.goto(); // Ensure this is awaited properly
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();

        // Wait until redirected to the dashboard
        await expect(this.page).toHaveURL('http://172.31.208.231/spis-testing/dashboard', { timeout: 10000 });
    }

}

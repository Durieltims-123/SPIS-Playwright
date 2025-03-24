import { Page } from '@playwright/test'

export class LoginPage {
    private page: Page

    constructor(page: Page) {
        this.page = page
    }

    async goto() {
        await this.page.goto('http://172.31.208.231/spis-testing/login') // Directly navigate to login page
    }

    async enterUsername(username: string) {
        await this.page.getByRole('textbox', { name: 'username' }).fill(username)
    }

    async enterPassword(password: string) {
        await this.page.getByRole('textbox', { name: 'password' }).fill(password)
    }


    async validateUsernameError(password: string) {
        await expect(this.page.locator('input[name="username"]')).toBeEnabled();
    }


    async validatePasswordError(password: string) {
        await this.page.getByRole('textbox', { name: 'password' }).fill(password)
    }


    async clickLoginButton() {
        await this.page.getByRole('button', { name: 'Login' }).click()
    }

    async login(username: string, password: string) {
        await this.goto()
        await this.enterUsername(username)
        await this.enterPassword(password)
        await this.clickLoginButton()
    }
}

import { expect, test as base} from '@playwright/test'
import { fillInputByName } from '../utils/fillers'

export { expect }

export const test = base.extend({
	user: [async ({ browser }, use, workerInfo) => {
		// Unique username.
		const username = 'user' + workerInfo.workerIndex
		const password = 'verysecure'

		// Create the account with Playwright.
		const page = await browser.newPage()
		await page.goto('/register')

		// Wait for JS to kick in.
		await page.waitForSelector('body.sk-started', { timeout: 15000 })
		const form = page.getByTestId('register-form')
		await expect(form).toBeAttached()
		await expect(form).toBeEnabled()

		await fillInputByName({
			name: 'username',
			locator: form,
			data: username
		})
		await fillInputByName({
			name: 'password',
			locator: form,
			data: password
		})
		const submissionElement = form.locator('button[type="submit"]')

		await expect(submissionElement).toBeAttached()
		await expect(submissionElement).toBeEnabled()

		const registerRequestPromise = page.waitForRequest(request =>
			request.url() === page.url() && request.method() === 'POST',
		)
		await submissionElement.click()

		const registerRequest = await registerRequestPromise

		expect(await registerRequest.response().then(e => e?.status())).toBe(200)
		// Check if redirecet successful
		// expect(page).toHaveURL(url => url.pathname === '/signin')

		// Cleanup.
		await page.close()

		// Use the account value.
		await use({username, password})
	}, { scope: 'worker' }],
	page: async ({ page, user }, use) => {

		await page.goto('/signin')

		// Wait for JS to kick in.
		await page.waitForSelector('body.sk-started', { timeout: 15000 })
		const form = page.getByTestId('signin-form')
		await expect(form).toBeAttached()
		await expect(form).toBeEnabled()


		await fillInputByName({
			name: 'username',
			locator: form,
			data: user.username
		})
		await fillInputByName({
			name: 'password',
			locator: form,
			data: user.password
		})
		const submissionElement = form.locator('button[type="submit"]')

		await expect(submissionElement).toBeAttached()
		await expect(submissionElement).toBeEnabled()

		const signinRequestPromise = page.waitForRequest(request =>
			request.url() === page.url() && request.method() === 'POST',
		)
		await submissionElement.click()

		const signinRequest = await signinRequestPromise

		expect(await signinRequest.response().then(e => e?.status())).toBe(200)

		await use(page)
	}
})

import { expect, test as unAuthTest } from '@playwright/test'
import { test } from './fixtures/signed-in'


test.describe.configure({
	mode: 'parallel'
})

test('Home page — Greeting', async ({ page, user }) => {
	await page.goto('/')
	await expect(page.locator('h1')).toContainText(user.username)
})

test('Cookies exist', async ({ page, context }) => {
	await page.goto('/')
	const cookies = await context.cookies(page.url())

	expect(cookies.length).toBe(1)
	expect(cookies.find(c => c.name === 'sid')).toBeDefined()
})

test('Access to own edit page', async ({ page, user }) => {
	const editPage = await page.goto(`/user/${user.username}/edit`)

	expect(editPage?.status()).toBe(200)
	await expect(page.locator('h1')).toHaveText(`Your username: ${user.username}`)
	await expect(page.getByTestId('auth')).toBeAttached()
	const authObject = await page.getByTestId('auth').evaluate((element) => {
		if (element.textContent) {
			return JSON.parse(element.textContent)
		}
	})
	expect(authObject).toHaveProperty('isAuthenticated', true)
	expect(authObject).toHaveProperty('isAuthorized', true)
	expect(authObject).toHaveProperty('strategy', 'cookie')
	expect(authObject).toHaveProperty('credentials.username', user.username)
	expect(authObject).toHaveProperty('artifacts.session.sessionToken')
	expect(authObject).toHaveProperty('artifacts.session.username', user.username)
})

test('Access to someone else\'s edit page', async ({ page, user }) => {
	const editPage = await page.goto('/user/bob/edit')

	expect(editPage?.status()).toBe(403)
	await expect(page.getByTestId('auth')).not.toBeAttached()
})

unAuthTest('Access to edit page without login', async ({ page }) => {
	const editPage = await page.goto('/user/bob/edit')

	expect(editPage?.status()).toBe(401)
	await expect(page.getByTestId('auth')).not.toBeAttached()
})


test('Who am I - Logged in', async ({ page, user }) => {
	const whoamiPage = await page.goto('/whoami')

	expect(whoamiPage?.status()).toBe(200)
	await expect(page.locator('h1')).toHaveText(`You are: ${user.username}`)
	await expect(page.getByTestId('auth')).toBeAttached()
	const authObject = await page.getByTestId('auth').evaluate((element) => {
		if (element.textContent) {
			return JSON.parse(element.textContent)
		}
	})
	expect(authObject).toHaveProperty('isAuthenticated', true)
	expect(authObject).toHaveProperty('isAuthorized', true)
	expect(authObject).toHaveProperty('strategy', 'cookie')
	expect(authObject).toHaveProperty('credentials.username', user.username)
	expect(authObject).toHaveProperty('artifacts.session.sessionToken')
	expect(authObject).toHaveProperty('artifacts.session.username', user.username)
})

unAuthTest('Who am I - Not logged in', async ({ page }) => {
	const whoamiPage = await page.goto('/whoami')

	expect(whoamiPage?.status()).toBe(200)
	await expect(page.locator('h1')).toHaveText('You are: stranger')
	await expect(page.getByTestId('auth')).toBeAttached()
	const authObject = await page.getByTestId('auth').evaluate((element) => {
		if (element.textContent) {
			return JSON.parse(element.textContent)
		}
	})
	expect(authObject).toHaveProperty('isAuthenticated', false)
	expect(authObject).toHaveProperty('isAuthorized', true)
	expect(authObject).toHaveProperty('strategy', 'cookie')
	expect(authObject).not.toHaveProperty('credentials.username')
	expect(authObject).not.toHaveProperty('artifacts.session.sessionToken')
	expect(authObject).not.toHaveProperty('artifacts.session.username')
})

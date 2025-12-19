import { expect, test as unAuthTest } from '@playwright/test'
import { test } from './fixtures/signed-in.js'


test.describe.configure({
	mode: 'parallel'
})

test('Access to /users page with auth', async ({ page, user }) => {
	const editPage = await page.goto('/users')

	expect(editPage?.status()).toBe(200)
	const usersUl = page.getByTestId('users')
	await expect(usersUl).toBeAttached()
	expect(await usersUl.locator('li').count()).toBeGreaterThan(1)
	await expect(usersUl.locator('li').getByText(user.username)).toBeAttached()
})

unAuthTest('Access to /users page without auth', async ({ page }) => {
	await page.goto('/users')

	const usersUl = page.getByTestId('users')
	expect(await usersUl.locator('li').count()).toBe(0)
})



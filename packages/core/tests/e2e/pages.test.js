import { expect } from '@playwright/test'
import { test } from './fixtures/signed-in'


test.describe.configure({
	mode: 'parallel'
})

test('Home page — Greeting', async ({ page, user }) => {
	await page.goto('/')
	await expect(page.locator('h1')).toContainText(user.username)
})

test('Check if cookies exist', async ({ page, context }) => {
	await page.goto('/')
	const cookies = await context.cookies(page.url())

	expect(cookies.length).toBe(1)
	expect(cookies.find(c => c.name === 'sid')).toBeDefined()
})

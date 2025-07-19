import { page } from '@vitest/browser/context'
import { describe, expect, test } from 'vitest'


describe('Login', () => {
	test('x', async () => {
		// await page.goto('/')
		const a = page.getByText('Welcome to SvelteKit')

		await expect.element(a).toBeInTheDocument()
		console.log(a)
	})
})

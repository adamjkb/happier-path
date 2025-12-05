import { form, getRequestEvent } from '$app/server'
import { db } from '$dev/db/client.js'
import { getUserByUsername } from '$dev/db/users.js'
import { CookieAuthentication } from '$dev/strategies/cookie.js'
import { fail, redirect } from '@sveltejs/kit'
import { argon2Verify } from 'hash-wasm'
import * as z from 'zod'

const signinFormSchema = z.object({
	username: z.string(),
	password: z.string(),
})

export const signinForm = form(signinFormSchema, async (data) => {
	const username = data.username
	const password = data.password

	const { locals } = getRequestEvent()
	const user = await getUserByUsername({ username }, db)
	if (password && user && user.password) {
		const validPassword = await argon2Verify({
			hash: user.password,
			password: password
		})

		if (validPassword && user.id && typeof user.id === 'number') {
			const strategy = locals.happier?.authManager?.getStrategyByName?.('cookie')
			if (strategy && strategy instanceof CookieAuthentication) {
				await strategy.createSession(user)
				redirect(303, '/')
			} else {
				fail(500)
			}
		}

		return {
			success: validPassword
		}
	}
})

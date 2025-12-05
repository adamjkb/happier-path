import { db } from '$dev/db/client.js'
import { getUserByUsername } from '$dev/db/users.js'
import { routeManager } from '$lib/managers/route.js'
import { CookieAuthentication } from '$dev/strategies/cookie.js'
import { redirect } from '@sveltejs/kit'
import { fail } from '@sveltejs/kit'
import { argon2Verify } from 'hash-wasm'

export const load = routeManager({
	auth: {
		strategies: ['cookie'],
		mode: 'try'
	},
	/** @type {import('./$types').PageServerLoad} */
	handler: async function ({ locals }) {
		if (locals.auth?.isAuthenticated === true) {
			redirect(307, '/')
		}
	}
})


/** @satisfies {import('./$types').Actions} */
export const actions = {
	default: async ({ request, locals }) => {
		const data = await request.formData()
		const username = String(data.get('username'))
		const password = data.get('password')

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
	}
}

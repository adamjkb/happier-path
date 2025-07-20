import { init as dbInit } from '$lib/_db/init.js'
import { happierHook } from '$lib/hooks'
import { BasicAuthentication } from '$lib/_strategies/basic-auth'
import { CookieAuthentication } from '$lib/_strategies/cookie'
import { sequence } from '@sveltejs/kit/hooks'

/** @type {import('@sveltejs/kit').Handle} */
export async function fallback({ event, resolve }) {
	const response = await resolve(event)
	return response
}

export const handle = sequence(happierHook({
	authStrategies: {
		'simple': new BasicAuthentication({ username: 'x', password: 'y' }),
		'cookie': new CookieAuthentication({ cookie: 'sid' })
	},
}), fallback)


export const init = async () => {
	await dbInit()
}

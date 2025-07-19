import { init as dbInit } from '$lib/_db/init.js'
import { AuthenticationManager } from '$lib/managers/auth'
import { configSchema } from '$lib/schemas'
import { BasicAuthentication } from '$lib/strategies/basic-auth'
import { CookieAuthentication } from '$lib/strategies/cookie'
import { sequence } from '@sveltejs/kit/hooks'

/** @type {import('@sveltejs/kit').Handle} */
export async function fallback({ event, resolve }) {
	const response = await resolve(event)
	return response
}



/**
 *
 * @returns {import('@sveltejs/kit').Handle}
 */
const happierHandlers = ({ authStrategies } = {}) => {
	const res = configSchema.parse({authStrategies})
	console.log(res)
	return async ({event, resolve}) => {

		// try {
		// 	for (const strategy of authStrategies) {
		// 		const outcome = await strategy?.authenticate?.()
		// 		if (outcome instanceof Authenticated === false) {
		// 			throw new Response('Unauthorized', {
		// 				status: 500
		// 			})
		// 		}
		// 	}
		// } catch (err) {
		// 	console.log(err)
		// 	return err
		// }
		// if (authStrategies) {
		// 	event.locals.routeManager ??= {
		// 		authStrategies
		// 	}
		// }
		event.locals.happier ??= {}
		if (authStrategies) {
			event.locals.happier.authManager =  new AuthenticationManager({ authStrategies })
		}

		const response = await resolve(event)
		return response
	}
}

export const handle = sequence(happierHandlers({
	authStrategies: {
		'simple': new BasicAuthentication({ username: 'x', password: 'y' }),
		'cookie': new CookieAuthentication({ cookie: 'sid' })
	},
}), fallback)


export const init = async () => {
	await dbInit()
}

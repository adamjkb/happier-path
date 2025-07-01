import { AuthenticationManager } from '$lib/managers/auth'
import { BasicAuthentication } from '$lib/strategies/basic-auth'
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
		'simple': new BasicAuthentication({ username: 'x', password: 'y' })
	},
}), fallback)

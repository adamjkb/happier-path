import { routeManager } from '$lib/managers/route.js'

export const load = routeManager({
	auth: {
		strategies: ['cookie'],
		mode: 'try',
	},
	/** @type {import('./$types').PageServerLoad} */
	handler: async function ({ locals }) {
		const { errorResponse, ...auth } = locals.auth
		return {
			auth: auth
		}
	}
})

import { routeManager } from '$lib/managers/route'

export const load = routeManager({
	auth: {
		strategies: ['cookie'],
		mode: 'try',
	},
	/** @type {import('./$types').PageServerLoad} */
	handler: async function ({ locals }) {
		return {
			...(locals.auth?.credentials && ({
				user: locals.auth?.credentials
			}))
		}
	}
})

import { routeManager } from '$lib/managers/route.js'

export const load = routeManager({
	auth: {
		strategies: ['cookie'],
		mode: 'required',
		scope: {
			required: ['username:{params.username}'],
		},
	},
	/** @type {import('./$types').PageServerLoad} */
	handler: async function ({ locals }) {
		return {
			auth: locals.auth
		}
	}
})

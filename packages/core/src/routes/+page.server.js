import { routeManager } from '$lib/managers/route'

export const load = routeManager({
	auth: {
		strategies: ['cookie'],
		mode: 'try',
		scope: {
			// required: ['{params.id}'],
			// forbidden: ['regular'],
			// some: ['basic'],
		},
	},
	/** @type {import('./$types').PageServerLoad} */
	handler: async function ({ locals, params }) {

		console.log(locals.auth)
		return {
			...(locals.auth?.credentials && ({
				user: locals.auth?.credentials
			}))
		}
	}
})

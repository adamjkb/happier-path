import { routeManager } from '$lib/managers/route'

export const load = routeManager({
	auth: {
		strategies: ['cookie'],
		mode: 'try',
		scope: {
			// required: ['user-id-{credentials.id}'],
			// forbidden: ['regular'],
			// some: ['basic'],
		},
	},
	/** @type {import('./$types').PageServerLoad} */
	handler: async function ({ request, locals }) {
		console.log(locals.auth)
		return {
			hi: locals.auth?.credentials?.username
		}
	}
})

import { db } from '$lib/_db/client'
import { createUser } from '$lib/_db/users'
import { routeManager } from '$lib/managers/route'
import { redirect } from '@sveltejs/kit'

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
	default: async ({ request }) => {
		const data = await request.formData()
		const username = String(data.get('username'))
		const password = String(data.get('password'))

		await createUser({ username, password }, db)

		redirect(303, '/signin')
	}
}

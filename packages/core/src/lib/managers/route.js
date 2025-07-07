export function routeManager({ handler, auth }) {
	/** @type {import('./$types').PageServerLoad} */
	return async (event) => {
		if (auth) {
			await event.locals.happier?.authManager?.handleLoad(auth)
		}
		return handler?.(event)
	}
}

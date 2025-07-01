function routeManager({ handler, auth }) {
    /** @type {import('./$types').PageServerLoad} */
    return async (event) => {
        if (auth) {
            await event.locals.happier?.authManager?.handleLoad(auth)
        }
        return handler?.(event)
    }
}



export const load = routeManager({
    auth: {
        strategies: ['simple'],
        mode: 'required',
        scope: {
            // required: ['user-id-{credentials.id}'],
            forbidden: ['regular'],
            // some: ['basic'],
        },
    },
    /** @type {import('./$types').PageServerLoad} */
    handler: async function ({ request, locals }) {
        return {
            hi: locals.auth?.credentials?.id
        }
    }
})
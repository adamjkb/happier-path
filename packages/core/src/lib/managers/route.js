import * as z from 'zod/v4'

/**
 * @template T
 * @param {Pick<z.infer<typeof routeManagerSchema>, 'auth'> & { handler: T }} args
 * @returns {T}
 */
export function routeManager(args) {
	const { handler, auth } = routeManagerSchema.parse(args)

	return async (event) => {
		if (auth) {
			await event.locals.happier?.authManager?.handleLoad(auth)
		}
		return handler?.(event)
	}
}

export const routeManagerAuthSchema = z.object({
	strategies: z.array(z.string()).min(1),
	mode: z.enum(['try', 'required']).default('required'),
	scope: z.partialRecord(
		z.enum(['required', 'forbidden', 'some']),
		z.array(z.string()).min(1)
	).optional()
})



export const routeManagerSchema = z.object({
	auth: routeManagerAuthSchema.optional(),
	handler: z.instanceof(Function)
})

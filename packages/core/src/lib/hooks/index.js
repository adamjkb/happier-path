import { AuthenticationManager } from '$lib/managers/auth.js'
import { with_request_store } from '$lib/utils/event-request.js'
import * as z from 'zod/v4'

/**
 *
 * @param {z.infer<typeof happierHookSchema>} args
 * @returns {import('@sveltejs/kit').Handle}
 */
export function happierHook({ authStrategies }) {
	happierHookSchema.parse({ authStrategies })

	return async ({event, resolve}) => {
		return await with_request_store({ event }, async () => {
			event.locals.happier ??= {}
			if (authStrategies) {
				if (event.locals.happier.authManager instanceof AuthenticationManager) {
					throw new Error('@happier-path/core authentication manager is already initialized.')
				} else {
					event.locals.happier.authManager =  new AuthenticationManager({ authStrategies })
				}
			}

			const response = await resolve(event)
			return response
		})
	}
}

const authStrategyLikeRecord = z.record(
	z.string(),
	z.object({
		authenticate: z.instanceof(Function)
	})
)

export const happierHookSchema = z.object({
	authStrategies: authStrategyLikeRecord
}).required()

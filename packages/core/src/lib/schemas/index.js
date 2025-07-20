import * as z from 'zod/v4'

import { Authentication } from '$lib/responses'


export const authenticateFunction = z.function({
	input: [z.any()],
	output: z.instanceof(Authentication)
})

const authStrategyLike = z.record(
	z.string(),
	z.object({
		authenticate: z.instanceof(Function)
	})
)

export const configSchema = z.object({
	authStrategies: authStrategyLike
}).required()


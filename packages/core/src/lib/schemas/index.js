import * as z from 'zod/v4'

import { Authentication } from '$lib/responses/index.js'


export const authenticateFunction = z.function({
	input: [z.any()],
	output: z.instanceof(Authentication)
})

const authStrategyLike = z.record(
	z.string(),
	z.strictObject({
		authenticate: z.instanceof(Function)
	})
)

export const configSchema = z.strictObject({
	authStrategies: authStrategyLike
}).required()


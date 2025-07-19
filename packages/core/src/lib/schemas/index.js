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


export const routeManagerAuthSchema = z.object({
	strategies: z.array(z.string()).min(1),
	mode: z.enum(['try', 'required']).default('required'),
	scope: z.record(
		z.enum(['required', 'forbidden', 'some']),
		z.array(z.string()).min(1).optional()
	).optional()
})

export const routeManagerSchema = z.object({
	auth: routeManagerAuthSchema.optional(),
	handler: z.instanceof(Function)
}).required()


// TODO test config

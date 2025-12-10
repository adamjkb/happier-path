import { Authentication, forbidden, MissingAuthentication, unauthorized } from '$lib/responses/index.js'
import { getRequestEvent } from '$lib/utils/event-request.js'
import { delveTemplate } from '$lib/utils/string.js'
import { error, redirect } from '@sveltejs/kit'

/** @import { ScopeModes } from '../../types/auth.d.ts' */

/** @typedef {import('zod').infer < typeof import('../hooks/index.js').happierHookSchema>} AuthStrategyInput */

/**
 * @type {RouteAuthConfig | null}
 */
let config_storage = null

/** @type {import('node:async_hooks').AsyncLocalStorage<RouteAuthConfig | null>} */
let als

/**
 * Shamelessly copied from https://github.com/sveltejs/kit/blob/b45cd46471c28e5948706e41c99d5db4236a40f9/packages/kit/src/runtime/app/server/event.js#L9
 */
import('node:async_hooks')
	.then((hooks) => (als = new hooks.AsyncLocalStorage()))
	.catch(() => {
		// can't use AsyncLocalStorage, but can still call getRequestEvent synchronously.
		// this isn't behind `supports` because it's basically just StackBlitz (i.e.
		// in-browser usage) that doesn't support it AFAICT
	})

/**
 * Returns the current `RouteAuthConfig`.
 */
function get_route_auth_config() {
	const config = config_storage ?? als?.getStore()

	if (!config) {
		throw new Error('Cannot read route config storage')
	}

	return config
}

/**
 * @template T
 * @param {RouteAuthConfig | null} config
 * @param {() => T} fn
 */
function run_with_config(config, fn) {
	try {
		config_storage = config
		return als ? als.run(config, fn) : fn()
	} finally {
		config_storage = null
	}
}

export class AuthenticationManager {
	/** @type {AuthStrategyInput['authStrategies']} */
	#strategies

	/**
	 *
	 * @param {AuthStrategyInput} param0
	 */
	constructor({ authStrategies }) {
		this.#strategies = authStrategies
	}

	async #execute_strategy(name) {
		let authentication
		let errorResponse
		const strategy = this.#strategies[name]

		try {
			authentication = await strategy.authenticate()


			if (authentication instanceof Authentication === false) {
				throw new Response(null, { status: 500 })
			}
		} catch (thrownOutcome) {
			if (thrownOutcome instanceof Response) {
				errorResponse = thrownOutcome
			} else {
				errorResponse = new Response('Failed to run strategy', {
					status: 500
				})
			}
		}

		return {
			authentication,
			errorResponse
		}
	}

	#validate_outcome(outcome, strategy_name) {
		const event = getRequestEvent()
		const config = get_route_auth_config()
		event.locals.auth.isAuthenticated = !outcome.errorResponse

		if (outcome.errorResponse) {

			// Non-error response
			if (outcome.errorResponse instanceof Response === false) {
				return outcome.errorResponse
			}

			if (outcome.errorResponse instanceof MissingAuthentication) {
				// Missing authenticated
				return outcome.errorResponse
			}
		}



		event.locals.auth.strategy = strategy_name
		event.locals.auth.credentials = outcome.authentication?.credentials
		event.locals.auth.artifacts = outcome.authentication?.artifacts

		// Authenticated
		if (!outcome.errorResponse) {
			return
		}


		// Unauthenticated
		event.locals.auth.errorResponse = outcome.errorResponse

		if (config.mode === 'try') {
			return
		}

		throw outcome.errorResponse
	}

	async #authenticate() {
		const event = getRequestEvent()
		const config = get_route_auth_config()

		// Already has credentials
		if (event.locals.auth?.credentials) {
			this.#validate_outcome({ authentication: { credentials: event.locals.auth.credentials, artifacts: event.locals.auth.artifacts } })
			return
		}

		for (const name of config.strategies) {
			const outcome = await this.#execute_strategy(name)
			const outcome_error = this.#validate_outcome(outcome, name)

			if (!outcome_error) {
				return
			}

			if (outcome_error instanceof MissingAuthentication === false) {
				return outcome_error
			}
		}

		// No more strategies
		const errorResponse = unauthorized('Missing authentication')
		if (config.mode === 'required') {
			throw errorResponse
		}

		event.locals.auth.isAuthenticated = false
		event.locals.auth.credentials = null
		event.locals.auth.errorResponse = errorResponse
	}

	/**
     *
     * @param {string[]} scopes
     * @param {any} template_ctx
     * @param {ScopeModes} type
     */
	#validate_scopes(scopes, template_ctx, type) {
		/** @type {string[]} */
		let scope_errors = []
		const error_symbol = Symbol('SCOPE_ERROR')
		const expanded_scopes = scopes.map((scope) => {
			if (!template_ctx?.credentials?.scope) {
				scope_errors.push(scope)
			}

			try {
				return delveTemplate(scope, template_ctx, error_symbol)
			} catch {
				scope_errors.push(scope)
			}
		})

		let is_valid = false

		const { length: count } = expanded_scopes.filter(scope => template_ctx.credentials?.scope?.includes?.(scope))

		if (type === 'required' && count === expanded_scopes.length) {
			is_valid = true
		} else if (type === 'forbidden' && count === 0) {
			is_valid = true
		} else if (type === 'some' && count > 0) {
			is_valid = true
		} else {
			scope_errors = [...expanded_scopes]
		}

		return {
			is_valid,
			errors: scope_errors
		}
	}

	/**
     * @returns {boolean}
     */
	#validate_access() {
		const event = getRequestEvent()
		const config = get_route_auth_config()
		const credentials = event.locals.auth?.credentials

		// No scope, free to go
		if (!config.scope || Object.keys(config.scope).length === 0) {
			return true
		}

		if (!credentials) {
			if (config.mode !== 'required') {
				return false
			}

			throw forbidden('Request is unauthenticated')
		}

		/** @type {string[]} */
		let scope_errors = []

		const template_ctx = {
			params: event.params,
			credentials
		}

		if (config.scope.required) {
			const required_scopes = this.#validate_scopes(config.scope.required, template_ctx, 'required')

			if (!required_scopes.is_valid) {
				scope_errors = [...scope_errors, ...required_scopes.errors]
			}
		}

		if (config.scope.forbidden) {
			const forbidden_scopes = this.#validate_scopes(config.scope.forbidden, template_ctx, 'forbidden')

			if (!forbidden_scopes.is_valid) {
				scope_errors = [...scope_errors, ...forbidden_scopes.errors]
			}
		}

		if (config.scope.some) {
			const some_scopes = this.#validate_scopes(config.scope.some, template_ctx, 'some')

			if (!some_scopes.is_valid) {
				scope_errors = [...scope_errors, ...some_scopes.errors]
			}
		}

		if (scope_errors.length) {
			throw forbidden(`Insufficient scope. ${scope_errors.join(', ')}.`)
		}

		return true
	}

	#acces() {
		const event = getRequestEvent()
		event.locals.auth.isAuthorized = this.#validate_access()
	}

	async #routify(err) {
		if (err instanceof Response) {
			// set headers
			if (err.headers.keys().next().value) {
				const event = getRequestEvent()
				// Since it's a route, avoid interfering with Svelte rendering of content type
				const ignored_headers = ['content-type']
				const headers = Object.fromEntries(Array.from(err.headers.entries()).filter(([header]) => !ignored_headers.includes(header)))
				event.setHeaders(headers)
			}

			// redirect
			if ((err.status > 300 || err.status < 308) && err.headers.get('location')) {
				const location = err.headers.get('location')
				if (location) {
					redirect(err.status, location)
				}
				error(500,  { message: 'Redirect doesn\'t contain location.' })
			}

			if (err.status > 400 || err.status < 599) {
				error(err.status, { message: await err.text() ?? 'Internal error'})
			}
			// error
			error(500, { message: 'Invalid response.'})
		} else {
			error(500, { message: 'Bad auth implementation. Non-response error.'})
		}
	}

	/**
     *
     * @param {RouteAuthConfig} config
     */
	async handleLoad(config) {
		return run_with_config(config, async () => {
			const event = getRequestEvent()
			event.locals.auth ??= event.locals.auth || {}
			try {
				await this.#authenticate()
			} catch (err) {
				await this.#routify(err)
			}


			try {
				this.#acces()
			} catch (err) {
				await this.#routify(err)
			}

		})
	}

	getStrategyByName(name) { return this.#strategies[name] }

	/**
	 *
	 * @param {AuthStrategyInput['authStrategies']} strategies
	 */
	appendStrategies(strategies) {
		if (
			Object.keys(this.#strategies).some((v) => Object.keys(strategies).some(s => v ===s))
		) {
			throw new Error(`Strategy name already exist. Trying to merge ${Object.keys(strategies)} into existing strategies named: ${Object.keys(this.#strategies)}`)
		} else {
			this.#strategies = Object.assign(strategies, this.#strategies)
		}
	}
}

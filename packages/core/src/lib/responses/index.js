/**
 * @param {BodyInit | null} [body]
 * @param {Omit<ResponseInit, 'status'>} [init]
 */
export const unauthorized = (body, init) => {
	return new Response(body, {
		...init,
		status: 401,
	})
}

/**
 * @param {BodyInit | null} [body]
 * @param {Omit<ResponseInit, 'status'>} [init]
 */
export const forbidden = (body, init) => {
	return new Response(body, {
		...init,
		status: 403,
	})
}

export class Authentication {
	artifacts = null
	credentials = null
	constructor({ credentials, artifacts }) {
		this.artifacts = artifacts
		this.credentials = credentials
	}
}

export class MissingAuthentication {
	constructor() {
		return new Response('Missing authentication', {
			status: 401,
		})
	}
}

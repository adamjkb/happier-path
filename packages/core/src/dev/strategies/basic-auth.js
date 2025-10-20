import { getRequestEvent } from '$app/server'
import { Authentication, unauthorized } from '$lib/responses'

export class BasicAuthentication {
	#username = ''
	#password = ''
	#realm = 'server'

	constructor({ username, password, realm = null }) {
		this.#username = username
		this.#password = password
		if (realm) {
			this.#realm = realm
		}
	}

	async authenticate() {
		const event = getRequestEvent()

		if (!event.request.headers.has('authorization')) {
			throw unauthorized('Missing authentication', {
				headers: {
					'WWW-Authenticate': `Basic realm="${this.#realm}"`
				}
			})
		} else {
			const authHeader = event.request.headers.get('authorization')
			if (authHeader) {
				const parts = authHeader.split(/\s+/)
				// @TODO Verify if parts[0] is `Basic`

				const [u, p] = Buffer.from(parts[1], 'base64').toString().split(':')

				if (u === this.#username && p === this.#password) {
					return new Authentication({
						credentials: {
							id: this.#username,
						},
						artifacts: {}
					})
				}
			}
		}
	}

}

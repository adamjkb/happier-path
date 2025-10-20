import { getRequestEvent } from '$app/server'
import { db } from '$dev/db/client'
import { createSession, deleteSessionById, generateSessionToken, getSessionByToken, updateSessionExpiresAtById } from '$dev/db/sessions'
import { Authentication, unauthorized } from '$lib/responses'

export class CookieAuthentication {
	#cookie = 'sid'
	#sessionExpiresInSeconds = 60 * 60 * 24 * 30 // 30 days

	constructor({ cookie }) {
		this.#cookie = cookie
	}

	async authenticate() {
		const event = getRequestEvent()

		const cookieValue = event.cookies.get(this.#cookie)

		if (!cookieValue) {
			throw unauthorized('Missing authentication')
		} else {
			const session = await getSessionByToken({ sessionToken: cookieValue }, db)

			if (!session) {
				throw unauthorized('Missing authentication')
			} else {
				const isSessionValid = await this.validateSession(session)
				if (isSessionValid) {
					return new Authentication({
						credentials: {
							id: session.userId,
							username: session.username,
							scope: [`username:${session.username}`]
						},
						artifacts: {
							session
						}
					})
				} else {
					throw unauthorized('Invalid session')
				}
			}
		}
	}

	async createSession(user) {
		const { cookies } = getRequestEvent()

		const now = new Date()
		const sessionToken = generateSessionToken()
		const expiresAt = new Date(now.getTime() + 1000 * this.#sessionExpiresInSeconds)
		// Create session
		await createSession({
			userId: user.id,
			expiresAt: expiresAt,
			sessionToken
		}, db)
		const session = await getSessionByToken({ sessionToken }, db)

		cookies.set(this.#cookie, session.sessionToken, {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			expires: expiresAt,
			secure: !import.meta.env.DEV
			// secure: false
		})
	}

	async validateSession(session) {
		const now = new Date()

		if (now.getTime() >= new Date(session.expiresAt).getTime()) {
			await deleteSessionById({ id: session.id }, db)
			return false
		}

		// Half way through session
		if (now.getTime() >= new Date(session.expiresAt).getTime() - (1000 * this.#sessionExpiresInSeconds) / 2) {
			// TODO: Top up session expiry
			await updateSessionExpiresAtById({
				id: session.id,
				expiresAt: new Date(now.getTime() + 1000 * this.#sessionExpiresInSeconds)
			}, db)
		}

		return true
	}

}

import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding'

export function generateSessionToken() {
	const bytes = globalThis.crypto.getRandomValues(new Uint8Array(25))
	return encodeBase32LowerCaseNoPadding(bytes)
}

/**
 * @param {{ userId: number; expiresAt: Date; sessionToken: string; }} param0
 * @param {import('@libsql/client').Transaction | import('@libsql/client').Client} connection
 */
export async function createSession({ userId, expiresAt, sessionToken }, connection) {
	return await connection.execute({
		sql: 'INSERT INTO sessions (userId, sessionToken, expiresAt) VALUES (:userId, :sessionToken, :expiresAt)',
		args: {
			userId: String(userId),
			sessionToken,
			expiresAt: expiresAt.toISOString()
		}
	})
}

/**
 * @param {{ sessionToken: string; }} param0
 * @param {import('@libsql/client').Transaction | import('@libsql/client').Client} connection
 */
export async function getSessionByToken({ sessionToken }, connection) {
	const { rows } = await connection.execute({
		sql: 'SELECT s.id, s.sessionToken, s.expiresAt, u.username, u.id as userId FROM sessions s INNER JOIN users u ON s.userId = u.id WHERE sessionToken = (:sessionToken) LIMIT 1',
		args: {
			sessionToken
		}
	})
	return rows[0]
}

/**
 * @param {{ id: number; }} param0
 * @param {import('@libsql/client').Transaction | import('@libsql/client').Client} connection
 */
export async function deleteSessionById({ id }, connection) {
	await connection.execute({
		sql: 'DELETE FROM sessions WHERE id = (:id)',
		args: {
			id
		}
	})
}

/**
 * @param {{ id: number; expiresAt: Date }} param0
 * @param {import('@libsql/client').Transaction | import('@libsql/client').Client} connection
 */
export async function updateSessionExpiresAtById({ id, expiresAt }, connection) {
	await connection.execute({
		sql: 'UPDATE sessions SET expiresAt = (:expiresAt) WHERE id = (:id)',
		args: {
			id,
			expiresAt: expiresAt.toISOString()
		}
	})
}

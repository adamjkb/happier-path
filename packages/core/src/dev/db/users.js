import { argon2id } from 'hash-wasm'

/**
 * @param {{ username: string; password: string; }} param0
 * @param {import('@libsql/client').Transaction | import('@libsql/client').Client} connection
 */
export async function createUser({ username, password }, connection) {
	const salt = globalThis.crypto.getRandomValues((new Uint8Array(16)))

	const hashedPassword = await argon2id({
		hashLength: 32,
		memorySize: 19531,
		parallelism: 1,
		iterations: 2,
		outputType: 'encoded',
		password: password,
		salt,
	})

	await connection.execute({
		sql: 'INSERT INTO users (username, password) VALUES (:username, :password)',
		args: {
			username,
			password: hashedPassword
		}
	})
}

/**
 * @param {{ username: string; }} param0
 * @param {import('@libsql/client').Transaction | import('@libsql/client').Client} connection
 */
export async function getUserByUsername({ username }, connection) {
	const { rows } = await connection.execute({
		sql: 'SELECT * FROM users WHERE username = :username LIMIT 1',
		args: {
			username
		}
	})

	return rows[0]
}

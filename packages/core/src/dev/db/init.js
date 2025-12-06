import { db } from './client.js'
import { user1, user2 } from './seed-data.js'
import { createUser } from './users.js'

async function createTables() {
	await db.batch(
		[
			`CREATE TABLE IF NOT EXISTS "users" (
				"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
				"username" TEXT NOT NULL,
				"password" TEXT NOT NULL
			)`,
			`CREATE TABLE IF NOT EXISTS "sessions" (
				"id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
				"sessionToken" TEXT NOT NULL,
				"userId" TEXT NOT NULL,
				"expiresAt" DATETIME NOT NULL,

				CONSTRAINT "session_userid_fk" FOREIGN KEY("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
			)`,
			'CREATE UNIQUE INDEX IF NOT EXISTS "users_username_key" ON "users"("username")',
			'CREATE UNIQUE INDEX IF NOT EXISTS "sessions_sessionToken_key" ON "sessions"("sessionToken")'
		],
		'write',
	)
}

async function seedData() {
	const tx = await db.transaction('write')
	try {
		const { rows } = await tx.execute('SELECT * FROM users')
		// Don't reseed if rows have data
		if (rows.length === 0) {
			await createUser({ ...user1 }, tx)
			await createUser({ ...user2 }, tx)
			await tx.commit()
		}
	} catch (err) {
		console.error(err)
		await tx?.rollback()
	} finally {
		tx.close()
	}
}

export async function init() {
	await createTables()
	await seedData()
}

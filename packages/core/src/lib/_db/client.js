import { createClient } from '@libsql/client'

function getDb() {
	return createClient({
		url: 'file::memory:?cache=shared'
	})
}

export const db = getDb()


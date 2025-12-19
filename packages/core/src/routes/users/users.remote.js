import { query } from '$app/server'
import { db } from '$dev/db/client.js'
import { getAllUsers } from '$dev/db/users.js'
import { remoteFunctionManager } from '$lib/managers/route.js'

export const allUsers = query('unchecked', remoteFunctionManager(
	{
		auth: {
			mode: 'required',
			strategies: ['cookie'],
		},
		handler: async () => {
			const users = await getAllUsers(db)
			return users
		}
	}
))


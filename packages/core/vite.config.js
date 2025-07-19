import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	test: {
		// browser: {
		// 	provider: 'playwright',
		// 	enabled: true,
		// 	headless: true,
		// 	instances: [
		// 		{ browser: 'chromium' },
		// 	]
		// }
	}
})

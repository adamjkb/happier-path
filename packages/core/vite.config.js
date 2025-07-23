import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		commonjsOptions: {
			dynamicRequireTargets: ['@libsql/*']
		},
		rollupOptions: {
			external: ['@libsql/*'],
		}
	},
	test: {
		browser: {
			provider: 'playwright',
			enabled: true,
			headless: false,
			instances: [
				{ browser: 'chromium' },
			]
		}
	}
})
